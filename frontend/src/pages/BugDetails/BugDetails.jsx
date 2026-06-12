import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import AppSidebar from '../../components/AppSidebar/AppSidebar';
import { clearAuthData } from '../../services/authStorage';
import { getBugById } from '../../services/bugService';

import './BugDetails.css';

const bugStatusLabels = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em andamento',
  RESOLVED: 'Resolvido',
};

const bugStatusVariants = {
  OPEN: 'warning',
  IN_PROGRESS: 'info',
  RESOLVED: 'success',
};

const severityLabels = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
};

const severityVariants = {
  LOW: 'success',
  MEDIUM: 'info',
  HIGH: 'warning',
  CRITICAL: 'danger',
};

function formatDate(date) {
  if (!date) {
    return 'Não informado';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date));
}

function BugDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bug, setBug] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadBugDetails = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await getBugById(id);
      setBug(data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearAuthData();
        navigate('/login');
        return;
      }

      setErrorMessage(
        'Não foi possível carregar os detalhes do bug. Verifique se o backend está rodando.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadBugDetails();
  }, [loadBugDetails]);

  return (
    <main className="bug-details-page">
      <AppSidebar />

      <section className="bug-details-content">
        <header className="bug-details-header">
          <div>
            <span className="bug-details-header__tag">Detalhes do bug</span>

            <h1>{bug?.title || 'Carregando bug...'}</h1>

            <p>
              Visualize a descrição completa, mensagem de erro, causa provável,
              solução e informações técnicas do bug.
            </p>
          </div>

          <div className="bug-details-header__actions">
            <button
              type="button"
              className="button button--ghost"
              onClick={() =>
                bug?.projectId ? navigate(`/projects/${bug.projectId}`) : navigate('/projects')
              }
            >
              Voltar
            </button>

            <button type="button" className="button button--primary" onClick={() => navigate(`/bugs/${id}/edit`)}>
              Editar bug
            </button>
          </div>
        </header>

        {isLoading && (
          <div className="bug-details-feedback">
            Carregando detalhes do bug...
          </div>
        )}

        {errorMessage && (
          <div className="bug-details-feedback bug-details-feedback--error" role="alert">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && bug && (
          <>
            <section className="bug-details-overview">
              <div className="bug-details-overview__badges">
                <span
                  className={`bug-details-badge bug-details-badge--${
                    bugStatusVariants[bug.status] || 'info'
                  }`}
                >
                  {bugStatusLabels[bug.status] || bug.status}
                </span>

                <span
                  className={`bug-details-badge bug-details-badge--${
                    severityVariants[bug.severity] || 'info'
                  }`}
                >
                  {severityLabels[bug.severity] || bug.severity}
                </span>
              </div>

              <div className="bug-details-overview__meta">
                <article>
                  <span>Projeto</span>
                  <strong>{bug.projectName || `Projeto #${bug.projectId}`}</strong>
                </article>

                <article>
                  <span>Tecnologia</span>
                  <strong>{bug.technology || 'Não informada'}</strong>
                </article>

                <article>
                  <span>Criado em</span>
                  <strong>{formatDate(bug.createdAt)}</strong>
                </article>

                <article>
                  <span>Resolvido em</span>
                  <strong>{formatDate(bug.resolvedAt)}</strong>
                </article>
              </div>
            </section>

            <section className="bug-details-grid">
              <article className="bug-details-panel">
                <h2>Descrição</h2>
                <p>{bug.description || 'Sem descrição cadastrada.'}</p>
              </article>

              <article className="bug-details-panel">
                <h2>Mensagem de erro</h2>
                <p>{bug.errorMessage || 'Nenhuma mensagem de erro cadastrada.'}</p>
              </article>

              <article className="bug-details-panel">
                <h2>Possível causa</h2>
                <p>{bug.possibleCause || 'Nenhuma possível causa cadastrada.'}</p>
              </article>

              <article className="bug-details-panel">
                <h2>Solução documentada</h2>
                <p>{bug.solution || 'Nenhuma solução documentada ainda.'}</p>
              </article>
            </section>

            <section className="bug-details-panel bug-details-code">
              <h2>Trecho de código ou requisição</h2>

              {bug.codeSnippet ? (
                <pre>
                  <code>{bug.codeSnippet}</code>
                </pre>
              ) : (
                <p>Nenhum trecho cadastrado.</p>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}

export default BugDetails;