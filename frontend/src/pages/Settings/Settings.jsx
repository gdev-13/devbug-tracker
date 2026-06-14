import { useEffect, useState } from 'react';

import AppSideBar from '../../components/AppSideBar/AppSideBar';
import { getAppSettings, saveAppSettings } from '../../services/settingsStorage';

import './Settings.css';

const accentOptions = [
  {
    value: 'blue',
    label: 'Azul',
    description: 'Visual principal do DevBug Tracker.',
  },
  {
    value: 'purple',
    label: 'Roxo',
    description: 'Um destaque mais tecnológico e vibrante.',
  },
  {
    value: 'green',
    label: 'Verde',
    description: 'Uma aparência mais calma e positiva.',
  },
];

const densityOptions = [
  {
    value: 'comfortable',
    label: 'Confortável',
    description: 'Mais espaçamento entre elementos.',
  },
  {
    value: 'compact',
    label: 'Compacta',
    description: 'Mais conteúdo visível na tela.',
  },
];

const startPageOptions = [
  { value: '/dashboard', label: 'Visão geral' },
  { value: '/projects', label: 'Projetos' },
  { value: '/bugs', label: 'Bugs' },
  { value: '/reports', label: 'Relatórios' },
  { value: '/activities', label: 'Atividades' },
];

function Settings() {
  const [settings, setSettings] = useState(getAppSettings());
  const [message, setMessage] = useState('');

  useEffect(() => {
    saveAppSettings(settings);
  }, [settings]);

  function updateSetting(name, value) {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [name]: value,
    }));

    setMessage('Preferências atualizadas com sucesso.');
  }

  return (
    <main className="settings-page">
      <AppSideBar />

      <section className="settings-content">
        <header className="settings-header">
          <div>
            <span className="settings-header__tag">Configurações</span>

            <h1>Preferências do app.</h1>

            <p>
              Ajuste aparência, densidade e comportamento inicial da aplicação.
            </p>
          </div>
        </header>

        {message && (
          <div className="settings-feedback">
            {message}
          </div>
        )}

        <section className="settings-grid">
          <article className="settings-card">
            <div className="settings-card__header">
              <h2>Cor principal</h2>
              <p>Escolha o destaque visual usado nos botões, bordas e elementos ativos.</p>
            </div>

            <div className="settings-options">
              {accentOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={settings.accent === option.value ? 'active' : ''}
                  onClick={() => updateSetting('accent', option.value)}
                >
                  <span className={`settings-color settings-color--${option.value}`}></span>

                  <div>
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </div>
                </button>
              ))}
            </div>
          </article>

          <article className="settings-card">
            <div className="settings-card__header">
              <h2>Densidade da interface</h2>
              <p>Controle se a interface fica mais espaçada ou mais compacta.</p>
            </div>

            <div className="settings-options">
              {densityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={settings.density === option.value ? 'active' : ''}
                  onClick={() => updateSetting('density', option.value)}
                >
                  <span className="settings-option-icon">
                    {option.value === 'comfortable' ? '▦' : '▥'}
                  </span>

                  <div>
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </div>
                </button>
              ))}
            </div>
          </article>

          <article className="settings-card settings-card--wide">
            <div className="settings-card__header">
              <h2>Página inicial após login</h2>
              <p>Escolha para onde o sistema deve levar você depois de entrar.</p>
            </div>

            <div className="settings-start-pages">
              {startPageOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={settings.startPage === option.value ? 'active' : ''}
                  onClick={() => updateSetting('startPage', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

export default Settings;