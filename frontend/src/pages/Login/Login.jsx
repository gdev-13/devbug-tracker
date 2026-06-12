import { Link } from 'react-router';

import './Login.css';

function Login() {
  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-card__brand">
          <Link to="/" className="login-card__logo">
            <span className="login-card__logo-icon">⌬</span>
            <span>
              DevBug <strong>Tracker</strong>
            </span>
          </Link>

          <Link to="/" className="login-card__back">
            Voltar para início
          </Link>
        </div>

        <div className="login-card__header">
          <span className="login-card__tag">Acesse sua área</span>

          <h1>Bem-vindo de volta.</h1>

          <p>
            Entre para acompanhar seus projetos, registrar bugs, documentar
            soluções e visualizar seu progresso.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <div className="form-group__top">
              <label htmlFor="password">Senha</label>
              <a href="#forgot-password">Esqueceu a senha?</a>
            </div>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Digite sua senha"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="button button--primary login-form__button">
            Entrar na plataforma
          </button>
        </form>

        <p className="login-card__footer">
          Ainda não tem uma conta? <a href="/register">Criar conta grátis</a>
        </p>
      </section>

      <aside className="login-preview" aria-label="Resumo visual do DevBug Tracker">
        <div className="login-preview__glow"></div>

        <div className="login-preview__content">
          <span className="login-preview__tag">Dashboard inteligente</span>

          <h2>Volte exatamente para onde parou.</h2>

          <p>
            Seus projetos, bugs críticos, soluções documentadas e métricas ficam
            reunidos em um painel feito para devs.
          </p>

          <div className="login-preview__metrics">
            <article>
              <span>Projetos ativos</span>
              <strong>12</strong>
            </article>

            <article>
              <span>Bugs abertos</span>
              <strong>45</strong>
            </article>

            <article>
              <span>Resolvidos</span>
              <strong>128</strong>
            </article>
          </div>

          <div className="login-preview__bug-card">
            <div>
              <span className="login-preview__status"></span>
              <strong>Bug crítico em /api/auth/login</strong>
            </div>

            <small>Prioridade alta • há 1h</small>
          </div>
        </div>
      </aside>
    </main>
  );
}

export default Login;