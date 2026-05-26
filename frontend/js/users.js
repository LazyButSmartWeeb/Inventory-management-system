/* ─────────────────────────────────────────────────────────────────
   users.js  —  User Management page logic
   Depends on: users.html, css/dashboard.css, css/users.css
───────────────────────────────────────────────────────────────── */

'use strict';

// ── Constants ────────────────────────────────────────────────────────
const ROLE_OPTIONS  = ['Administrator', 'Manager', 'Viewer'];
const avatarColors  = ['#E53935', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

// ── Mock Data ────────────────────────────────────────────────────────
let usersData = [
  { id: 1, name: 'James Donovan',   email: 'james@company.com',   role: 'Administrator', status: 'Active',   lastActive: 'Just now',    initials: 'JD' },
  { id: 2, name: 'Sarah Mitchell',  email: 'sarah@company.com',   role: 'Manager',       status: 'Active',   lastActive: '1 hr ago',    initials: 'SM' },
  { id: 3, name: 'Carlos Rivera',   email: 'carlos@company.com',  role: 'Manager',       status: 'Active',   lastActive: '3 hrs ago',   initials: 'CR' },
  { id: 4, name: 'Priya Nair',      email: 'priya@company.com',   role: 'Viewer',        status: 'Active',   lastActive: 'Yesterday',   initials: 'PN' },
  { id: 5, name: 'Tom Bergmann',    email: 'tom@company.com',     role: 'Viewer',        status: 'Inactive', lastActive: '2 weeks ago', initials: 'TB' },
  { id: 6, name: 'Aisha Okafor',    email: 'aisha@company.com',   role: 'Manager',       status: 'Active',   lastActive: '30 min ago',  initials: 'AO' },
  { id: 7, name: 'Leon Park',       email: 'leon@company.com',    role: 'Viewer',        status: 'Active',   lastActive: '5 min ago',   initials: 'LP' },
  { id: 8, name: 'Diana Ferreira',  email: 'diana@company.com',   role: 'Administrator', status: 'Inactive', lastActive: '1 month ago', initials: 'DF' },
];

// ── Helpers ──────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function generateInitials(fullName) {
  return fullName.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(index) {
  return avatarColors[index % avatarColors.length];
}

// ── Row Builder ──────────────────────────────────────────────────────
function createUserRow(user, index) {
  const avatarColor = getAvatarColor(index);
  const roleClass   = user.role.toLowerCase().replace(/\s+/g, '-');
  const statusClass = user.status.toLowerCase();

  const eyeOffIcon = `<svg class="action-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`;
  const eyeIcon    = `<svg class="action-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;

  const toggleBtn = user.status === 'Active'
    ? `<button class="btn-action btn-deactivate" aria-label="Deactivate ${escHtml(user.name)}">${eyeOffIcon} Deactivate</button>`
    : `<button class="btn-action btn-activate"   aria-label="Reactivate ${escHtml(user.name)}">${eyeIcon} Reactivate</button>`;

  return `
    <tr data-user-id="${user.id}" data-role="${escHtml(user.role)}" data-status="${escHtml(user.status)}">
      <td class="td-user">
        <div class="td-user-content">
          <div class="user-avatar" style="background-color:${avatarColor};">${escHtml(user.initials)}</div>
          <span class="td-user-name">${escHtml(user.name)}</span>
        </div>
      </td>
      <td class="td-email">${escHtml(user.email)}</td>
      <td><span class="role-badge role-${roleClass}">${escHtml(user.role)}</span></td>
      <td>
        <span class="status-badge status-${statusClass}">
          <span class="status-dot"></span>${escHtml(user.status)}
        </span>
      </td>
      <td>
        <div class="td-last-active">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          ${escHtml(user.lastActive)}
        </div>
      </td>
      <td class="td-actions">
        <div class="td-actions-content">
          <button class="btn-action btn-edit" aria-label="Edit ${escHtml(user.name)}">
            <svg class="action-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            Edit
          </button>
          ${toggleBtn}
        </div>
      </td>
    </tr>`;
}

// ── Render / Filter ──────────────────────────────────────────────────
function renderTable() {
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = usersData.map((u, i) => createUserRow(u, i)).join('');
  applyFilters();
}

function applyFilters() {
  const query        = document.getElementById('searchInput').value.toLowerCase().trim();
  const roleFilter   = document.getElementById('roleFilter').value;
  const statusFilter = document.getElementById('statusFilter').value;

  const rows = document.querySelectorAll('#usersTableBody tr:not(.empty-state-row)');
  let visible = 0;

  rows.forEach(row => {
    const name   = row.querySelector('.td-user-name').textContent.toLowerCase();
    const email  = row.querySelector('.td-email').textContent.toLowerCase();
    const role   = row.dataset.role;
    const status = row.dataset.status;

    const matchSearch = !query || name.includes(query) || email.includes(query);
    const matchRole   = roleFilter === 'All'   || role   === roleFilter;
    const matchStatus = statusFilter === 'All' || status === statusFilter;

    if (matchSearch && matchRole && matchStatus) {
      row.style.display = '';
      visible++;
    } else {
      row.style.display = 'none';
    }
  });

  toggleEmptyState(visible === 0);
  updateFooter(visible);
}

function toggleEmptyState(show) {
  let emptyRow = document.querySelector('.empty-state-row');
  if (show) {
    if (!emptyRow) {
      emptyRow = document.createElement('tr');
      emptyRow.className = 'empty-state-row';
      emptyRow.innerHTML = `
        <td colspan="6" class="empty-state-cell">
          <svg class="empty-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          No users match your search.
        </td>`;
      document.getElementById('usersTableBody').appendChild(emptyRow);
    }
    emptyRow.style.display = '';
  } else {
    if (emptyRow) emptyRow.style.display = 'none';
  }
}

function updateFooter(visibleCount) {
  if (visibleCount === undefined) {
    const rows = document.querySelectorAll('#usersTableBody tr:not(.empty-state-row):not([style*="display: none"])');
    visibleCount = rows.length;
  }
  const total  = usersData.length;
  const active = usersData.filter(u => u.status === 'Active').length;
  document.getElementById('footerText').textContent =
    `${visibleCount} of ${total} users · ${active} active`;
}

// ── Debounce helper ──────────────────────────────────────────────────
function debounce(fn, ms) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

// ── Modal ────────────────────────────────────────────────────────────
const modal       = document.getElementById('userModal');
const modalTitle  = document.getElementById('modalTitle');
const modalSub    = document.getElementById('modalSubtitle');
const modalSave   = document.getElementById('modalSaveBtn');
const inputName   = document.getElementById('inputName');
const inputEmail  = document.getElementById('inputEmail');

function openModal(mode, userData = null) {
  modal.dataset.mode = mode;

  if (mode === 'add') {
    modalTitle.textContent = 'Add New User';
    modalSub.textContent   = 'Add a new team member';
    modalSave.textContent  = 'Add User';
    delete modal.dataset.userId;
    clearModalForm();
  } else {
    modalTitle.textContent = 'Edit User';
    modalSub.textContent   = 'Update user details and permissions';
    modalSave.textContent  = 'Save Changes';
    modal.dataset.userId   = userData.id;
    populateModalForm(userData);
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Focus first input after animation
  setTimeout(() => {
    inputName.focus();
    setupFocusTrap();
  }, 50);
}

function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = '';
  delete modal.dataset.mode;
  delete modal.dataset.userId;
  clearModalForm();
}

function clearModalForm() {
  inputName.value  = '';
  inputEmail.value = '';
  inputName.classList.remove('input-error');
  inputEmail.classList.remove('input-error');

  // Reset role toggles → Administrator
  setActiveToggle(document.getElementById('roleToggleGroup'), 'Administrator');
  // Reset status toggles → Active
  setActiveToggle(document.getElementById('statusToggleGroup'), 'Active');
}

function populateModalForm(user) {
  inputName.value  = user.name;
  inputEmail.value = user.email;
  setActiveToggle(document.getElementById('roleToggleGroup'),   user.role);
  setActiveToggle(document.getElementById('statusToggleGroup'), user.status);
}

function setActiveToggle(group, value) {
  group.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === value);
  });
}

function getActiveToggleValue(groupId) {
  const active = document.querySelector(`#${groupId} .toggle-btn.active`);
  return active ? active.dataset.value : null;
}

// ── Focus Trap ───────────────────────────────────────────────────────
function setupFocusTrap() {
  const container   = modal.querySelector('.modal-container');
  const focusable   = container.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first       = focusable[0];
  const last        = focusable[focusable.length - 1];

  // Remove old listener by cloning
  const newContainer = container.cloneNode(true);
  container.parentNode.replaceChild(newContainer, container);

  // Re-query after clone
  const fc = modal.querySelector('.modal-container');
  const fq = fc.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');

  fc.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === fq[0]) {
      e.preventDefault(); fq[fq.length - 1].focus();
    } else if (!e.shiftKey && document.activeElement === fq[fq.length - 1]) {
      e.preventDefault(); fq[0].focus();
    }
  });
}

