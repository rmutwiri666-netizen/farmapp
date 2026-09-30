const STORAGE_KEY = 'smartFarmManagerDB';
const ADMIN_USERNAME = 'raphfarm';
const ADMIN_PASSWORD = '1Shutengai2004$';

const farmAreas = [
  {
    title: 'Livestock',
    detail: 'Cattle, goats, and poultry care',
    metric: '320 animals',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Cereals',
    detail: 'Maize and rice production fields',
    metric: '1,150 bags',
    image: 'https://images.unsplash.com/photo-1464226184884-fa52ac9c60b7?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Flowers',
    detail: 'Fresh blooms for market demand',
    metric: '240 bundles',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Vegetables',
    detail: 'Leafy greens and fresh harvest',
    metric: '980 crates',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Ocra',
    detail: 'Healthy okra production and sale',
    metric: '540 baskets',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=80'
  }
];

const defaultProducts = [
  { name: 'Livestock', icon: '🐄', description: 'Cattle, goats, poultry, and animal care planning for steady farm income.', price: 1500000 },
  { name: 'Cereals', icon: '🌾', description: 'Maize, rice, and grain production tracked from planting to market sales.', price: 1250000 },
  { name: 'Flowers', icon: '🌼', description: 'Floral crop cultivation with organized harvest and delivery management.', price: 980000 },
  { name: 'Vegetables', icon: '🥬', description: 'Fresh leafy greens and market vegetables produced for daily demand.', price: 1100000 },
  { name: 'Ocra', icon: '🫛', description: 'High-quality okra production with yield, sales, and storage performance tracking.', price: 875000 }
];

const defaultData = {
  farmName: 'Smart Farm Manager',
  products: JSON.parse(JSON.stringify(defaultProducts)),
  records: [
    { category: 'Livestock', produce: 950000, expense: 400000, profit: 500000, loss: 30000, status: 'Healthy' },
    { category: 'Cereals', produce: 1300000, expense: 260000, profit: 1000000, loss: 20000, status: 'Strong' },
    { category: 'Flowers', produce: 420000, expense: 90000, profit: 300000, loss: 15000, status: 'Stable' },
    { category: 'Vegetables', produce: 680000, expense: 150000, profit: 500000, loss: 25000, status: 'Good' },
    { category: 'Ocra', produce: 520000, expense: 120000, profit: 380000, loss: 30000, status: 'Positive' }
  ]
};

function getFarmData() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return JSON.parse(JSON.stringify(defaultData));
  }

  try {
    const parsed = JSON.parse(saved);
    if (!parsed || !Array.isArray(parsed.records)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
      return JSON.parse(JSON.stringify(defaultData));
    }
    return parsed;
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return JSON.parse(JSON.stringify(defaultData));
  }
}

function saveFarmData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function getFarmProducts() {
  const data = getFarmData();
  if (!Array.isArray(data.products) || !data.products.length) {
    data.products = JSON.parse(JSON.stringify(defaultProducts));
    saveFarmData(data);
  }
  return data.products;
}

function renderFarmCards() {
  const scene = document.getElementById('farm-scene');
  if (!scene) return;

  scene.innerHTML = '';

  farmAreas.forEach((area, index) => {
    const item = document.createElement('article');
    item.className = 'farm-scene-item';
    item.innerHTML = `
      <div class="farm-scene-image" style="background-image: url('${area.image}')"></div>
      <div class="farm-scene-content">
        <span class="farm-scene-tag">${index === 0 ? 'Active' : 'Ready'}</span>
        <h3>${area.title}</h3>
        <p>${area.detail}</p>
        <strong>${area.metric}</strong>
      </div>
    `;
    scene.appendChild(item);
  });
}

function renderProductCards() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const products = getFarmProducts();
  grid.innerHTML = products.map((product) => `
    <article class="product-card">
      <div class="icon">${product.icon || '🌿'}</div>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <strong class="product-price">${formatMoney(product.price || 0)}</strong>
    </article>
  `).join('');
}

