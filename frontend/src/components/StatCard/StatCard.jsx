import './StatCard.css';

function StatCard({ title, value, description, variant = 'default' }) {
  return (
    <article className={`stat-card stat-card--${variant}`}>
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{description}</small>
    </article>
  );
}

export default StatCard;