// ── Save User ────────────────────────────────────────────────────────
function saveUser() {
  const name   = inputName.value.trim();
  const email  = inputEmail.value.trim();
  const role   = getActiveToggleValue('roleToggleGroup');
  const status = getActiveToggleValue('statusToggleGroup');

  // Validate
  let hasError = false;
  if (!name || name.length < 2) {
    inputName.classList.add('input-error');
    hasError = true;
  } else {
    inputName.classList.remove('input-error');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    inputEmail.classList.add('input-error');
    hasError = true;
  } else {
    inputEmail.classList.remove('input-error');
  }

  if (hasError) return;

  if (modal.dataset.mode === 'add') {
    const initials = generateInitials(name);
    const newUser = {
      id: Math.max(0, ...usersData.map(u => u.id)) + 1,
      name, email, role, status, initials,
      lastActive: 'Just now'
    };
    usersData.push(newUser);
  } else {
    const userId = parseInt(modal.dataset.userId);
    const idx    = usersData.findIndex(u => u.id === userId);
    if (idx > -1) {
      usersData[idx] = {
        ...usersData[idx],
        name, email, role, status,
        initials: generateInitials(name)
      };
    }
  }

  closeModal();
  renderTable();
}

// ── Toggle User Status ───────────────────────────────────────────────
function toggleUserStatus(userId) {
  const user = usersData.find(u => u.id === userId);
  if (user) {
    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    renderTable();
  }
}

