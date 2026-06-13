import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import AppSidebar from '../../components/AppSidebar/AppSidebar';
import { clearAuthData } from '../../services/authStorage';
import { getBugs } from '../../services/bugService';
import { getProjects } from '../../services/projectsService';

import './Reports.css';

const projectStatusLabels = {
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

const monthsShort = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

function normalizeTechnology(technology) {
  return technology?.trim();
}

function splitTechnologies(technologies) {
  if (!technologies) {
    return [];
  }

  if (Array.isArray(technologies)) {
    return technologies.map(normalizeTechnology).filter(Boolean);
  }

  return technologies
    .split(',')
    .map(normalizeTechnology)
    .filter(Boolean);
}

function getLastSixMonths() {
  const today = new Date();

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);

    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: `${monthsShort[date.getMonth()]}/${String(date.getFullYear()).slice(2)}`,
      month: date.getMonth(),
      year: date.getFullYear(),
    };
  });
}

function isSameMonth(dateString, monthInfo) {
  if (!dateString) {
    return false;
  }

  const date = new Date(dateString);

  return date.getMonth() === monthInfo.month && date.getFullYear() === monthInfo.year;
}

function createLinePath(points) {
  if (points.length === 0) {
    return '';
  }

  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
}

function getYAxisTicks(maxValue) {
  const safeMax = Math.max(1, maxValue);

  if (safeMax <= 4) {
    return Array.from({ length: safeMax + 1 }, (_, index) => index);
  }

  const step = Math.ceil(safeMax / 4);

  return Array.from({ length: 5 }, (_, index) => index * step);
}

