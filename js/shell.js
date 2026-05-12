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
    id:    'dashboard',
    label: 'Dashboard',
    icon:  'home',
    href:  `${BASE}/pages/dashboard.html`,
    roles: ['admin','pathologist','laborant','registrar'],
  },
  {
    id:    'cases',
    label: 'Журнал заключень',
    icon:  'clipboard-list',
    href:  `${BASE}/pages/cases.html`,
    roles: ['admin','pathologist','laborant','registrar'],
  },
  {
    id:    'autopsies',
    label: 'Журнал розтинів',
    icon:  'book-2',
    href:  `${BASE}/pages/autopsies.html`,
    roles: ['admin','pathologist','laborant','registrar'],
  },
  {
    id:    'autopsy-adult',
    label: 'Протокол розтину (дорослий)',
    icon:  'file-medical',
    href:  `${BASE}/pages/autopsy-adult.html`,
    roles: ['admin','pathologist','laborant'],
  },
  {
    id:    'autopsy-child',
    label: 'Протокол розтину (дитячий)',
    icon:  'file-medical',
    href:  `${BASE}/pages/autopsy-child.html`,
    roles: ['admin','pathologist','laborant'],
  },
  {
    id:    'cap',
    label: 'Протоколи CAP',
    icon:  'certificate',
    href:  `${BASE}/pages/cap.html`,
    roles: ['admin','pathologist','laborant'],
  },
  {
    id:    'knowledge',
    label: 'База знань',
    icon:  'books',
    href:  `${BASE}/pages/knowledge.html`,
    roles: ['admin','pathologist','laborant','registrar'],
  },
  {
    id:    'admin',
    label: 'Адмін панель',
    icon:  'shield',
    href:  `${BASE}/pages/admin.html`,
    roles: ['admin'],
  },
];

function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export async function renderShell(activePage) {
  const profile = await getProfile();
  if (!profile) return null;

  const items = NAV.filter(n => n.roles.includes(profile.role));

  const navHtml = items.map(item => `
    <li class="nav-item ${activePage === item.id ? 'active' : ''}">
      <a class="nav-link" href="${item.href}">
        <span class="nav-link-icon d-md-none d-lg-inline-block">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24"
            stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <use href="#icon-${item.icon}"/>
          </svg>
        </span>
        <span class="nav-link-title">${item.label}</span>
      </a>
    </li>
  `).join('');

  const orgName = profile.organizations?.name || '';

  const html = `
    <aside class="navbar navbar-vertical navbar-expand-lg" data-bs-theme="dark">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sidebar-menu">
          <span class="navbar-toggler-icon"></span>
        </button>

        <h1 class="navbar-brand navbar-brand-autodark">
          <a href="${BASE}/pages/cases.html">
            <span class="fw-bold" style="font-size:13px;letter-spacing:.08em">MORPHEUS<br>PATHOLOGY</span>
          </a>
        </h1>

        <div class="collapse navbar-collapse" id="sidebar-menu">
          <ul class="navbar-nav pt-lg-3">
            ${navHtml}
          </ul>

          <div class="mt-auto pt-3 pb-3 border-top border-top-subtle">
            <div class="d-flex align-items-center px-3 mb-3">
              <span class="avatar avatar-sm me-2" style="background:var(--tblr-primary)">
                ${initials(profile.full_name)}
              </span>
              <div class="flex-fill" style="min-width:0">
                <div class="fw-semibold text-white" style="font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                  ${profile.full_name}
                </div>
                <div style="font-size:11px;color:rgba(255,255,255,.5)">
                  ${ROLE_LABELS[profile.role] || profile.role}${orgName ? ' · ' + orgName : ''}
                </div>
              </div>
            </div>
            <div class="px-3">
              <a href="#" id="btn-logout" class="btn btn-outline-secondary w-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon me-1" width="24" height="24" viewBox="0 0 24 24"
                  stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"/>
                  <path d="M9 12h12l-3 -3"/>
                  <path d="M18 15l3 -3"/>
                </svg>
                Вийти
              </a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  `;

  const wrapper = document.querySelector('.navbar-vertical-container') || document.querySelector('#sidebar-placeholder');
  if (wrapper) wrapper.innerHTML = html;

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
  const html = `
    <div id="${id}" class="toast align-items-center text-white ${colors[type] || colors.success} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>`;

  container.insertAdjacentHTML('beforeend', html);
  const el = document.getElementById(id);
  const t = new bootstrap.Toast(el, { delay: 3500 });
  t.show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}
