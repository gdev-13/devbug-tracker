import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import AppSidebar from '../../components/AppSidebar/AppSidebar';
import { clearAuthData } from '../../services/authStorage';
import { getBugs } from '../../services/bugService';

import './Bugs.css';

const statusLabels = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em andamento',
  RESOLVED: 'Resolvido',
};

const statusVariants = {
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
    return 'Sem data';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

function Bugs() {
  const navigate = useNavigate();

  const [bugs, setBugs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadBugs = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await getBugs();
      setBugs(data);
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuthData();
        navigate('/login');
        return;
      }

      setErrorMessage(
        'Não foi possível carregar os bugs. Tente novamente mais tarde.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadBugs();
  }, [loadBugs]);

  return (
    <main className="bugs-page">
      <AppSidebar />

      <section className="bugs-content">
        <header className="bugs-header">
          <div>
            <span className="bugs-header__tag">Bugs</span>

            <h1>Todos os bugs.</h1>

            <p>
              Visualize todos os bugs registrados nos seus projetos e acompanhe
              status, severidade, tecnologia e projeto relacionado.
            </p>
          </div>

          <button
            type="button"
            className="button button--ghost"
            onClick={loadBugs}
            disabled={isLoading}
          >
            {isLoading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </header>

        {isLoading && (
          <div className="bugs-feedback">
            Carregando bugs...
          </div>
        )}

        {errorMessage && (
          <div className="bugs-feedback bugs-feedback--error" role="alert">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && bugs.length === 0 && (
          <section className="bugs-empty">
            <span>⌬</span>
            <h2>Nenhum bug cadastrado ainda.</h2>
            <p>
              Os bugs criados dentro dos projetos aparecerão aqui em uma visão
              geral.
            </p>
            <button
              type="button"
              className="button button--primary"
              onClick={() => navigate('/projects')}
            >
              Ver projetos
            </button>
          </section>
        )}

        {!isLoading && !errorMessage && bugs.length > 0 && (
          <section className="bugs-list">
            {bugs.map((bug) => (
              <article className="bug-list-card" key={bug.id}>
                <div className="bug-list-card__top">
                  <div>
                    <span
                      className={`bug-list-card__badge bug-list-card__badge--${
                        statusVariants[bug.status] || 'info'
                      }`}
                    >
                      {statusLabels[bug.status] || bug.status}
                    </span>

                    <span
                      className={`bug-list-card__badge bug-list-card__badge--${
                        severityVariants[bug.severity] || 'info'
                      }`}
                    >
                      {severityLabels[bug.severity] || bug.severity}
                    </span>
                  </div>

                  <small>#{bug.id}</small>
                </div>

                <h2>{bug.title}</h2>

                <p>{bug.description || 'Sem descrição cadastrada.'}</p>

                <div className="bug-list-card__meta">
                  <span>{bug.projectName || `Projeto #${bug.projectId}`}</span>
                  <span>{bug.technology || 'Tecnologia não informada'}</span>
                  <span>Criado em {formatDate(bug.createdAt)}</span>
                </div>

                <footer className="bug-list-card__footer">
                  <small>
                    {bug.errorMessage || 'Sem mensagem de erro registrada'}
                  </small>

                  <button
                    type="button"
                    onClick={() => navigate(`/bugs/${bug.id}`)}
                  >
                    Ver bug →
                  </button>
                </footer>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

export default Bugs;