function TrendChart({ data }) {
  const width = 720;
  const height = 280;
  const leftPadding = 62;
  const rightPadding = 34;
  const topPadding = 24;
  const bottomPadding = 42;

  const rawMaxValue = Math.max(
    1,
    ...data.map((item) => item.created),
    ...data.map((item) => item.resolved),
  );

  const yTicks = getYAxisTicks(rawMaxValue);
  const maxValue = yTicks[yTicks.length - 1];

  function getX(index) {
    return (
      leftPadding +
      (index * (width - leftPadding - rightPadding)) /
        Math.max(1, data.length - 1)
    );
  }

  function getY(value) {
    return (
      height -
      bottomPadding -
      (value / maxValue) * (height - topPadding - bottomPadding)
    );
  }

  const createdPoints = data.map((item, index) => ({
    x: getX(index),
    y: getY(item.created),
  }));

  const resolvedPoints = data.map((item, index) => ({
    x: getX(index),
    y: getY(item.resolved),
  }));

  return (
    <div className="reports-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Bugs criados e resolvidos por mês"
      >
        <defs>
          <linearGradient id="createdLine" x1="0" x2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          <linearGradient id="resolvedLine" x1="0" x2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#67e8f9" />
          </linearGradient>
        </defs>

        <text
          x="16"
          y={height / 2}
          textAnchor="middle"
          className="reports-chart__axis-title"
          transform={`rotate(-90 16 ${height / 2})`}
        >
          Quantidade
        </text>

        <line
          x1={leftPadding}
          x2={leftPadding}
          y1={topPadding}
          y2={height - bottomPadding}
          className="reports-chart__axis"
        />

        <line
          x1={leftPadding}
          x2={width - rightPadding}
          y1={height - bottomPadding}
          y2={height - bottomPadding}
          className="reports-chart__axis"
        />

        {yTicks.map((tick) => {
          const y = getY(tick);

          return (
            <g key={tick}>
              <line
                x1={leftPadding}
                x2={width - rightPadding}
                y1={y}
                y2={y}
                className="reports-chart__grid"
              />

              <text
                x={leftPadding - 12}
                y={y + 4}
                textAnchor="end"
                className="reports-chart__value"
              >
                {tick}
              </text>
            </g>
          );
        })}

        <path
          d={createLinePath(createdPoints)}
          className="reports-chart__line"
          stroke="url(#createdLine)"
        />

        <path
          d={createLinePath(resolvedPoints)}
          className="reports-chart__line"
          stroke="url(#resolvedLine)"
        />

        {createdPoints.map((point, index) => (
          <circle
            key={`created-${data[index].label}`}
            cx={point.x}
            cy={point.y}
            r="5"
            className="reports-chart__dot reports-chart__dot--created"
          />
        ))}

        {resolvedPoints.map((point, index) => (
          <circle
            key={`resolved-${data[index].label}`}
            cx={point.x}
            cy={point.y}
            r="5"
            className="reports-chart__dot reports-chart__dot--resolved"
          />
        ))}

        {data.map((item, index) => {
          const x = getX(index);

          return (
            <text
              key={item.label}
              x={x}
              y={height - 12}
              textAnchor="middle"
              className="reports-chart__label"
            >
              {item.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function Reports() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [filters, setFilters] = useState({
    technology: 'ALL',
    projectStatus: 'ALL',
    bugStatus: 'ALL',
    severity: 'ALL',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadReports = useCallback(async () => {
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

      setErrorMessage('Não foi possível carregar os relatórios. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }

  function clearFilters() {
    setFilters({
      technology: 'ALL',
      projectStatus: 'ALL',
      bugStatus: 'ALL',
      severity: 'ALL',
    });
  }

  const technologies = useMemo(() => {
    const projectTechnologies = projects.flatMap((project) =>
      splitTechnologies(project.technologies),
    );

    const bugTechnologies = bugs
      .map((bug) => normalizeTechnology(bug.technology))
      .filter(Boolean);

    return [...new Set([...projectTechnologies, ...bugTechnologies])].sort();
  }, [projects, bugs]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const projectTechnologies = splitTechnologies(project.technologies);

      const matchesStatus =
        filters.projectStatus === 'ALL' || project.status === filters.projectStatus;

      const matchesTechnology =
        filters.technology === 'ALL' || projectTechnologies.includes(filters.technology);

      return matchesStatus && matchesTechnology;
    });
  }, [projects, filters.projectStatus, filters.technology]);

  const filteredBugs = useMemo(() => {
    return bugs.filter((bug) => {
      const matchesStatus =
        filters.bugStatus === 'ALL' || bug.status === filters.bugStatus;

      const matchesSeverity =
        filters.severity === 'ALL' || bug.severity === filters.severity;

      const matchesTechnology =
        filters.technology === 'ALL' || bug.technology === filters.technology;

      return matchesStatus && matchesSeverity && matchesTechnology;
    });
  }, [bugs, filters.bugStatus, filters.severity, filters.technology]);

  const summary = useMemo(() => {
    return {
      projects: filteredProjects.length,
      bugs: filteredBugs.length,
      openBugs: filteredBugs.filter((bug) => bug.status === 'OPEN').length,
      resolvedBugs: filteredBugs.filter((bug) => bug.status === 'RESOLVED').length,
      criticalBugs: filteredBugs.filter((bug) => bug.severity === 'CRITICAL').length,
    };
  }, [filteredProjects, filteredBugs]);

  const trendData = useMemo(() => {
    return getLastSixMonths().map((monthInfo) => ({
      label: monthInfo.label,
      created: filteredBugs.filter((bug) =>
        isSameMonth(bug.createdAt, monthInfo),
      ).length,
      resolved: filteredBugs.filter((bug) => {
        const resolvedDate =
          bug.resolvedAt || (bug.status === 'RESOLVED' ? bug.createdAt : null);

        return isSameMonth(resolvedDate, monthInfo);
      }).length,
    }));
  }, [filteredBugs]);

  const technologyRanking = useMemo(() => {
    const ranking = filteredBugs.reduce((accumulator, bug) => {
      const technology = normalizeTechnology(bug.technology) || 'Não informada';

      accumulator[technology] = (accumulator[technology] || 0) + 1;

      return accumulator;
    }, {});

    return Object.entries(ranking)
      .map(([technology, total]) => ({ technology, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [filteredBugs]);

  const maxTechnologyTotal = Math.max(1, ...technologyRanking.map((item) => item.total));

  return (
    <main className="reports-page">
      <AppSidebar />

      <section className="reports-content">
        <header className="reports-header">
          <div>
            <span className="reports-header__tag">Relatórios</span>

            <h1>Análise dos seus bugs.</h1>

            <p>
              Filtre projetos e bugs por tecnologia, status e severidade para entender melhor onde estão os principais pontos de atenção.
            </p>
          </div>

          <button
            type="button"
            className="button button--ghost"
            onClick={loadReports}
            disabled={isLoading}
          >
            {isLoading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </header>

        {isLoading && (
          <div className="reports-feedback">
            Carregando relatórios...
          </div>
        )}

        {errorMessage && (
          <div className="reports-feedback reports-feedback--error" role="alert">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && (
          <>
            <section className="reports-filters">
              <div className="reports-filter">
                <label htmlFor="technology">Tecnologia</label>

                <select
                  id="technology"
                  name="technology"
                  value={filters.technology}
                  onChange={handleFilterChange}
                >
                  <option value="ALL">Todas</option>

                  {technologies.map((technology) => (
                    <option key={technology} value={technology}>
                      {technology}
                    </option>
                  ))}
                </select>
              </div>

              <div className="reports-filter">
                <label htmlFor="projectStatus">Status do projeto</label>

                <select
                  id="projectStatus"
                  name="projectStatus"
                  value={filters.projectStatus}
                  onChange={handleFilterChange}
                >
                  <option value="ALL">Todos</option>

                  {Object.entries(projectStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="reports-filter">
                <label htmlFor="bugStatus">Status do bug</label>

                <select
                  id="bugStatus"
                  name="bugStatus"
                  value={filters.bugStatus}
                  onChange={handleFilterChange}
                >
                  <option value="ALL">Todos</option>

                  {Object.entries(bugStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="reports-filter">
                <label htmlFor="severity">Severidade</label>

                <select
                  id="severity"
                  name="severity"
                  value={filters.severity}
                  onChange={handleFilterChange}
                >
                  <option value="ALL">Todas</option>

                  {Object.entries(severityLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="button button--ghost"
                onClick={clearFilters}
              >
                Limpar filtros
              </button>
            </section>

            <section className="reports-summary">
              <article>
                <span>▣</span>
                <div>
                  <strong>{summary.projects}</strong>
                  <small>Projetos filtrados</small>
                </div>
              </article>

              <article>
                <span>⌬</span>
                <div>
                  <strong>{summary.bugs}</strong>
                  <small>Bugs filtrados</small>
                </div>
              </article>

              <article>
                <span>!</span>
                <div>
                  <strong>{summary.openBugs}</strong>
                  <small>Bugs abertos</small>
                </div>
              </article>

              <article>
                <span>✓</span>
                <div>
                  <strong>{summary.resolvedBugs}</strong>
                  <small>Bugs resolvidos</small>
                </div>
              </article>

              <article>
                <span>⚠</span>
                <div>
                  <strong>{summary.criticalBugs}</strong>
                  <small>Bugs críticos</small>
                </div>
              </article>
            </section>

            <section className="reports-grid">
              <article className="reports-panel reports-panel--wide">
                <div className="reports-panel__header">
                  <div>
                    <h2>Bugs criados x resolvidos</h2>
                    <p>Comparação mensal com base nos bugs filtrados.</p>
                  </div>

                  <div className="reports-legend">
                    <span><i className="reports-legend__created"></i> Criados</span>
                    <span><i className="reports-legend__resolved"></i> Resolvidos</span>
                  </div>
                </div>

                <TrendChart data={trendData} />
              </article>

              <article className="reports-panel">
                <div className="reports-panel__header">
                  <div>
                    <h2>Bugs por tecnologia</h2>
                    <p>Ranking das tecnologias mais recorrentes.</p>
                  </div>
                </div>

                {technologyRanking.length === 0 ? (
                  <p className="reports-empty-text">
                    Nenhum bug encontrado para os filtros selecionados.
                  </p>
                ) : (
                  <div className="reports-ranking">
                    {technologyRanking.map((item) => (
                      <div className="reports-ranking__item" key={item.technology}>
                        <div>
                          <strong>{item.technology}</strong>
                          <span>{item.total} bug(s)</span>
                        </div>

                        <div className="reports-ranking__bar">
                          <span style={{ width: `${(item.total / maxTechnologyTotal) * 100}%` }}></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </article>

              <article className="reports-panel">
                <div className="reports-panel__header">
                  <div>
                    <h2>Leitura dos dados</h2>
                    <p>Resumo interpretativo do recorte atual.</p>
                  </div>
                </div>

                <div className="reports-insights">
                  <p>
                    Você está visualizando <strong>{summary.bugs}</strong> bug(s) dentro do recorte escolhido.
                  </p>

                  <p>
                    Desses, <strong>{summary.openBugs}</strong> ainda estão abertos e <strong>{summary.resolvedBugs}</strong> já foram resolvidos.
                  </p>

                  <p>
                    O filtro atual encontrou <strong>{summary.criticalBugs}</strong> bug(s) críticos.
                  </p>
                </div>
              </article>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

export default Reports;