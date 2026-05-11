import { getProfile, logout } from '/MORPHEUS-PATH/js/auth.js';

const BASE = '/MORPHEUS-PATH';

const ROLE_LABELS = {
  admin:       'Адміністратор',
  pathologist: 'Патолог',
  laborant:    'Лаборант',
  registrar:   'Реєстратор',
};

const NAV = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'fa-tachometer-alt',
    href: `${BASE}/pages/dashboard.html`,
    roles: ['admin','pathologist','laborant','registrar'],
  },
  {
    id: 'cases',
    label: 'Журнал заключень',
    icon: 'fa-table-list',
    href: `${BASE}/pages/cases.html`,
    roles: ['admin','pathologist','laborant','registrar'],
  },
  {
    id: 'autopsies',
    label: 'Журнал розтинів',
    icon: 'fa-book-medical',
    href: `${BASE}/pages/autopsies.html`,
    roles: ['admin','pathologist','laborant','registrar'],
  },
  {
    id: 'autopsy-adult',
    label: 'Протокол розтину (дорослий)',
    icon: 'fa-file-medical',
    href: `${BASE}/pages/autopsy-adult.html`,
    roles: ['admin','pathologist','laborant'],
  },
  {
    id: 'autopsy-child',
    label: 'Протокол розтину (дитячий)',
    icon: 'fa-file-medical',
    href: `${BASE}/pages/autopsy-child.html`,
    roles: ['admin','pathologist','laborant'],
  },
  {
    id: 'cap',
    label: 'Протоколи CAP',
    icon: 'fa-file-certificate',
    href: `${BASE}/pages/cap.html`,
    roles: ['admin','pathologist','laborant'],
  },
  {
    id: 'knowledge',
    label: 'База знань',
    icon: 'fa-book-open',
    href: `${BASE}/pages/knowledge.html`,
    roles: ['admin','pathologist','laborant','registrar'],
  },
  {
    id: 'admin',
    label: 'Адмін панель',
    icon: 'fa-shield-halved',
    href: `${BASE}/pages/admin.html`,
    roles: ['admin'],
  },
];

export function toast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: 'fa-check', error: 'fa-xmark', info: 'fa-circle-info' };
  const el = document.createElement('div');
  el.className = `mp-toast ${type}`;
  el.innerHTML = `<i class="fas ${icons[type] || 'fa-check'}"></i> ${message}`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

export async function renderShell(activePage) {
  const profile = await getProfile();
  if (!profile) return null;

  const items = NAV.filter(n => n.roles.includes(profile.role));

  const navHtml = items.map(item => `
    <li class="nav-item ${activePage === item.id ? 'active' : ''}">
      <a class="nav-link" href="${item.href}">
        <i class="fas fa-fw fa-${item.icon}"></i>
        <span>${item.label}</span>
      </a>
    </li>
  `).join('');

  const sidebarHtml = `
    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="${BASE}/pages/dashboard.html">
      <div class="sidebar-brand-text">MORPHEUS<br>PATHOLOGY</div>
    </a>

    <div class="sidebar-user px-3 py-3" style="border-bottom:1px solid #e2e8f0">
      <div class="user-name font-weight-bold text-dark" style="font-size:13px">${profile.full_name}</div>
      <div class="user-role text-muted" style="font-size:11px">${ROLE_LABELS[profile.role] || profile.role}${profile.organizations ? ' · ' + profile.organizations.name : ''}</div>
    </div>

    <hr class="sidebar-divider my-0">

    ${navHtml}

    <hr class="sidebar-divider d-none d-md-block">

    <div class="text-center d-none d-md-inline">
      <button class="rounded-circle border-0" id="sidebarToggle"></button>
    </div>

    <hr class="sidebar-divider">

    <li class="nav-item">
      <a class="nav-link" href="#" id="btn-logout">
        <i class="fas fa-fw fa-sign-out-alt"></i>
        <span>Вийти</span>
      </a>
    </li>
  `;

  const sidebar = document.getElementById('accordionSidebar');
  if (sidebar) {
    sidebar.innerHTML = sidebarHtml;
    document.getElementById('btn-logout')?.addEventListener('click', e => {
      e.preventDefault();
      logout();
    });
  }

  // Topbar user name
  const topbarUser = document.getElementById('topbar-username');
  if (topbarUser) topbarUser.textContent = profile.full_name;

  return profile;
}