function renderFinanceTable() {
  const tableBody = document.getElementById('finance-table-body');
  if (!tableBody) return;

  const data = getFarmData();

  tableBody.innerHTML = data.records.map((record) => `
    <tr>
      <td>${record.category}</td>
      <td>${formatMoney(record.produce)}</td>
      <td>${formatMoney(record.expense)}</td>
      <td>${formatMoney(record.profit)}</td>
      <td>${formatMoney(record.loss)}</td>
      <td><span class="status good">${record.status}</span></td>
    </tr>
  `).join('');
}

function addRecord(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);

  const record = {
    category: formData.get('category') || 'New Category',
    produce: Number(formData.get('produce')) || 0,
    expense: Number(formData.get('expense')) || 0,
    profit: Number(formData.get('profit')) || 0,
    loss: Number(formData.get('loss')) || 0,
    status: formData.get('status') || 'Healthy'
  };

  const data = getFarmData();
  data.records.push(record);
  saveFarmData(data);
  renderFinanceTable();
  form.reset();

  const statusBox = document.getElementById('record-status');
  if (statusBox) {
    statusBox.textContent = 'Farm record saved successfully.';
  }
}

function getEmptyRecord() {
  return {
    category: 'New Category',
    produce: 0,
    expense: 0,
    profit: 0,
    loss: 0,
    status: 'Healthy'
  };
}

function populateAdminEditBar() {
  const data = getFarmData();
  const select = document.getElementById('edit-record-select');
  if (!select) return;

  select.innerHTML = data.records.map((record, index) => `
    <option value="${index}">${record.category}</option>
  `).join('');

  if (data.records.length > 0) {
    const firstRecord = data.records[0];
    const categoryInput = document.getElementById('edit-category');
    const produceInput = document.getElementById('edit-produce');
    const expenseInput = document.getElementById('edit-expense');
    const profitInput = document.getElementById('edit-profit');
    const lossInput = document.getElementById('edit-loss');
    const statusInput = document.getElementById('edit-status');

    if (categoryInput) categoryInput.value = firstRecord.category || '';
    if (produceInput) produceInput.value = firstRecord.produce || 0;
    if (expenseInput) expenseInput.value = firstRecord.expense || 0;
    if (profitInput) profitInput.value = firstRecord.profit || 0;
    if (lossInput) lossInput.value = firstRecord.loss || 0;
    if (statusInput) statusInput.value = firstRecord.status || 'Healthy';
  }
}

function loadEditRecord(index) {
  const data = getFarmData();
  const record = data.records[index];
  if (!record) return;

  const categoryInput = document.getElementById('edit-category');
  const produceInput = document.getElementById('edit-produce');
  const expenseInput = document.getElementById('edit-expense');
  const profitInput = document.getElementById('edit-profit');
  const lossInput = document.getElementById('edit-loss');
  const statusInput = document.getElementById('edit-status');

  if (categoryInput) categoryInput.value = record.category || '';
  if (produceInput) produceInput.value = record.produce || 0;
  if (expenseInput) expenseInput.value = record.expense || 0;
  if (profitInput) profitInput.value = record.profit || 0;
  if (lossInput) lossInput.value = record.loss || 0;
  if (statusInput) statusInput.value = record.status || 'Healthy';
}

function handleAdminRecordEdit() {
  const data = getFarmData();
  const select = document.getElementById('edit-record-select');
  if (!select || !data.records.length) return;

  const index = Number(select.value);
  const category = document.getElementById('edit-category').value.trim() || data.records[index].category;
  const produce = Number(document.getElementById('edit-produce').value || 0);
  const expense = Number(document.getElementById('edit-expense').value || 0);
  const profit = Number(document.getElementById('edit-profit').value || 0);
  const loss = Number(document.getElementById('edit-loss').value || 0);
  const status = document.getElementById('edit-status').value;

  data.records[index] = { ...data.records[index], category, produce, expense, profit, loss, status };
  saveFarmData(data);
  renderFinanceTable();
  renderAdminDashboard();
}

