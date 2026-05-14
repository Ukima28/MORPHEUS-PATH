import { getProfile, logout } from '/morpheos-path/js/auth.js';

const BASE = '/morpheos-path';

const ROLE_LABELS = {
  admin:       'Адміністратор',
  pathologist: 'Патолог',
  laborant:    'Лаборант',
  registrar:   'Реєстратор',
};

const NAV = [
  { id: 'dashboard',     label: 'Dashboard',                   icon: 'home',          roles: ['admin','pathologist','laborant','registrar'], href: `${BASE}/pages/dashboard.html` },
  { id: 'cases',         label: 'Журнал заключень',            icon: 'clipboard', roles: ['admin','pathologist','laborant','registrar'], href: `${BASE}/pages/cases.html` },
  { id: 'autopsies',     label: 'Журнал розтинів',             icon: 'book',       roles: ['admin','pathologist','laborant','registrar'], href: `${BASE}/pages/autopsies.html` },
  { id: 'autopsy-adult', label: 'Протокол розтину (дорослий)', icon: 'file-plus',   roles: ['admin','pathologist','laborant'],            href: `${BASE}/pages/autopsy-adult.html` },
  { id: 'autopsy-child', label: 'Протокол розтину (дитячий)',  icon: 'file-plus',   roles: ['admin','pathologist','laborant'],            href: `${BASE}/pages/autopsy-child.html` },
  { id: 'cap',           label: 'Протоколи CAP',               icon: 'award',    roles: ['admin','pathologist','laborant'],            href: `${BASE}/pages/cap.html` },
  { id: 'knowledge',     label: 'База знань',                  icon: 'books',          roles: ['admin','pathologist','laborant','registrar'], href: `${BASE}/pages/knowledge.html` },
  { id: 'admin',         label: 'Адмін панель',                icon: 'shield',         roles: ['admin'],                                    href: `${BASE}/pages/admin.html` },
];

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
          <i class="ti ti-${item.icon}"></i>
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 32" width="90" height="29" role="img">
              <title>MORPHEOS PATHOLOGY</title>
              <text font-family="Arial,sans-serif" font-size="13" font-weight="700" textLength="100" lengthAdjust="spacing">
                <tspan x="0" y="14" fill="#1a1a1a">MORPHE</tspan><tspan fill="#BA1A32">OS</tspan>
              </text>
              <text x="0" y="28" font-family="Arial,sans-serif" font-size="10" font-weight="400" fill="#64748b" textLength="100" lengthAdjust="spacing">PATHOLOGY</text>
            </svg>
          </a>
        </h1>
        <div class="navbar-nav flex-row order-md-last">
          <div class="nav-item dropdown">
            <a href="#" class="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown">
              <span class="avatar avatar-sm" style="background:var(--tblr-primary);color:#ffffff">
                ${initials(profile.full_name)}
              </span>
              <div class="d-none d-xl-block ps-2">
                <div style="font-size:13px;font-weight:600">${profile.full_name}</div>
                <div class="mt-1 small text-muted">${ROLE_LABELS[profile.role] || profile.role}</div>
              </div>
            </a>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">

              <a href="#" id="btn-logout" class="dropdown-item text-danger">
                <i class="ti ti-logout me-2"></i>Вийти
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
    document.body.style.opacity = '0';
    setTimeout(() => logout(), 50);
  });

  // Плавний перехід між сторінками
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || link.getAttribute('data-bs-toggle')) return;
    if (href.startsWith('/morpheos-path')) {
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 50);
    }
  });

  return profile;
}


export function toast(message, type = 'success') {
  const colors = { success: '#2fb344', error: '#d63939', info: '#4299e1' };
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.style.cssText = `background:${colors[type]||colors.success};color:white;padding:12px 18px;border-radius:6px;font-size:13px;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,.15);animation:fadeIn .2s ease;min-width:220px`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity .3s';
    setTimeout(() => el.remove(), 300);
  }, 3200);
}
