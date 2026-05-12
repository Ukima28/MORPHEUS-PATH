import { getProfile, logout } from '/MORPHEUS-PATH/js/auth.js';

const BASE = '/MORPHEUS-PATH';

const ROLE_LABELS = {
  admin:       'Адміністратор',
  pathologist: 'Патолог',
  laborant:    'Лаборант',
  registrar:   'Реєстратор',
};

const NAV = [
  { id: 'dashboard',     label: 'Dashboard',                       icon: 'home',          roles: ['admin','pathologist','laborant','registrar'], href: `${BASE}/pages/dashboard.html` },
  { id: 'cases',         label: 'Журнал заключень',                icon: 'clipboard-list', roles: ['admin','pathologist','laborant','registrar'], href: `${BASE}/pages/cases.html` },
  { id: 'autopsies',     label: 'Журнал розтинів',                 icon: 'book-2',         roles: ['admin','pathologist','laborant','registrar'], href: `${BASE}/pages/autopsies.html` },
  { id: 'autopsy-adult', label: 'Протокол розтину (дорослий)',     icon: 'file-medical',   roles: ['admin','pathologist','laborant'],            href: `${BASE}/pages/autopsy-adult.html` },
  { id: 'autopsy-child', label: 'Протокол розтину (дитячий)',      icon: 'file-medical',   roles: ['admin','pathologist','laborant'],            href: `${BASE}/pages/autopsy-child.html` },
  { id: 'cap',           label: 'Протоколи CAP',                   icon: 'certificate',    roles: ['admin','pathologist','laborant'],            href: `${BASE}/pages/cap.html` },
  { id: 'knowledge',     label: 'База знань',                      icon: 'books',          roles: ['admin','pathologist','laborant','registrar'], href: `${BASE}/pages/knowledge.html` },
  { id: 'admin',         label: 'Адмін панель',                    icon: 'shield',         roles: ['admin'],                                    href: `${BASE}/pages/admin.html` },
];

function icon(name, cls = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" class="icon ${cls}" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <use href="https://cdn.jsdelivr.net/npm/@tabler/icons@3.26.0/icons/sprite.svg#tabler-${name}"/>
  </svg>`;
}

function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export async function renderShell(activePage) {
  const profile = await getProfile();
  if (!profile) return null;

  const items = NAV.filter(n => n.roles.includes(profile.role));

  const navItems = items.map(item => `
    <li class="nav-item ${activePage === item.id ? 'active' : ''}">
      <a class="nav-link" href="${item.href}">
        <span class="nav-link-icon d-md-none d-lg-inline-block">
          ${icon(item.icon)}
        </span>
        <span class="nav-link-title">${item.label}</span>
      </a>
    </li>
  `).join('');

  const html = `
    <header class="navbar navbar-expand-md d-print-none">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
          <span class="navbar-toggler-icon"></span>
        </button>

        <h1 class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
          <a href="${BASE}/pages/cases.html" class="text-decoration-none">
            <span class="fw-bold" style="font-size:13px;letter-spacing:.06em;line-height:1.2;display:block">
              MORPHEUS<br>PATHOLOGY
            </span>
          </a>
        </h1>

        <div class="navbar-nav flex-row order-md-last">
          <div class="nav-item dropdown">
            <a href="#" class="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown">
              <span class="avatar avatar-sm" style="background:var(--tblr-primary)">
                ${initials(profile.full_name)}
              </span>
              <div class="d-none d-xl-block ps-2">
                <div style="font-size:13px;font-weight:600">${profile.full_name}</div>
                <div class="mt-1 small text-muted">${ROLE_LABELS[profile.role] || profile.role}</div>
              </div>
            </a>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <a href="#" id="btn-logout" class="dropdown-item text-danger">
                ${icon('logout', 'me-1')} Вийти
              </a>
            </div>
          </div>
        </div>

        <div class="collapse navbar-collapse" id="navbar-menu">
          <div class="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center">
            <ul class="navbar-nav">
              ${navItems}
            </ul>
          </div>
        </div>
      </div>
    </header>
  `;

  const placeholder = document.getElementById('navbar-placeholder');
  if (placeholder) placeholder.outerHTML = html;

  document.getElementById('btn-logout')?.addEventListener('click', e => {
    e.preventDefault();
    logout();
  });

  return profile;
}

export function toast(message, type = 'success') {
  const colors = { success: 'bg-success', error: 'bg-danger', info: 'bg-info' };

  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }

  const id = 'toast-' + Date.now();
  container.insertAdjacentHTML('beforeend', `
    <div id="${id}" class="toast align-items-center text-white ${colors[type] || colors.success} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body fw-semibold">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>`);

  const el = document.getElementById(id);
  const t = new bootstrap.Toast(el, { delay: 3500 });
  t.show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}