function handleProductEditorSave() {
  const data = getFarmData();
  const select = document.getElementById('product-select');
  if (!select || !data.products) return;

  const index = Number(select.value);
  const productName = document.getElementById('product-name').value.trim() || data.products[index]?.name || 'New Product';
  const productIcon = document.getElementById('product-icon').value.trim() || data.products[index]?.icon || '🌿';
  const productPrice = Number(document.getElementById('product-price').value || 0);
  const productDescription = document.getElementById('product-description').value.trim() || data.products[index]?.description || 'Farm product description';

  data.products[index] = {
    ...data.products[index],
    name: productName,
    icon: productIcon,
    price: productPrice,
    description: productDescription
  };

  saveFarmData(data);
  renderProductCards();
  renderAdminDashboard();
}

function handleAddProduct() {
  const data = getFarmData();
  data.products.push({
    name: 'New Product',
    icon: '🌿',
    description: 'Fresh farm product ready for sale.',
    price: 500000
  });
  saveFarmData(data);
  renderProductCards();
  renderAdminDashboard();
}

function handleDeleteProduct() {
  const data = getFarmData();
  const select = document.getElementById('product-select');
  if (!select || !data.products.length) return;

  const index = Number(select.value);
  data.products.splice(index, 1);
  if (data.products.length === 0) {
    data.products.push({ name: 'New Product', icon: '🌿', description: 'Fresh farm product ready for sale.', price: 500000 });
  }

  saveFarmData(data);
  renderProductCards();
  renderAdminDashboard();
}

function handleAddNewRecord() {
  const data = getFarmData();
  const newRecord = getEmptyRecord();
  data.records.push(newRecord);
  saveFarmData(data);
  populateAdminEditBar();

  const select = document.getElementById('edit-record-select');
  if (select) {
    select.value = String(data.records.length - 1);
    loadEditRecord(data.records.length - 1);
  }

  renderFinanceTable();
  renderAdminDashboard();
}

function handleDeleteSelectedRecord() {
  const data = getFarmData();
  const select = document.getElementById('edit-record-select');
  if (!select || !data.records.length) return;

  const index = Number(select.value);
  data.records.splice(index, 1);

  if (data.records.length === 0) {
    data.records.push(getEmptyRecord());
  }

  saveFarmData(data);
  populateAdminEditBar();

  const nextIndex = Math.min(index, data.records.length - 1);
  const nextSelect = document.getElementById('edit-record-select');
  if (nextSelect) {
    nextSelect.value = String(nextIndex);
    loadEditRecord(nextIndex);
  }

  renderFinanceTable();
  renderAdminDashboard();
}