// ── Event Delegation (table actions) ─────────────────────────────────
document.getElementById('usersTableBody').addEventListener('click', e => {
  const editBtn   = e.target.closest('.btn-edit');
  const toggleBtn = e.target.closest('.btn-deactivate, .btn-activate');

  if (editBtn) {
    const row    = editBtn.closest('tr');
    const userId = parseInt(row.dataset.userId);
    const user   = usersData.find(u => u.id === userId);
    if (user) openModal('edit', user);
    return;
  }

  if (toggleBtn) {
    const row    = toggleBtn.closest('tr');
    const userId = parseInt(row.dataset.userId);
    toggleUserStatus(userId);
  }
});

// ── Modal Toggle (role / status) ─────────────────────────────────────
document.getElementById('roleToggleGroup').addEventListener('click', e => {
  const btn = e.target.closest('.toggle-btn');
  if (!btn) return;
  document.getElementById('roleToggleGroup').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
});

document.getElementById('statusToggleGroup').addEventListener('click', e => {
  const btn = e.target.closest('.toggle-btn');
  if (!btn) return;
  document.getElementById('statusToggleGroup').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
});

// ── Wire up controls ─────────────────────────────────────────────────
document.getElementById('addUserBtn').addEventListener('click', () => openModal('add'));
document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
document.getElementById('modalCancelBtn').addEventListener('click', closeModal);
document.getElementById('modalSaveBtn').addEventListener('click', saveUser);

// Close on backdrop click
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

// Global Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
});

// Search + filters
document.getElementById('searchInput').addEventListener('input', debounce(applyFilters, 200));
document.getElementById('roleFilter').addEventListener('change', applyFilters);
document.getElementById('statusFilter').addEventListener('change', applyFilters);

// ── Header date ──────────────────────────────────────────────────────
(function setHeaderDate() {
  const el = document.getElementById('headerDate');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
})();

// ── Toast ────────────────────────────────────────────────────────────
let toastTimer = null;

function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 6000);
}

function hideToast() {
  document.getElementById('toast').classList.remove('show');
}

document.getElementById('toastClose').addEventListener('click', hideToast);

document.getElementById('bellBtn').addEventListener('click', () => {
  showToast(document.getElementById('toastMsg').textContent || '3 low stock alerts need attention');
});

document.getElementById('alertPill').addEventListener('click', () => {
  window.location.href = 'alerts.html';
});

// ── Init ─────────────────────────────────────────────────────────────
(function init() {
  renderTable();
  // Auto-show toast after short delay
  setTimeout(() => showToast('3 low stock alerts need attention'), 800);
})();