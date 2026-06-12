import { Link } from 'react-router';

import AppSidebar from '../../components/AppSidebar/AppSidebar';
import DashboardSummary from '../../components/DashboardSummary/DashboardSummary';

import mascotProgramming from '../../assets/mascot-programming.png';
import stepProject from '../../assets/step-project.png';
import stepOrganize from '../../assets/step-organize.png';
import stepResolve from '../../assets/step-resolve.png';

import './Home.css';

const homeDashboardExample = {
  totalProjects: 12,
  projectsInProgress: 7,
  projectsCompleted: 3,
  projectsPaused: 2,

  totalBugs: 180,
  openBugs: 45,
  inProgressBugs: 55,
  resolvedBugs: 80,

  lowSeverityBugs: 20,
  mediumSeverityBugs: 32,
  highSeverityBugs: 41,
  criticalSeverityBugs: 52,
};

const homePreviewUser = {
  name: 'Usuário',
  email: 'user@test.com',
};

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
            Um lugar para organizar bugs, <span>projetos e soluções.</span>
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
          <div className="dashboard-preview__shell">
            <AppSidebar userOverride={homePreviewUser} />

            <section className="dashboard-content">
              <header className="dashboard-header">
                <div>
                  <span className="dashboard-header__tag">Visão geral</span>

                  <h1>Bem-vindo, Usuário.</h1>

                  <p>
                    Acompanhe seus projetos, bugs críticos, soluções documentadas
                    e métricas principais em um só lugar.
                  </p>
                </div>

                <button type="button" className="button button--primary">
                  Adicionar projeto
                </button>
              </header>

              <DashboardSummary dashboard={homeDashboardExample} />
            </section>
          </div>
        </aside>
      </section>

      <section className="benefit-strip" id="resources">
        <article>
          <span className="benefit-strip__icon">👥</span>
          <div>
            <h3>Colaboração que flui</h3>
            <p>
              Comente, atribua, mencione e mantenha todo o time alinhado em cada detalhe.
            </p>
          </div>
        </article>

        <article>
          <span className="benefit-strip__icon">⚡</span>
          <div>
            <h3>Mais foco, menos ruído</h3>
            <p>
              Priorize o que importa, filtre o que não importa e entregue com consistência.
            </p>
          </div>
        </article>

        <article>
          <span className="benefit-strip__icon">✓</span>
          <div>
            <h3>Transparência total</h3>
            <p>
              Tenha visibilidade do progresso, métricas e histórico de decisões.
            </p>
          </div>
        </article>

        <article>
          <span className="benefit-strip__icon">🛡</span>
          <div>
            <h3>Seguro por padrão</h3>
            <p>
              Seus dados protegidos com boas práticas e infraestrutura confiável.
            </p>
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
              <p>
                Configure seu time, adicione projetos e personalize fluxos e categorias.
              </p>
            </div>
          </article>

          <article className="step-card">
            <span className="step-card__number">2</span>

            <div className="step-card__art">
              <img src={stepOrganize} alt="Ícone de organização de bugs" />
            </div>

            <div>
              <h3>Registre e organize</h3>
              <p>
                Registre bugs, ideias e melhorias. Priorize, atribua e acompanhe o progresso.
              </p>
            </div>
          </article>

          <article className="step-card">
            <span className="step-card__number">3</span>

            <div className="step-card__art">
              <img src={stepResolve} alt="Ícone de resolução e evolução" />
            </div>

            <div>
              <h3>Resolva e evolua</h3>
              <p>
                Resolva issues, aprenda com o histórico e melhore seu produto continuamente.
              </p>
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
            Junte-se a desenvolvedores que valorizam clareza, contexto e
            documentação técnica.
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