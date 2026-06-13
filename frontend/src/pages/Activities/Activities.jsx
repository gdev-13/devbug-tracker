import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import AppSidebar from '../../components/AppSidebar/AppSidebar';
import { clearAuthData } from '../../services/authStorage';
import { getBugs } from '../../services/bugService';
import { getProjects } from '../../services/projectsService';

import './Activities.css';

const activityTypeLabels = {
  ALL: 'Todas',
  PROJECT: 'Projetos',
  BUG: 'Bugs',
  RESOLVED: 'Resolvidos',
};

function formatDateTime(dateString) {
  if (!dateString) {
    return 'Sem data';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(dateString));
}

function isDifferentDate(firstDate, secondDate) {
  if (!firstDate || !secondDate) {
    return false;
  }

  return new Date(firstDate).getTime() !== new Date(secondDate).getTime();
}

function buildActivities(projects, bugs) {
  const projectActivities = projects.flatMap((project) => {
    const activities = [
      {
        id: `project-created-${project.id}`,
        type: 'PROJECT',
        title: 'Projeto criado',
        description: `O projeto "${project.name}" foi cadastrado.`,
        date: project.createdAt,
        icon: '▣',
      },
    ];

    if (isDifferentDate(project.updatedAt, project.createdAt)) {
      activities.push({
        id: `project-updated-${project.id}`,
        type: 'PROJECT',
        title: 'Projeto atualizado',
        description: `O projeto "${project.name}" recebeu alterações.`,
        date: project.updatedAt,
        icon: '↻',
      });
    }

    return activities;
  });

  const bugActivities = bugs.flatMap((bug) => {
    const activities = [
      {
        id: `bug-created-${bug.id}`,
        type: 'BUG',
        title: 'Bug registrado',
        description: `O bug "${bug.title}" foi registrado em ${bug.projectName || `Projeto #${bug.projectId}`}.`,
        date: bug.createdAt,
        icon: '⌬',
      },
    ];

    if (isDifferentDate(bug.updatedAt, bug.createdAt)) {
      activities.push({
        id: `bug-updated-${bug.id}`,
        type: 'BUG',
        title: 'Bug atualizado',
        description: `O bug "${bug.title}" recebeu alterações.`,
        date: bug.updatedAt,
        icon: '↻',
      });
    }

    if (bug.resolvedAt) {
      activities.push({
        id: `bug-resolved-${bug.id}`,
        type: 'RESOLVED',
        title: 'Bug resolvido',
        description: `O bug "${bug.title}" foi marcado como resolvido.`,
        date: bug.resolvedAt,
        icon: '✓',
      });
    }

    return activities;
  });

  return [...projectActivities, ...bugActivities]
    .filter((activity) => activity.date)
    .sort((first, second) => new Date(second.date) - new Date(first.date));
}

function Activities() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [selectedType, setSelectedType] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadActivities = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const [projectsData, bugsData] = await Promise.all([
        getProjects(),
        getBugs(),
      ]);

      setProjects(projectsData);
      setBugs(bugsData);
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuthData();
        navigate('/login');
        return;
      }

      setErrorMessage(
        'Não foi possível carregar as atividades. Tente novamente mais tarde.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const activities = useMemo(() => buildActivities(projects, bugs), [projects, bugs]);

  const filteredActivities = useMemo(() => {
    if (selectedType === 'ALL') {
      return activities;
    }

    return activities.filter((activity) => activity.type === selectedType);
  }, [activities, selectedType]);

  const summary = useMemo(() => {
    return {
      total: activities.length,
      projects: activities.filter((activity) => activity.type === 'PROJECT').length,
      bugs: activities.filter((activity) => activity.type === 'BUG').length,
      resolved: activities.filter((activity) => activity.type === 'RESOLVED').length,
    };
  }, [activities]);

  return (
    <main className="activities-page">
      <AppSidebar />

      <section className="activities-content">
        <header className="activities-header">
          <div>
            <span className="activities-header__tag">Atividades</span>

            <h1>Linha do tempo.</h1>

            <p>
              Acompanhe os principais movimentos dos seus projetos e bugs com
              base nos registros existentes.
            </p>
          </div>

          <button
            type="button"
            className="button button--ghost"
            onClick={loadActivities}
            disabled={isLoading}
          >
            {isLoading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </header>

        {isLoading && (
          <div className="activities-feedback">
            Carregando atividades...
          </div>
        )}

        {errorMessage && (
          <div className="activities-feedback activities-feedback--error" role="alert">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && (
          <>
            <section className="activities-summary">
              <article>
                <span>▤</span>
                <div>
                  <strong>{summary.total}</strong>
                  <small>Atividades</small>
                </div>
              </article>

              <article>
                <span>▣</span>
                <div>
                  <strong>{summary.projects}</strong>
                  <small>Projetos</small>
                </div>
              </article>

              <article>
                <span>⌬</span>
                <div>
                  <strong>{summary.bugs}</strong>
                  <small>Bugs</small>
                </div>
              </article>

              <article>
                <span>✓</span>
                <div>
                  <strong>{summary.resolved}</strong>
                  <small>Resolvidos</small>
                </div>
              </article>
            </section>

            <section className="activities-filters" aria-label="Filtros de atividades">
              {Object.entries(activityTypeLabels).map(([type, label]) => (
                <button
                  key={type}
                  type="button"
                  className={selectedType === type ? 'active' : ''}
                  onClick={() => setSelectedType(type)}
                >
                  {label}
                </button>
              ))}
            </section>

            {filteredActivities.length === 0 ? (
              <section className="activities-empty">
                <span>▤</span>
                <h2>Nenhuma atividade encontrada.</h2>
                <p>
                  Quando projetos e bugs forem criados, editados ou resolvidos,
                  eles aparecerão nesta linha do tempo.
                </p>
              </section>
            ) : (
              <section className="activities-timeline">
                {filteredActivities.map((activity) => (
                  <article className="activity-item" key={activity.id}>
                    <div className="activity-item__icon">
                      {activity.icon}
                    </div>

                    <div className="activity-item__content">
                      <div className="activity-item__top">
                        <h2>{activity.title}</h2>
                        <time>{formatDateTime(activity.date)}</time>
                      </div>

                      <p>{activity.description}</p>
                    </div>
                  </article>
                ))}
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default Activities;