const SETTINGS_KEY = '@devbugtracker:settings';

const defaultSettings = {
  accent: 'blue',
  density: 'comfortable',
  startPage: '/dashboard',
};

const accentPresets = {
  blue: {
    '--blue': '#3b82f6',
    '--blue-soft': '#60a5fa',
    '--cyan': '#38bdf8',
    '--cyan-soft': '#67e8f9',
    '--border-bright': 'rgba(96, 165, 250, 0.48)',
    '--shadow-blue': '0 0 40px rgba(59, 130, 246, 0.25)',
  },
  purple: {
    '--blue': '#8b5cf6',
    '--blue-soft': '#a78bfa',
    '--cyan': '#c084fc',
    '--cyan-soft': '#ddd6fe',
    '--border-bright': 'rgba(167, 139, 250, 0.48)',
    '--shadow-blue': '0 0 40px rgba(139, 92, 246, 0.25)',
  },
  green: {
    '--blue': '#22c55e',
    '--blue-soft': '#86efac',
    '--cyan': '#34d399',
    '--cyan-soft': '#bbf7d0',
    '--border-bright': 'rgba(134, 239, 172, 0.42)',
    '--shadow-blue': '0 0 40px rgba(34, 197, 94, 0.22)',
  },
};

export function getAppSettings() {
  const settings = localStorage.getItem(SETTINGS_KEY);

  if (!settings) {
    return defaultSettings;
  }

  return {
    ...defaultSettings,
    ...JSON.parse(settings),
  };
}

export function saveAppSettings(settings) {
  const updatedSettings = {
    ...defaultSettings,
    ...settings,
  };

  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
  applyAppSettings(updatedSettings);

  return updatedSettings;
}

export function applyAppSettings(settings = getAppSettings()) {
  const accent = accentPresets[settings.accent] || accentPresets.blue;

  Object.entries(accent).forEach(([property, value]) => {
    document.documentElement.style.setProperty(property, value);
  });

  document.body.dataset.density = settings.density;
}

export function getStartPage() {
  return getAppSettings().startPage;
}