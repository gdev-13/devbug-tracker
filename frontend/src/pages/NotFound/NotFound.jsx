import { Link, useLocation } from 'react-router';

import { getAuthToken } from '../../services/authStorage';

import './NotFound.css';

function NotFound() {
  const location = useLocation();
  const isAuthenticated = Boolean(getAuthToken());

  const title = location.state?.title || 'Página não encontrada';

  const message =
    location.state?.message ||
    'A rota acessada não existe ou foi movida. Verifique o endereço digitado ou volte para uma área disponível do DevBug Tracker.';

  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <span className="not-found-status">404</span>

        <h1>{title}</h1>

        <p>{message}</p>

        <Link
          className="not-found-button"
          to={isAuthenticated ? '/dashboard' : '/'}
        >
          {isAuthenticated ? 'Voltar para o dashboard' : 'Voltar para a home'}
        </Link>
      </section>
    </main>
  );
}

export default NotFound;