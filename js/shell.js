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

function initSidebarCollapse() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const btn = document.createElement('button');
  btn.className = 'sb-toggle';
  btn.setAttribute('aria-label', 'Згорнути меню');
  btn.innerHTML = '‹';
  sidebar.appendChild(btn);

  const saved = localStorage.getItem('sb-collapsed');
  if (saved === 'true') {
    sidebar.classList.add('collapsed');
    btn.innerHTML = '›';
  }

  btn.addEventListener('click', () => {
    const collapsed = sidebar.classList.toggle('collapsed');
    btn.innerHTML = collapsed ? '›' : '‹';
    localStorage.setItem('sb-collapsed', collapsed);
  });
}

export async function renderShell(activePage) {
  const profile = await getProfile();
  if (!profile) return null;

  const nav = [
    { id: 'cases',     label: 'Журнал заключень', href: `${BASE}/pages/cases.html`,     icon: 'fa-solid fa-table-list',            roles: ['admin','pathologist','laborant','registrar'] },
    { id: 'cap',       label: 'Протоколи CAP',     href: `${BASE}/pages/cap.html`,       icon: 'fa-solid fa-file-medical',          roles: ['admin','pathologist','laborant'] },
    { id: 'knowledge', label: 'База знань',         href: `${BASE}/pages/knowledge.html`, icon: 'fa-solid fa-book-open',             roles: ['admin','pathologist','laborant','registrar'] },
    { id: 'admin',     label: 'Адмін панель',       href: `${BASE}/pages/admin.html`,     icon: 'fa-solid fa-shield-halved',         roles: ['admin'] },
  ].filter(item => item.roles.includes(profile.role));

  const navHtml = nav.map(item => `
    <a class="nav-item ${activePage === item.id ? 'active' : ''}" href="${item.href}">
      <i class="${item.icon}" aria-hidden="true"></i>
      <span class="nav-label">${item.label}</span>
    </a>
  `).join('');

  const html = `
    <aside class="sidebar">
      <div class="sb-logo">
        <div class="sb-logo-box">M</div>
        <div class="sb-logo-name">MORPHEUS<br>PATHOLOGY</div>
      </div>

      <div class="sb-profile">
        <div class="sb-avatar">${initials(profile.full_name)}</div>
        <div class="sb-user-info">
          <div class="sb-user-name">${profile.full_name}</div>
          <div class="sb-user-role">${ROLE_LABELS[profile.role] || profile.role}</div>
        </div>
      </div>

      <nav class="sb-nav">${navHtml}</nav>

      <div class="sb-footer">
        <button class="sb-logout" id="btn-logout">
          <i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>
          <span class="nav-label">Вийти</span>
        </button>
      </div>
    </aside>
  `;

  const shell = document.querySelector('.app-shell');
  if (shell) shell.insertAdjacentHTML('afterbegin', html);

  document.getElementById('btn-logout')?.addEventListener('click', logout);
  initSidebarCollapse();

  return profile;
}

export function toast(message, type = 'success') {
  const icons = {
    success: 'fa-solid fa-check',
    error:   'fa-solid fa-xmark',
    info:    'fa-solid fa-circle-info',
  };

  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<i class="${icons[type] || 'fa-solid fa-check'}" aria-hidden="true"></i> ${message}`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}
