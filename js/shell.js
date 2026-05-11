import { getProfile, logout } from '/MORPHEUS-PATH/js/auth.js';

const BASE = '/MORPHEUS-PATH';

const ROLE_LABELS = {
  admin:       'Адміністратор',
  pathologist: 'Патолог',
  laborant:    'Лаборант',
  registrar:   'Реєстратор',
};

function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export async function renderShell(activePage) {
  const profile = await getProfile();
  if (!profile) return null;

  const nav = [
    {
      id:    'cases',
      label: 'Журнал заключень',
      href:  `${BASE}/pages/cases.html`,
      icon:  'ti-layout-list',
      roles: ['admin','pathologist','laborant','registrar'],
    },
    {
      id:    'cap',
      label: 'Протоколи CAP',
      href:  `${BASE}/pages/cap.html`,
      icon:  'ti-file-certificate',
      roles: ['admin','pathologist','laborant'],
    },
    {
      id:    'knowledge',
      label: 'База знань',
      href:  `${BASE}/pages/knowledge.html`,
      icon:  'ti-books',
      roles: ['admin','pathologist','laborant','registrar'],
    },
    {
      id:    'admin',
      label: 'Адмін панель',
      href:  `${BASE}/pages/admin.html`,
      icon:  'ti-shield',
      roles: ['admin'],
    },
  ].filter(item => item.roles.includes(profile.role));

  const navHtml = nav.map(item => `
    <a class="nav-item ${activePage === item.id ? 'active' : ''}" href="${item.href}">
      <i class="ti ${item.icon}" aria-hidden="true"></i>
      <span>${item.label}</span>
    </a>
  `).join('');

  const html = `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="sidebar-logo-box">M</div>
        <div>
          <div class="sidebar-brand">MORPHEUS PATH</div>
          <div class="sidebar-sub">Pathomorphology IS</div>
        </div>
      </div>
      <nav class="sidebar-nav">${navHtml}</nav>
      <div class="sidebar-footer">
        <div class="sidebar-avatar">${initials(profile.full_name)}</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">${profile.full_name}</div>
          <div class="sidebar-user-role">${ROLE_LABELS[profile.role] || profile.role}</div>
        </div>
        <button class="btn-logout" id="btn-logout" title="Вийти">
          <i class="ti ti-logout" aria-hidden="true"></i>
        </button>
      </div>
    </aside>
  `;

  const shell = document.querySelector('.app-shell');
  if (shell) shell.insertAdjacentHTML('afterbegin', html);

  document.getElementById('btn-logout')?.addEventListener('click', logout);

  return profile;
}

export function toast(message, type = 'success') {
  const icons = {
    success: 'ti-check',
    error:   'ti-x',
    info:    'ti-info-circle',
  };

  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<i class="ti ${icons[type] || 'ti-check'}" aria-hidden="true"></i> ${message}`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}
