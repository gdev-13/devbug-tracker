import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import AppSidebar from '../../components/AppSidebar/AppSidebar';
import { clearAuthData } from '../../services/authStorage';
import { getProjects } from '../../services/projectsService';

import './Projects.css';

const statusLabels = {
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluído',
  PAUSED: 'Pausado',
};

const statusVariants = {
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  PAUSED: 'warning',
};

function formatDate(date) {
  if (!date) {
    return 'Sem data';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearAuthData();
        navigate('/login');
        return;
      }

      setErrorMessage(
        'Não foi possível carregar os projetos. Verifique se o backend está rodando.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <main className="projects-page">
      <AppSidebar />

      <section className="projects-content">
        <header className="projects-header">
          <div>
            <span className="projects-header__tag">Projetos</span>

            <h1>Seus projetos.</h1>

            <p>
              Organize os sistemas em desenvolvimento e acompanhe os bugs
              relacionados a cada projeto.
            </p>
          </div>

          <button type="button" className="button button--primary" onClick={() => navigate('/projects/new')}>
            Adicionar projeto
          </button>
        </header>

        {isLoading && (
          <div className="projects-feedback">
            Carregando projetos...
          </div>
        )}

        {errorMessage && (
          <div className="projects-feedback projects-feedback--error" role="alert">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && projects.length === 0 && (
          <section className="projects-empty">
            <span>▣</span>
            <h2>Nenhum projeto cadastrado ainda.</h2>
            <p>
              Crie seu primeiro projeto para começar a registrar bugs e
              acompanhar soluções.
            </p>
            <button type="button" className="button button--primary" onClick={() => navigate('/projects/new')}>
              Criar primeiro projeto
            </button>
          </section>
        )}

        {!isLoading && !errorMessage && projects.length > 0 && (
          <section className="projects-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.id}>
                <div className="project-card__top">
                  <span
                    className={`project-card__status project-card__status--${
                      statusVariants[project.status] || 'info'
                    }`}
                  >
                    {statusLabels[project.status] || project.status}
                  </span>

                  <small>#{project.id}</small>
                </div>

                <h2>{project.name}</h2>

                <p>
                  {project.description || 'Projeto sem descrição cadastrada.'}
                </p>

                <div className="project-card__techs">
                  {project.technologies
                    ?.split(',')
                    .map((technology) => technology.trim())
                    .filter(Boolean)
                    .map((technology) => (
                      <span key={technology}>{technology}</span>
                    ))}
                </div>

                <footer className="project-card__footer">
                  <small>Criado em {formatDate(project.createdAt)}</small>
                  <button type="button">Ver detalhes →</button>
                </footer>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

export default Projects;