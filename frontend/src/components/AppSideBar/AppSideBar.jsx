import { Link, NavLink } from 'react-router';

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

function getImageUrl(profileImageUrl) {
  if (!profileImageUrl) {
    return null;
  }

  if (profileImageUrl.startsWith('http')) {
    return profileImageUrl;
  }

  return `${import.meta.env.VITE_API_URL}${profileImageUrl}`;
}

function AppSidebar({ userOverride }) {
  const storedUser = getAuthUser();
  const user = userOverride || storedUser;
  const profileImageUrl = getImageUrl(user?.profileImageUrl);

  return (
    <aside className="app-sidebar">
      <Link to="/dashboard" className="app-sidebar__brand">
        <span className="app-sidebar__logo">⌬</span>
        <span>
          DevBug <strong>Tracker</strong>
        </span>
      </Link>

      <nav className="app-sidebar__nav" aria-label="Menu principal">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          ⌂ Visão geral
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          ▣ Projetos
        </NavLink>

        <NavLink
          to="/bugs"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          ⌬ Bugs
        </NavLink>
        
        <a href="#activity">▤ Atividades</a>
        <a href="#reports">▥ Relatórios</a>
        <a href="#settings">⚙ Configurações</a>
      </nav>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `app-sidebar__user ${isActive ? 'active' : ''}`
        }
      >
        <div className="app-sidebar__avatar">
          {profileImageUrl ? (
            <img src={profileImageUrl} alt={`Foto de ${user?.name || 'usuário'}`} />
          ) : (
            getInitials(user?.name)
          )}
        </div>

        <div>
          <strong>{user?.name || 'Dev'}</strong>
          <small>{user?.email || 'dev@devbug.com'}</small>
        </div>
      </NavLink>
    </aside>
  );
}

export default AppSidebar;