import { getProfile, logout } from './auth.js';

// Іконки SVG
const ICONS = {
  cases: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>`,
  cap:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><path d="M8 13h8M8 17h5"/></svg>`,
  admin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
  logout:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  logo:  `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="13" r="3" fill="#111827"/><rect x="8" y="5" width="8" height="1.5" rx="0.75" fill="#111827"/></svg>`,
};

const ROLE_LABELS = {
  admin:       'Адміністратор',
  pathologist: 'Патолог',
  laborant:    'Лаборант',
  registrar:   'Реєстратор',
};

// Генерує ініціали для аватара
function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// Будує sidebar
export async function renderShell(activePage) {
  const profile = await getProfile();
  if (!profile) return;

  const isAdmin = profile.role === 'admin';

  const navItems = [
    { id: 'cases', label: 'Журнал заключень', href: '/MORPHEUS-PATH/pages/cases.html', icon: 'cases', roles: ['admin','pathologist','laborant','registrar'] },
    { id: 'cap',   label: 'CAP Шаблони',      href: '/MORPHEUS-PATH/pages/cap.html',   icon: 'cap',   roles: ['admin','pathologist','laborant'] },
    { id: 'admin', label: 'Адмін панель',      href: '/MORPHEUS-PATH/pages/admin.html', icon: 'admin', roles: ['admin'] },
  ].filter(item => item.roles.includes(profile.role));

  const navHtml = navItems.map(item => `
    <a class="nav-item ${activePage === item.id ? 'active' : ''}" href="${item.href}">
      ${ICONS[item.icon]}
      ${item.label}
    </a>
  `).join('');

  const sidebarHtml = `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="sidebar-logo-mark">
          <div class="sidebar-logo-icon">${ICONS.logo}</div>
          <div>
            <div class="sidebar-logo-text">Morpheus Path</div>
            <div class="sidebar-logo-sub">LIS v1.0</div>
          </div>
        </div>
      </div>

      <nav class="sidebar-nav">
        ${navHtml}
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-avatar">${initials(profile.full_name)}</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${profile.full_name}</div>
            <div class="sidebar-user-role">${ROLE_LABELS[profile.role] || profile.role}</div>
          </div>
          <button class="btn-logout" id="btn-logout" title="Вийти">${ICONS.logout}</button>
        </div>
      </div>
    </aside>
  `;

  // Вставляємо sidebar в .app-shell
  const shell = document.querySelector('.app-shell');
  if (shell) {
    shell.insertAdjacentHTML('afterbegin', sidebarHtml);
  }

  document.getElementById('btn-logout')?.addEventListener('click', async () => {
    await logout();
  });

  return profile;
}

// Toast повідомлення
export function toast(message, type = 'success') {
  const ICONS_TOAST = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`,
    error:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  };

  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `${ICONS_TOAST[type] || ''} ${message}`;
  container.appendChild(el);

  setTimeout(() => el.remove(), 3500);
}
