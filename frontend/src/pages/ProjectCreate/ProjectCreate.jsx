import { useState } from 'react';
import { useNavigate } from 'react-router';

import AppSideBar from '../../components/AppSideBar/AppSideBar';
import { clearAuthData } from '../../services/authStorage';
import { createProject } from '../../services/projectsService';

import './ProjectCreate.css';

const initialFormData = {
  name: '',
  description: '',
  technologies: '',
  status: 'IN_PROGRESS',
};

function getCreateProjectErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (!error.response) {
    return 'Não foi possível conectar ao servidor. Tente novamente mais tarde.';
  }

  return 'Não foi possível criar o projeto. Verifique os dados informados.';
}

function ProjectCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    try {
      await createProject({
        name: formData.name,
        description: formData.description,
        status: formData.status,
        technologies: formData.technologies.trim(),
      });

      navigate('/projects');
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearAuthData();
        navigate('/login');
        return;
      }

      setErrorMessage(getCreateProjectErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="project-create-page">
      <AppSideBar />

      <section className="project-create-content">
        <header className="project-create-header">
          <div>
            <span className="project-create-header__tag">Novo projeto</span>

            <h1>Adicionar projeto.</h1>

            <p>
              Cadastre um projeto para organizar bugs, tecnologias utilizadas e
              acompanhar o andamento do desenvolvimento.
            </p>
          </div>

          <button
            type="button"
            className="button button--ghost"
            onClick={() => navigate('/projects')}
          >
            Voltar
          </button>
        </header>

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
              onClick={() => navigate('/projects')}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="button button--primary"
              disabled={isLoading}
            >
              {isLoading ? 'Criando...' : 'Criar projeto'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ProjectCreate;