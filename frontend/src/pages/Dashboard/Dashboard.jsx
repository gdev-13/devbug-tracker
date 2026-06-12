import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import AppSidebar from '../../components/AppSidebar/AppSidebar';
import DashboardSummary from '../../components/DashboardSummary/DashboardSummary';
import { clearAuthData, getAuthUser } from '../../services/authStorage';
import { getDashboardData } from '../../services/dashboardService';

import './Dashboard.css';

const emptyDashboard = {
  totalProjects: 0,
  projectsInProgress: 0,
  projectsCompleted: 0,
  projectsPaused: 0,

  totalBugs: 0,
  openBugs: 0,
  inProgressBugs: 0,
  resolvedBugs: 0,

  lowSeverityBugs: 0,
  mediumSeverityBugs: 0,
  highSeverityBugs: 0,
  criticalSeverityBugs: 0,
};

function Dashboard() {
  const navigate = useNavigate();
  const user = getAuthUser();

  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await getDashboardData();
      setDashboard(data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearAuthData();
        navigate('/login');
        return;
      }

      setErrorMessage(
        'Não foi possível carregar o dashboard. Verifique se o backend está rodando.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <main className="dashboard-page">
      <AppSidebar />

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <span className="dashboard-header__tag">Visão geral</span>

            <h1>Bem-vindo, {user?.name || 'dev'}.</h1>

            <p>
              Acompanhe seus projetos, bugs críticos, soluções documentadas e
              métricas principais em um só lugar.
            </p>
          </div>

          <button type="button" className="button button--primary">
            Adicionar projeto
          </button>
        </header>

        {isLoading && (
          <div className="dashboard-loading">
            Carregando dados do dashboard...
          </div>
        )}

        {errorMessage && (
          <div className="dashboard-error" role="alert">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && (
          <DashboardSummary dashboard={dashboard} />
        )}
      </section>
    </main>
  );
}

export default Dashboard;