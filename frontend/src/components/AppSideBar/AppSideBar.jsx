import { Link } from 'react-router';

import { getAuthUser } from '../../services/authStorage';

import './AppSidebar.css';

function getInitials(name) {
  if (!name) {
    return 'DB';
  }

  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function AppSidebar({ userOverride }) {
  const storedUser = getAuthUser();
  const user = userOverride || storedUser;

  return (
    <aside className="app-sidebar">
      <Link to="/dashboard" className="app-sidebar__brand">
        <span className="app-sidebar__logo">⌬</span>
        <span>
          DevBug <strong>Tracker</strong>
        </span>
      </Link>

      <nav className="app-sidebar__nav" aria-label="Menu principal">
        <Link to="/dashboard" className="active">
          ⌂ Visão geral
        </Link>
        <Link to="/projects">▣ Projetos</Link>
        <Link to="/bugs">⌬ Bugs</Link>
        <Link to="/activity">▤ Atividades</Link>
        <Link to="/reports">▥ Relatórios</Link>
        <Link to="/settings">⚙ Configurações</Link>
      </nav>

      <div className="app-sidebar__user">
        <div className="app-sidebar__avatar">{getInitials(user?.name)}</div>

        <div>
          <strong>{user?.name || 'Dev'}</strong>
          <small>{user?.email || 'dev@devbug.com'}</small>
        </div>
      </div>
    </aside>
  );
}

export default AppSidebar;