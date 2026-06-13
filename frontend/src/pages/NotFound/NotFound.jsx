import { Link } from 'react-router';

import { getAuthToken } from '../../services/authStorage';

import './NotFound.css';

function NotFound() {
  const isAuthenticated = Boolean(getAuthToken());

  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <span className="not-found-status">404</span>

        <h1>Página não encontrada</h1>

        <p>
          A rota acessada não existe ou foi movida. Verifique o endereço digitado
          ou volte para uma área disponível do DevBug Tracker.
        </p>

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