import './DashboardSummary.css';

function getPercentage(value, total) {
  if (!total) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function getDonutBackground(dashboard) {
  const total = dashboard.totalBugs;

  if (!total) {
    return `
      radial-gradient(circle, #0f172a 0 42%, transparent 43%),
      conic-gradient(rgba(148, 163, 184, 0.18) 0 100%)
    `;
  }

  const open = getPercentage(dashboard.openBugs, total);
  const inProgress = getPercentage(dashboard.inProgressBugs, total);
  const resolved = getPercentage(dashboard.resolvedBugs, total);

  const openEnd = open;
  const inProgressEnd = open + inProgress;
  const resolvedEnd = open + inProgress + resolved;

  return `
    radial-gradient(circle, #0f172a 0 42%, transparent 43%),
    conic-gradient(
      var(--status-open) 0 ${openEnd}%,
      var(--status-progress) ${openEnd}% ${inProgressEnd}%,
      var(--status-resolved) ${inProgressEnd}% ${resolvedEnd}%,
      rgba(148, 163, 184, 0.18) ${resolvedEnd}% 100%
    )
  `;
}

function getRecentActivities(dashboard) {
  const activities = [];

  if (dashboard.totalProjects > 0) {
    activities.push({
      icon: '▣',
      variant: 'info',
      title: `${dashboard.totalProjects} projeto(s) registrado(s)`,
      description: `${dashboard.projectsInProgress} em andamento`,
    });
  }

  if (dashboard.criticalSeverityBugs > 0) {
    activities.push({
      icon: '!',
      variant: 'danger',
      title: `${dashboard.criticalSeverityBugs} bug(s) crítico(s) precisam de atenção`,
      description: 'Prioridade máxima',
    });
  }

  if (dashboard.openBugs > 0) {
    activities.push({
      icon: '⌬',
      variant: 'warning',
      title: `${dashboard.openBugs} bug(s) aberto(s) aguardando resolução`,
      description: `${dashboard.totalBugs} bug(s) no total`,
    });
  }

  if (dashboard.resolvedBugs > 0) {
    activities.push({
      icon: '✓',
      variant: 'success',
      title: `${dashboard.resolvedBugs} bug(s) resolvido(s)`,
      description: `${getPercentage(dashboard.resolvedBugs, dashboard.totalBugs)}% dos bugs registrados`,
    });
  }

  if (activities.length === 0) {
    activities.push({
      icon: '•',
      variant: 'empty',
      title: 'Nenhuma atividade recente ainda',
      description: 'Crie projetos e registre bugs para acompanhar sua evolução.',
    });
  }

  return activities.slice(0, 3);
}

function DashboardSummary({ dashboard, compact = false }) {
  const statusItems = [
    {
      label: 'Abertos',
      value: dashboard.openBugs,
      percentage: getPercentage(dashboard.openBugs, dashboard.totalBugs),
      dotClassName: 'dot--status-open',
    },
    {
      label: 'Em andamento',
      value: dashboard.inProgressBugs,
      percentage: getPercentage(dashboard.inProgressBugs, dashboard.totalBugs),
      dotClassName: 'dot--status-progress',
    },
    {
      label: 'Resolvidos',
      value: dashboard.resolvedBugs,
      percentage: getPercentage(dashboard.resolvedBugs, dashboard.totalBugs),
      dotClassName: 'dot--status-resolved',
    },
  ];

  const severityItems = [
    {
      label: 'Crítica',
      value: dashboard.criticalSeverityBugs,
      dotClassName: 'dot--red',
    },
    {
      label: 'Alta',
      value: dashboard.highSeverityBugs,
      dotClassName: 'dot--orange',
    },
    {
      label: 'Média',
      value: dashboard.mediumSeverityBugs,
      dotClassName: 'dot--status-progress',
    },
    {
      label: 'Baixa',
      value: dashboard.lowSeverityBugs,
      dotClassName: 'dot--green',
    },
  ];

  const maxSeverityValue = Math.max(
    ...severityItems.map((item) => item.value),
    1,
  );

  const recentActivities = getRecentActivities(dashboard);

  return (
    <div className={`dashboard-summary ${compact ? 'dashboard-summary--compact' : ''}`}>
      <section className="dashboard-summary__stats">
        <article className="dashboard-summary__stat">
          <span>Projetos</span>
          <strong>{dashboard.totalProjects}</strong>
          <small>{dashboard.projectsInProgress} em andamento</small>
        </article>

        <article className="dashboard-summary__stat dashboard-summary__stat--warning">
          <span>Bugs abertos</span>
          <strong>{dashboard.openBugs}</strong>
          <small>{dashboard.totalBugs} bugs no total</small>
        </article>

        <article className="dashboard-summary__stat dashboard-summary__stat--danger">
          <span>Bugs críticos</span>
          <strong>{dashboard.criticalSeverityBugs}</strong>
          <small>Prioridade máxima</small>
        </article>

        <article className="dashboard-summary__stat dashboard-summary__stat--success">
          <span>Resolvidos</span>
          <strong>{dashboard.resolvedBugs}</strong>
          <small>{getPercentage(dashboard.resolvedBugs, dashboard.totalBugs)}% dos bugs</small>
        </article>
      </section>

      <section className="dashboard-summary__grid">
        <article className="dashboard-summary__panel">
          <div className="dashboard-summary__panel-header">
            <h2>Bugs por status</h2>
            <span>{dashboard.totalBugs} total</span>
          </div>

          <div className="dashboard-summary__status">
            <div
              className="dashboard-summary__donut"
              style={{ background: getDonutBackground(dashboard) }}
            >
              <div>
                <strong>{dashboard.totalBugs}</strong>
                <small>Total</small>
              </div>
            </div>

            <ul className="dashboard-summary__chart-list">
              {statusItems.map((item) => (
                <li key={item.label}>
                  <span className={`dot ${item.dotClassName}`}></span>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <small>{item.percentage}%</small>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="dashboard-summary__panel">
          <div className="dashboard-summary__panel-header">
            <h2>Bugs por severidade</h2>
            <span>{dashboard.totalBugs} total</span>
          </div>

          <div className="dashboard-summary__severity">
            {severityItems.map((item) => (
              <div className="dashboard-summary__severity-item" key={item.label}>
                <div>
                  <span>
                    <span className={`dot ${item.dotClassName}`}></span>
                    {item.label}
                  </span>

                  <strong>{item.value}</strong>
                </div>

                <div className="dashboard-summary__severity-bar">
                  <span
                    style={{
                      width: `${Math.round((item.value / maxSeverityValue) * 100)}%`,
                    }}
                  ></span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-summary__panel dashboard-summary__activities">
        <div className="dashboard-summary__panel-header">
          <h2>Atividades recentes</h2>
          <span>Resumo atual</span>
        </div>

        <ul className="dashboard-summary__activity-list">
          {recentActivities.map((activity) => (
            <li key={activity.title}>
              <span
                className={`dashboard-summary__activity-icon dashboard-summary__activity-icon--${activity.variant}`}
              >
                {activity.icon}
              </span>

              <div>
                <strong>{activity.title}</strong>
                <small>{activity.description}</small>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {!compact && (
        <section className="dashboard-summary__bottom">
          <article className="dashboard-summary__panel">
            <div className="dashboard-summary__panel-header">
              <h2>Projetos por status</h2>
              <span>{dashboard.totalProjects} total</span>
            </div>

            <div className="dashboard-summary__project-status">
              <article>
                <span>Em andamento</span>
                <strong>{dashboard.projectsInProgress}</strong>
              </article>

              <article>
                <span>Concluídos</span>
                <strong>{dashboard.projectsCompleted}</strong>
              </article>

              <article>
                <span>Pausados</span>
                <strong>{dashboard.projectsPaused}</strong>
              </article>
            </div>
          </article>

          <article className="dashboard-summary__panel">
            <div className="dashboard-summary__panel-header">
              <h2>Resumo técnico</h2>
              <span>Seu progresso</span>
            </div>

            <div className="dashboard-summary__technical">
              <p>
                Você possui <strong>{dashboard.totalProjects}</strong> projeto(s)
                e <strong>{dashboard.totalBugs}</strong> bug(s) registrados.
              </p>

              <p>
                Atualmente, há <strong>{dashboard.openBugs}</strong> bug(s)
                aberto(s), <strong>{dashboard.inProgressBugs}</strong> em
                andamento e <strong>{dashboard.resolvedBugs}</strong> resolvido(s).
              </p>

              <p>
                Bugs críticos registrados:{' '}
                <strong>{dashboard.criticalSeverityBugs}</strong>.
              </p>
            </div>
          </article>
        </section>
      )}
    </div>
  );
}

export default DashboardSummary;