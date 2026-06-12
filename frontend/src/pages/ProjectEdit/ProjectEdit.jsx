import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import AppSidebar from '../../components/AppSidebar/AppSidebar';
import { clearAuthData } from '../../services/authStorage';
import { getProjectById, updateProject } from '../../services/projectsService';

import '../ProjectCreate/ProjectCreate.css';

const initialFormData = {
  name: '',
  description: '',
  technologies: '',
  status: 'IN_PROGRESS',
};

function getProjectErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (!error.response) {
    return 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
  }

  return 'Não foi possível salvar o projeto. Verifique os dados informados.';
}

function ProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadProject = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const project = await getProjectById(id);

      setFormData({
        name: project.name || '',
        description: project.description || '',
        technologies: project.technologies || '',
        status: project.status || 'IN_PROGRESS',
      });
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearAuthData();
        navigate('/login');
        return;
      }

      setErrorMessage(
        'Não foi possível carregar o projeto. Verifique se o backend está rodando.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage('');
    setIsSaving(true);

    try {
      await updateProject(id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        technologies: formData.technologies.trim(),
      });

      navigate(`/projects/${id}`);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearAuthData();
        navigate('/login');
        return;
      }

      setErrorMessage(getProjectErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="project-create-page">
      <AppSidebar />

      <section className="project-create-content">
        <header className="project-create-header">
          <div>
            <span className="project-create-header__tag">Editar projeto</span>

            <h1>Atualizar projeto.</h1>

            <p>
              Edite o nome, descrição, tecnologias e status do projeto.
            </p>
          </div>

          <button
            type="button"
            className="button button--ghost"
            onClick={() => navigate(`/projects/${id}`)}
          >
            Voltar
          </button>
        </header>

        {isLoading ? (
          <div className="project-form">
            <div className="project-form__error">
              Carregando dados do projeto...
            </div>
          </div>
        ) : (
          <form className="project-form" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="project-form__error" role="alert">
                {errorMessage}
              </div>
            )}

            <div className="project-form__group">
              <label htmlFor="name">Nome do projeto</label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Ex: DevBug Tracker"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="project-form__group">
              <label htmlFor="description">Descrição</label>

              <textarea
                id="description"
                name="description"
                placeholder="Descreva brevemente o objetivo do projeto"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="project-form__row">
              <div className="project-form__group">
                <label htmlFor="status">Status</label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="IN_PROGRESS">Em andamento</option>
                  <option value="COMPLETED">Concluído</option>
                  <option value="PAUSED">Pausado</option>
                </select>
              </div>

              <div className="project-form__group">
                <label htmlFor="technologies">Tecnologias</label>

                <input
                  id="technologies"
                  name="technologies"
                  type="text"
                  placeholder="React, Java, Spring Boot"
                  value={formData.technologies}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="project-form__actions">
              <button
                type="button"
                className="button button--ghost"
                onClick={() => navigate(`/projects/${id}`)}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="button button--primary"
                disabled={isSaving}
              >
                {isSaving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

export default ProjectEdit;