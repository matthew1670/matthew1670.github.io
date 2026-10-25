const yearElement = document.getElementById('year');
if (yearElement) yearElement.textContent = String(new Date().getFullYear());

const analyticsId = 'G-31CLVEWGKL';
const preferenceKey = 'analytics-preference';
let analyticsEnabled = false;
try {
  analyticsEnabled = localStorage.getItem(preferenceKey) === 'enabled';
} catch {
  // If browser storage is unavailable, keep analytics off.
}

function scheduleWhenIdle(callback) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(callback);
    return;
  }
  setTimeout(callback, 50);
}

function loadAnalytics() {
  scheduleWhenIdle(() => {
    window[`ga-disable-${analyticsId}`] = false;
    if (document.getElementById('analytics-script')) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', analyticsId);
    const script = document.createElement('script');
    script.id = 'analytics-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
    document.head.appendChild(script);
  });
}

function clearAnalyticsCookies() {
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim();
    if (name !== '_ga' && !name.startsWith('_ga_')) continue;
    const expired = `${name}=; Max-Age=0; path=/`;
    document.cookie = expired;
    const parts = location.hostname.split('.');
    for (let i = 0; i < parts.length - 1; i++) {
      document.cookie = `${expired}; domain=${parts.slice(i).join('.')}`;
    }
  }
}

const statusElement = document.getElementById('analytics-status');
function updateAnalyticsToggles() {
  const enableButton = document.getElementById('analytics-enable');
  const disableButton = document.getElementById('analytics-disable');

  if (enableButton) enableButton.setAttribute('aria-pressed', String(analyticsEnabled));
  if (disableButton) disableButton.setAttribute('aria-pressed', String(!analyticsEnabled));
}

function updateAnalyticsStatus() {
  if (statusElement) statusElement.textContent = `Analytics is ${analyticsEnabled ? 'on' : 'off'} in this browser.`;
  updateAnalyticsToggles();
}

function setAnalyticsPreference(enabled) {
  try {
    localStorage.setItem(preferenceKey, enabled ? 'enabled' : 'disabled');
  } catch {
    if (enabled) {
      if (statusElement) statusElement.textContent = 'Your browser could not save this preference. Analytics remains off.';
      return;
    }
  }
  analyticsEnabled = enabled;
  window[`ga-disable-${analyticsId}`] = !enabled;
  if (enabled) loadAnalytics();
  else clearAnalyticsCookies();
  updateAnalyticsStatus();
}

for (const [id, enabled] of [['analytics-enable', true], ['analytics-disable', false]]) {
  const button = document.getElementById(id);
  if (button) {
    button.hidden = false;
    button.addEventListener('click', () => setAnalyticsPreference(enabled));
  }
}
window.addEventListener('storage', (event) => {
  if (event.key !== preferenceKey && event.key !== null) return;
  analyticsEnabled = event.key !== null && event.newValue === 'enabled';
  window[`ga-disable-${analyticsId}`] = !analyticsEnabled;
  if (analyticsEnabled) loadAnalytics();
  else clearAnalyticsCookies();
  updateAnalyticsStatus();
});
if (analyticsEnabled) loadAnalytics();
updateAnalyticsStatus();
