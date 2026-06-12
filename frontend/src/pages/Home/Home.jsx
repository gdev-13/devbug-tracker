import './Home.css';
import mascotProgramming from '../../assets/mascot-programming.png';
import stepProject from '../../assets/step-project.png';
import stepOrganize from '../../assets/step-organize.png';
import stepResolve from '../../assets/step-resolve.png';
import { Link } from 'react-router';

function Home() {
  return (
    <main className="landing-page">
      <header className="header">
        <a href="/" className="logo" aria-label="DevBug Tracker">
          <span className="logo__icon">⌬</span>
          <span>
            DevBug <strong>Tracker</strong>
          </span>
        </a>

        <nav className="nav" aria-label="Navegação principal">
          <a href="#resources">Recursos</a>
          <a href="#how-it-works">Como funciona</a>
          <a href="#about">Sobre</a>
        </nav>

        <div className="header__actions">
          <Link to="/login" className="button button--ghost">
            Entrar
          </Link>
          <a href="/register" className="button button--primary">
            Criar conta
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="hero__content">
          <h1>
            Um lugar para organizar bugs,{' '}
            <span>projetos e soluções.</span>
          </h1>

          <p>
            O DevBug Tracker ajuda devs e times a registrar problemas,
            gerenciar projetos, documentar soluções e visualizar tudo em um
            dashboard poderoso. Simples, rápido e feito para desenvolvedores.
          </p>

          <div className="hero__actions">
            <a href="/register" className="button button--primary button--large">
              Criar conta grátis <span>→</span>
            </a>

            <a href="#how-it-works" className="button button--ghost button--large">
              Ver como funciona <span className="play-icon">▶</span>
            </a>
          </div>

          <div className="hero__benefits">
            <span>✓ Grátis para começar</span>
            <span>▣ Sem cartão de crédito</span>
            <span>⚡ Setup em 1 minuto</span>
          </div>
        </div>

        <aside className="dashboard-preview" aria-label="Prévia do dashboard">
          <div className="dashboard-preview__sidebar">
            <div className="dashboard-preview__brand">
              <span>⌬</span>
              DevBug <strong>Tracker</strong>
            </div>

            <ul>
              <li className="active">⌂ Visão geral</li>
              <li>◌ Issues</li>
              <li>▣ Projetos</li>
              <li>⌬ Bugs</li>
              <li>▤ Atividades</li>
              <li>▥ Relatórios</li>
              <li>◇ Etiquetas</li>
              <li>⚙ Configurações</li>
            </ul>

            <div className="team-card">
              <span>⌘</span>
              <div>
                <strong>WebApp</strong>
                <small>Time</small>
              </div>
            </div>
          </div>

          <div className="dashboard-preview__main">
            <div className="dashboard-preview__topbar">
              <div className="search-box">⌕ Buscar issues...</div>

              <div className="topbar-icons">
                <span>◌</span>
                <span>♢</span>
                <span className="avatar">LD</span>
              </div>
            </div>

            <h2>Visão geral</h2>

            <div className="metric-grid">
              <article className="metric-card">
                <small>Projetos</small>
                <strong>12</strong>
                <span>+2 este mês</span>
              </article>

              <article className="metric-card">
                <small>Bugs abertos</small>
                <strong>45</strong>
                <span>+8 este mês</span>
              </article>

              <article className="metric-card metric-card--danger">
                <small>Bugs críticos</small>
                <strong>7</strong>
                <span>-2 este mês</span>
              </article>

              <article className="metric-card metric-card--success">
                <small>Bugs resolvidos</small>
                <strong>128</strong>
                <span>+15 este mês</span>
              </article>
            </div>

            <div className="chart-grid">
              <article className="chart-card">
                <h3>Bugs por status</h3>

                <div className="donut-chart">
                  <div>
                    <strong>180</strong>
                    <small>Total</small>
                  </div>
                </div>

                <ul className="chart-legend">
                  <li><span className="dot dot--blue"></span>Abertos 45</li>
                  <li><span className="dot dot--purple"></span>Em andamento 38</li>
                  <li><span className="dot dot--orange"></span>Aguardando 17</li>
                  <li><span className="dot dot--green"></span>Resolvidos 80</li>
                </ul>
              </article>

              <article className="chart-card">
                <div className="chart-card__header">
                  <h3>Bugs por prioridade</h3>
                  <small>Últimas 5 semanas</small>
                </div>

                <div className="line-chart">
                  <svg viewBox="0 0 320 160" role="img" aria-label="Gráfico de bugs por prioridade">
                    <path
                      className="line-chart__area"
                      d="M0,110 C40,95 55,65 90,82 C130,104 150,35 190,58 C230,86 240,42 280,38 C300,36 310,20 320,16 L320,160 L0,160 Z"
                    />
                    <path
                      className="line-chart__line"
                      d="M0,110 C40,95 55,65 90,82 C130,104 150,35 190,58 C230,86 240,42 280,38 C300,36 310,20 320,16"
                    />
                    <path
                      className="line-chart__line line-chart__line--muted"
                      d="M0,130 C45,125 80,115 110,120 C150,128 175,100 210,112 C250,130 275,115 320,118"
                    />
                  </svg>
                </div>

                <div className="priority-legend">
                  <span>Crítica</span>
                  <span>Alta</span>
                  <span>Média</span>
                  <span>Baixa</span>
                </div>
              </article>
            </div>

            <article className="activity-card">
              <div className="activity-card__header">
                <h3>Atividades recentes</h3>
                <a href="/dashboard">Ver todas →</a>
              </div>

              <ul>
                <li>
                  <span className="activity-icon activity-icon--danger">⌬</span>
                  <div>
                    <strong>Bug crítico em /api/auth/login</strong>
                    <small>Projeto: API Server</small>
                  </div>
                  <span className="badge badge--danger">Crítico</span>
                  <small>Há 1h</small>
                </li>

                <li>
                  <span className="activity-icon activity-icon--warning">!</span>
                  <div>
                    <strong>Erro ao salvar configuração do usuário</strong>
                    <small>Projeto: Web Dashboard</small>
                  </div>
                  <span className="badge badge--warning">Alta</span>
                  <small>Há 3h</small>
                </li>

                <li>
                  <span className="activity-icon activity-icon--success">✓</span>
                  <div>
                    <strong>Falha ao processar pagamento com cartão inválido</strong>
                    <small>Projeto: E-commerce</small>
                  </div>
                  <span className="badge badge--success">Resolvido</span>
                  <small>Há 5h</small>
                </li>
              </ul>
            </article>
          </div>
        </aside>
      </section>

<section className="benefit-strip" id="resources">
  <article>
    <span className="benefit-strip__icon">👥</span>
    <div>
      <h3>Colaboração que flui</h3>
      <p>Comente, atribua, mencione e mantenha todo o time alinhado em cada detalhe.</p>
    </div>
  </article>

  <article>
    <span className="benefit-strip__icon">⚡</span>
    <div>
      <h3>Mais foco, menos ruído</h3>
      <p>Priorize o que importa, filtre o que não importa e entregue com consistência.</p>
    </div>
  </article>

  <article>
    <span className="benefit-strip__icon">✓</span>
    <div>
      <h3>Transparência total</h3>
      <p>Tenha visibilidade do progresso, métricas e histórico de decisões.</p>
    </div>
  </article>

  <article>
    <span className="benefit-strip__icon">🛡</span>
    <div>
      <h3>Seguro por padrão</h3>
      <p>Seus dados protegidos com boas práticas e infraestrutura confiável.</p>
    </div>
  </article>
</section>

<section className="how-it-works" id="how-it-works">
  <h2>
    Como funciona em <span>3 passos</span>
  </h2>

  <div className="steps">
    <article className="step-card">
      <span className="step-card__number">1</span>

      <div className="step-card__art">
        <img src={stepProject} alt="Ícone de criação de projeto" />
      </div>

      <div>
        <h3>Crie seu projeto</h3>
        <p>Configure seu time, adicione projetos e personalize fluxos e categorias.</p>
      </div>
    </article>

    <article className="step-card">
      <span className="step-card__number">2</span>

      <div className="step-card__art">
        <img src={stepOrganize} alt="Ícone de organização de bugs" />
      </div>

      <div>
        <h3>Registre e organize</h3>
        <p>Registre bugs, ideias e melhorias. Priorize, atribua e acompanhe o progresso.</p>
      </div>
    </article>

    <article className="step-card">
      <span className="step-card__number">3</span>

      <div className="step-card__art">
        <img src={stepResolve} alt="Ícone de resolução e evolução" />
      </div>

      <div>
        <h3>Resolva e evolua</h3>
        <p>Resolva issues, aprenda com o histórico e melhore seu produto continuamente.</p>
      </div>
    </article>
  </div>
</section>

<section className="final-cta" id="about">
  <div className="mascot">
    <img src={mascotProgramming} alt="Mascote do DevBug Tracker programando" />
  </div>

  <div className="final-cta__content">
    <h2>
      Pronto para transformar sua forma de organizar bugs e construir{' '}
      <span>melhores produtos?</span>
    </h2>

    <p>
      Junte-se a desenvolvedores que valorizam clareza, contexto e documentação técnica.
    </p>
  </div>

  <div className="final-cta__actions">
    <a href="/register" className="button button--primary button--large">
      Criar conta grátis <span>→</span>
    </a>

    <small>❤️ Feito por devs, para devs.</small>
  </div>
</section>
    </main>
  );
}

export default Home;