function renderAdminDashboard() {
  const data = getFarmData();

  const summary = data.records.reduce((totals, record) => {
    totals.produce += Number(record.produce || 0);
    totals.expense += Number(record.expense || 0);
    totals.profit += Number(record.profit || 0);
    totals.loss += Number(record.loss || 0);
    return totals;
  }, { produce: 0, expense: 0, profit: 0, loss: 0 });

  const overviewCards = document.getElementById('admin-overview-cards');
  if (overviewCards) {
    overviewCards.innerHTML = `
      <div class="kpi-card">
        <span>Total produce</span>
        <strong>${formatMoney(summary.produce)}</strong>
      </div>
      <div class="kpi-card">
        <span>Total expense</span>
        <strong>${formatMoney(summary.expense)}</strong>
      </div>
      <div class="kpi-card">
        <span>Total profit</span>
        <strong>${formatMoney(summary.profit)}</strong>
      </div>
      <div class="kpi-card">
        <span>Total loss</span>
        <strong>${formatMoney(summary.loss)}</strong>
      </div>
    `;
  }

  const activityList = document.getElementById('admin-activity-list');
  if (activityList) {
    activityList.innerHTML = data.records.slice(0, 4).map((record) => `
      <li>
        <span>${record.category}</span>
        <strong>${record.status}</strong>
      </li>
    `).join('');
  }

  const productsList = document.getElementById('admin-products-list');
  if (productsList) {
    const products = getFarmProducts();
    productsList.innerHTML = products.map((product, index) => `
      <div class="stack-row">
        <div>
          <h4>${product.name}</h4>
          <p>${product.description}</p>
        </div>
        <span class="badge ${index === 0 ? 'online' : 'ready'}">${formatMoney(product.price || 0)}</span>
      </div>
    `).join('');
  }

  const productSelect = document.getElementById('product-select');
  if (productSelect) {
    const products = getFarmProducts();
    productSelect.innerHTML = products.map((product, index) => `
      <option value="${index}">${product.name}</option>
    `).join('');

    if (products.length > 0) {
      const selectedIndex = Number(productSelect.value || 0);
      const selected = products[selectedIndex] || products[0];
      const productName = document.getElementById('product-name');
      const productIcon = document.getElementById('product-icon');
      const productPrice = document.getElementById('product-price');
      const productDescription = document.getElementById('product-description');

      if (productName) productName.value = selected.name || '';
      if (productIcon) productIcon.value = selected.icon || '';
      if (productPrice) productPrice.value = selected.price || 0;
      if (productDescription) productDescription.value = selected.description || '';
    }
  }

  const financeSummary = document.getElementById('admin-finance-summary');
  if (financeSummary) {
    financeSummary.innerHTML = `
      <div class="summary-box positive"><span>Revenue</span><strong>${formatMoney(summary.profit)}</strong></div>
      <div class="summary-box warning"><span>Operating cost</span><strong>${formatMoney(summary.expense)}</strong></div>
      <div class="summary-box danger"><span>Loss</span><strong>${formatMoney(summary.loss)}</strong></div>
    `;
  }

  const recordTable = document.getElementById('admin-record-table');
  if (recordTable) {
    recordTable.innerHTML = `
      <table>
        <thead>
          <tr><th>Section</th><th>Profit</th><th>Loss</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${data.records.map((record) => `
            <tr>
              <td>${record.category}</td>
              <td>${formatMoney(record.profit)}</td>
              <td>${formatMoney(record.loss)}</td>
              <td><span class="status good">${record.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  const userList = document.getElementById('admin-users-list');
  if (userList) {
    const users = [
      { name: 'John Kamau', role: 'Farm buyer', status: 'Active', lastLogin: 'Today', purchases: '5 orders' },
      { name: 'Mary Wanjiku', role: 'Supplier', status: 'Active', lastLogin: 'Yesterday', purchases: '3 orders' },
      { name: 'Peter Njoroge', role: 'Customer', status: 'Pending', lastLogin: '2 days ago', purchases: '1 order' },
      { name: 'Grace Akinyi', role: 'Distributor', status: 'Active', lastLogin: 'Today', purchases: '7 orders' }
    ];

    userList.innerHTML = users.map((user) => `
      <div class="stack-row">
        <div>
          <h4>${user.name}</h4>
          <p>${user.role} • ${user.purchases}</p>
        </div>
        <span class="badge ${user.status === 'Active' ? 'online' : 'ready'}">${user.status}</span>
      </div>
    `).join('');
  }

  const reportsList = document.getElementById('admin-reports-list');
  if (reportsList) {
    reportsList.innerHTML = `
      <div class="stack-row"><div><h4>Production status</h4><p>Strong output across the current farm cycle.</p></div><span class="badge online">Healthy</span></div>
      <div class="stack-row"><div><h4>Cashflow</h4><p>Profit remains ahead of expenses after current losses.</p></div><span class="badge ready">Positive</span></div>
      <div class="stack-row"><div><h4>Alerts</h4><p>No critical production issues detected.</p></div><span class="badge ready">Clear</span></div>
    `;
  }
}

function handleAdminLogin(event) {
  event.preventDefault();
  const username = document.getElementById('admin-username').value.trim();
  const password = document.getElementById('admin-password').value.trim();
  const statusBox = document.getElementById('login-status');

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const dashboard = document.getElementById('admin-dashboard');
    if (dashboard) {
      dashboard.classList.remove('hidden');
      dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (statusBox) {
      statusBox.textContent = 'Admin login successful.';
      statusBox.style.color = '#1f5c48';
    }

    renderAdminDashboard();
  } else {
    if (statusBox) {
      statusBox.textContent = 'Invalid admin username or password.';
      statusBox.style.color = '#df4c4c';
    }
  }
}

function setupAdminNavigation() {
  const navItems = document.querySelectorAll('.admin-nav-item');
  const panels = document.querySelectorAll('[data-panel-content]');

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      navItems.forEach((button) => button.classList.toggle('active', button === item));
      panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.panelContent === item.dataset.panel));
    });
  });

  const logoutButton = document.getElementById('logout-admin');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      const dashboard = document.getElementById('admin-dashboard');
      if (dashboard) {
        dashboard.classList.add('hidden');
      }

      const form = document.getElementById('admin-login-form');
      if (form) {
        form.reset();
      }

      const statusBox = document.getElementById('login-status');
      if (statusBox) {
        statusBox.textContent = '';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderFarmCards();
  renderProductCards();
  renderFinanceTable();
  renderAdminDashboard();
  setupAdminNavigation();

  const recordForm = document.getElementById('record-form');
  if (recordForm) {
    recordForm.addEventListener('submit', (event) => {
      addRecord(event);
      renderAdminDashboard();
    });
  }

  const adminForm = document.getElementById('admin-login-form');
  if (adminForm) {
    adminForm.addEventListener('submit', handleAdminLogin);
  }

  const editSelect = document.getElementById('edit-record-select');
  if (editSelect) {
    editSelect.addEventListener('change', () => {
      const data = getFarmData();
      const index = Number(editSelect.value);
      const record = data.records[index];
      if (!record) return;

      const categoryInput = document.getElementById('edit-category');
      const produceInput = document.getElementById('edit-produce');
      const expenseInput = document.getElementById('edit-expense');
      const profitInput = document.getElementById('edit-profit');
      const lossInput = document.getElementById('edit-loss');
      const statusInput = document.getElementById('edit-status');

      if (categoryInput) categoryInput.value = record.category || '';
      if (produceInput) produceInput.value = record.produce || 0;
      if (expenseInput) expenseInput.value = record.expense || 0;
      if (profitInput) profitInput.value = record.profit || 0;
      if (lossInput) lossInput.value = record.loss || 0;
      if (statusInput) statusInput.value = record.status || 'Healthy';
    });
  }

  const saveEditButton = document.getElementById('save-edit-record');
  if (saveEditButton) {
    saveEditButton.addEventListener('click', handleAdminRecordEdit);
  }

  const addNewButton = document.getElementById('add-new-record');
  if (addNewButton) {
    addNewButton.addEventListener('click', handleAddNewRecord);
  }

  const deleteButton = document.getElementById('delete-selected-record');
  if (deleteButton) {
    deleteButton.addEventListener('click', handleDeleteSelectedRecord);
  }

  const productSelect = document.getElementById('product-select');
  if (productSelect) {
    productSelect.addEventListener('change', () => {
      const data = getFarmData();
      const selected = data.products[Number(productSelect.value)];
      if (!selected) return;

      document.getElementById('product-name').value = selected.name || '';
      document.getElementById('product-icon').value = selected.icon || '';
      document.getElementById('product-price').value = selected.price || 0;
      document.getElementById('product-description').value = selected.description || '';
    });
  }

  const saveProductButton = document.getElementById('save-product-edit');
  if (saveProductButton) {
    saveProductButton.addEventListener('click', handleProductEditorSave);
  }

  const addProductButton = document.getElementById('add-product');
  if (addProductButton) {
    addProductButton.addEventListener('click', handleAddProduct);
  }

  const deleteProductButton = document.getElementById('delete-product');
  if (deleteProductButton) {
    deleteProductButton.addEventListener('click', handleDeleteProduct);
  }

  populateAdminEditBar();
});
