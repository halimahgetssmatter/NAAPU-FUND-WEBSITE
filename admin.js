const storageKey = 'naapu-admin-items';
const correctPassword = 'naapu2026';

const form = document.getElementById('item-form');
const fileInput = document.getElementById('fileInput');
const itemList = document.getElementById('item-list');
const statusMessage = document.getElementById('status-message');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const adminLogin = document.getElementById('admin-login');
const adminContent = document.getElementById('admin-content');

function showAdminContent() {
  adminLogin.style.display = 'none';
  adminContent.style.display = 'block';
}

function showAdminLogin() {
  adminLogin.style.display = 'block';
  adminContent.style.display = 'none';
}

function getItems() {
  const saved = localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) : [];
}

function saveItems(items) {
  localStorage.setItem(storageKey, JSON.stringify(items));
  window.dispatchEvent(new Event('naapu-items-updated'));
}

function renderItems() {
  const items = getItems();

  if (!items.length) {
    itemList.innerHTML = '<p class="empty-state">No items yet. Add your first document or picture above.</p>';
    return;
  }

  itemList.innerHTML = items.map((item, index) => {
    const preview = item.type === 'picture'
      ? `<img src="${item.dataUrl}" alt="${item.title}">`
      : `<div class="file-badge"><i class="fas fa-file-alt"></i> ${item.fileName}</div>`;

    return `
      <article class="admin-item">
        <div class="admin-item-preview">${preview}</div>
        <div class="admin-item-content">
          <h3>${item.title}</h3>
          <p><strong>Type:</strong> ${item.type}</p>
          <p>${item.notes || 'No notes added.'}</p>
          <div class="admin-item-actions">
            <a href="${item.dataUrl}" target="_blank" rel="noopener" class="btn btn-outline">Open</a>
            <button class="btn" data-index="${index}" data-action="delete">Delete</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

loginForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const password = document.getElementById('admin-password').value;
  if (password === correctPassword) {
    showAdminContent();
    loginError.textContent = '';
  } else {
    loginError.textContent = 'Incorrect password. Please try again.';
  }
});

showAdminLogin();

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const title = document.getElementById('title').value.trim();
  const type = document.getElementById('type').value;
  const notes = document.getElementById('notes').value.trim();
  const file = fileInput.files[0];

  if (!title || !file) {
    statusMessage.textContent = 'Please enter a title and choose a file.';
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const items = getItems();
    items.unshift({
      title,
      type,
      notes,
      fileName: file.name,
      dataUrl: reader.result
    });

    saveItems(items);
    form.reset();
    statusMessage.textContent = 'Item saved successfully.';
    renderItems();
  };

  reader.readAsDataURL(file);
});

itemList.addEventListener('click', function (event) {
  const button = event.target.closest('button[data-action="delete"]');
  if (!button) return;

  const index = Number(button.getAttribute('data-index'));
  const items = getItems();
  items.splice(index, 1);
  saveItems(items);
  renderItems();
  statusMessage.textContent = 'Item removed.';
});

renderItems();
