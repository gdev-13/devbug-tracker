import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import AppSidebar from '../../components/AppSidebar/AppSidebar';
import { clearAuthData } from '../../services/authStorage';
import { getBugsByProjectId } from '../../services/bugService';
import { deleteProject, getProjectById } from '../../services/projectsService';

import './ProjectDetails.css';

const statusLabels = {
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluído',
  PAUSED: 'Pausado',
};

const bugStatusLabels = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em andamento',
  RESOLVED: 'Resolvido',
};

const severityLabels = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
};

function formatDate(date) {
  if (!date) {
    return 'Sem data';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProjectDetails = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const [projectData, bugsData] = await Promise.all([
        getProjectById(id),
        getBugsByProjectId(id),
      ]);

      setProject(projectData);
      setBugs(bugsData);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearAuthData();
        navigate('/login');
        return;
      }

      setErrorMessage(
        'Não foi possível carregar os detalhes do projeto. Verifique se o backend está rodando.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadProjectDetails();
  }, [loadProjectDetails]);

  async function handleDeleteProject() {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir este projeto? Os bugs vinculados a ele também podem ser removidos. Essa ação não pode ser desfeita.',
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage('');

    try {
      await deleteProject(id);

      navigate('/projects');
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearAuthData();
        navigate('/login');
        return;
      }

      setErrorMessage(
        'Não foi possível excluir o projeto. Verifique se ele ainda possui dependências ou se o backend está rodando.',
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="project-details-page">
      <AppSidebar />

      <section className="project-details-content">
        <header className="project-details-header">
          <div>
            <span className="project-details-header__tag">Detalhes do projeto</span>

            <h1>{project?.name || 'Carregando projeto...'}</h1>

            <p>
              Visualize as informações do projeto e acompanhe os bugs registrados
              nele.
            </p>
          </div>

          <div className="project-details-header__actions">
            <button
              type="button"
              className="button button--ghost"
              onClick={() => navigate('/projects')}
            >
              Voltar
            </button>
            <button
              type="button"
              className="button button--ghost"
              onClick={() => navigate(`/projects/${id}/edit`)}
            >
              Editar projeto
            </button>

              <button
                type="button"
                className="button button--danger"
                onClick={handleDeleteProject}
                disabled={isDeleting}
              >
                {isDeleting ? 'Excluindo...' : 'Excluir projeto'}
              </button>

            <button type="button" className="button button--primary" onClick={() => navigate(`/projects/${id}/bugs/new`)}>
              Adicionar bug
            </button>
          </div>
        </header>

        {isLoading && (
          <div className="project-details-feedback">
            Carregando detalhes do projeto...
          </div>
        )}

        {errorMessage && (
          <div className="project-details-feedback project-details-feedback--error" role="alert">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && project && (
          <>
            <section className="project-details-card">
              <div className="project-details-card__top">
                <span>{statusLabels[project.status] || project.status}</span>
                <small>#{project.id}</small>
              </div>

              <p>
                {project.description || 'Projeto sem descrição cadastrada.'}
              </p>

              <div className="project-details-card__techs">
                {project.technologies
                  ?.split(',')
                  .map((technology) => technology.trim())
                  .filter(Boolean)
                  .map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
              </div>

              <footer>
                <small>Criado em {formatDate(project.createdAt)}</small>
                <small>Atualizado em {formatDate(project.updatedAt)}</small>
              </footer>
            </section>

            <section className="project-bugs-section">
              <div className="project-bugs-section__header">
                <div>
                  <h2>Bugs do projeto</h2>
                  <p>{bugs.length} bug(s) registrado(s)</p>
                </div>
              </div>

              {bugs.length === 0 ? (
                <div className="project-bugs-empty">
                  <span>⌬</span>
                  <h3>Nenhum bug registrado neste projeto.</h3>
                  <p>
                    Quando você cadastrar bugs, eles aparecerão aqui vinculados
                    a este projeto.
                  </p>
                </div>
              ) : (
                <div className="project-bugs-list">
                  {bugs.map((bug) => (
                    <article className="project-bug-card" key={bug.id}>
                      <div className="project-bug-card__top">
                        <span>{bugStatusLabels[bug.status] || bug.status}</span>
                        <strong>{severityLabels[bug.severity] || bug.severity}</strong>
                      </div>

                      <h3>{bug.title}</h3>

                      <p>{bug.description || 'Sem descrição cadastrada.'}</p>

                      <footer>
                        <small>{bug.technology || 'Tecnologia não informada'}</small>
                        <button type="button" onClick={() => navigate(`/bugs/${bug.id}`)}>
                          Ver bug →
                        </button>
                      </footer>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}

export default ProjectDetails;