import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import AppSidebar from '../../components/AppSidebar/AppSidebar';
import { clearAuthData } from '../../services/authStorage';
import { getBugById, updateBug } from '../../services/bugService';

import '../BugCreate/BugCreate.css';

const initialFormData = {
  title: '',
  description: '',
  errorMessage: '',
  codeSnippet: '',
  technology: '',
  severity: 'MEDIUM',
  status: 'OPEN',
  possibleCause: '',
  solution: '',
  projectId: null,
};

function getBugFormErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (!error.response) {
    return 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
  }

  return 'Não foi possível salvar o bug. Verifique os dados informados.';
}

function BugEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadBug = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const bug = await getBugById(id);

      setFormData({
        title: bug.title || '',
        description: bug.description || '',
        errorMessage: bug.errorMessage || '',
        codeSnippet: bug.codeSnippet || '',
        technology: bug.technology || '',
        severity: bug.severity || 'MEDIUM',
        status: bug.status || 'OPEN',
        possibleCause: bug.possibleCause || '',
        solution: bug.solution || '',
        projectId: bug.projectId,
      });
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearAuthData();
        navigate('/login');
        return;
      }

      setErrorMessage(
        'Não foi possível carregar o bug. Verifique se o backend está rodando.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadBug();
  }, [loadBug]);

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
      await updateBug(id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        errorMessage: formData.errorMessage.trim(),
        codeSnippet: formData.codeSnippet.trim(),
        technology: formData.technology.trim(),
        severity: formData.severity,
        status: formData.status,
        possibleCause: formData.possibleCause.trim(),
        solution: formData.solution.trim(),
        projectId: Number(formData.projectId),
      });

      navigate(`/bugs/${id}`);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearAuthData();
        navigate('/login');
        return;
      }

      setErrorMessage(getBugFormErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="bug-create-page">
      <AppSidebar />

      <section className="bug-create-content">
        <header className="bug-create-header">
          <div>
            <span className="bug-create-header__tag">Editar bug</span>

            <h1>Atualizar bug.</h1>

            <p>
              Edite as informações do bug, atualize seu status, severidade,
              causa provável e solução documentada.
            </p>
          </div>

          <button
            type="button"
            className="button button--ghost"
            onClick={() => navigate(`/bugs/${id}`)}
          >
            Voltar
          </button>
        </header>

        {isLoading ? (
          <div className="bug-form">
            <div className="bug-form__error">
              Carregando dados do bug...
            </div>
          </div>
        ) : (
          <form className="bug-form" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="bug-form__error" role="alert">
                {errorMessage}
              </div>
            )}

            <div className="bug-form__group">
              <label htmlFor="title">Título do bug</label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="Ex: Token não enviado em requisição protegida"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="bug-form__group">
              <label htmlFor="description">Descrição</label>

              <textarea
                id="description"
                name="description"
                placeholder="Descreva o problema encontrado"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="bug-form__group">
              <label htmlFor="errorMessage">Mensagem de erro</label>

              <input
                id="errorMessage"
                name="errorMessage"
                type="text"
                placeholder="Ex: Usuário não autenticado"
                value={formData.errorMessage}
                onChange={handleChange}
              />
            </div>

            <div className="bug-form__group">
              <label htmlFor="codeSnippet">Trecho de código ou requisição</label>

              <textarea
                id="codeSnippet"
                name="codeSnippet"
                className="bug-form__code"
                placeholder="Ex: Authorization: Bearer TOKEN"
                rows="4"
                value={formData.codeSnippet}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="bug-form__row">
              <div className="bug-form__group">
                <label htmlFor="status">Status</label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="OPEN">Aberto</option>
                  <option value="IN_PROGRESS">Em andamento</option>
                  <option value="RESOLVED">Resolvido</option>
                </select>
              </div>

              <div className="bug-form__group">
                <label htmlFor="severity">Severidade</label>

                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  required
                >
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                  <option value="CRITICAL">Crítica</option>
                </select>
              </div>
            </div>

            <div className="bug-form__group">
              <label htmlFor="technology">Tecnologia relacionada</label>

              <input
                id="technology"
                name="technology"
                type="text"
                placeholder="Ex: React, Spring Boot, PostgreSQL"
                value={formData.technology}
                onChange={handleChange}
                required
              />
            </div>

            <div className="bug-form__group">
              <label htmlFor="possibleCause">Possível causa</label>

              <textarea
                id="possibleCause"
                name="possibleCause"
                placeholder="Descreva o que provavelmente está causando o bug"
                rows="4"
                value={formData.possibleCause}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="bug-form__group">
              <label htmlFor="solution">Solução documentada</label>

              <textarea
                id="solution"
                name="solution"
                placeholder="Descreva a solução, caso o bug já tenha sido resolvido"
                rows="4"
                value={formData.solution}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="bug-form__actions">
              <button
                type="button"
                className="button button--ghost"
                onClick={() => navigate(`/bugs/${id}`)}
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

export default BugEdit;