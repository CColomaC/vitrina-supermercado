const PRODUCTS_API = 'http://localhost:3000/api/products';
const PAGE_SIZE = 12;

const grid = document.querySelector('#product-grid');
const search = document.querySelector('#search');
const categoryFilter = document.querySelector('#category-filter');
const formatFilter = document.querySelector('#format-filter');
const resultCount = document.querySelector('#result-count');
const dialog = document.querySelector('#product-dialog');
const previousButton = document.querySelector('.pagination > button:first-child');
const nextButton = document.querySelector('.pagination > button:last-child');
const pages = document.querySelector('.pagination .pages');

let currentPage = 1;
let totalPages = 0;
let estadoForzado = null;
let activeRequest = null;
let requestNumber = 0;

const PLANTILLAS = {
  cargando: `
    <div class="inline-state">
      <span class="state-icon spinner" aria-hidden="true"></span>
      <strong>Cargando productos</strong>
      <p>Espera mientras consultamos el catálogo.</p>
    </div>`,
  vacio: `
    <div class="inline-state empty">
      <span class="state-icon" aria-hidden="true">⌕</span>
      <strong>Sin resultados</strong>
      <p>Prueba con otra búsqueda o elimina algunos filtros.</p>
      <button type="button" data-action="clear">Limpiar filtros</button>
    </div>`,
  error: `
    <div class="inline-state error">
      <span class="state-icon" aria-hidden="true">!</span>
      <strong>No pudimos cargar el catálogo</strong>
      <p>Inténtalo nuevamente en unos momentos.</p>
      <button type="button" data-action="retry">Reintentar</button>
    </div>`,
};

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function formatPrice(value, currency) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function categoryGroup(category = '') {
  return category.split(/\s*>\s*/)[0];
}

function productCard(product) {
  const id = escapeHtml(product.id);
  const name = escapeHtml(product.name);
  const category = escapeHtml(categoryGroup(product.category));
  const format = escapeHtml(product.format);
  const imageUrl = escapeHtml(product.imageUrl);

  return `
    <article class="product-card">
      <button class="card-button" type="button" data-product-id="${id}" aria-label="Ver detalle de ${name}">
        <span class="image-wrap">
          <img src="${imageUrl}" alt="" />
          <span class="card-index">#${id}</span>
        </span>
        <span class="card-copy">
          <span class="card-type">${category}</span>
          <strong>${name}</strong>
          <span class="card-meta">${format} <i aria-hidden="true">•</i> ${formatPrice(product.price, product.currency)}</span>
          <span class="view-link">Ver detalle <span aria-hidden="true">→</span></span>
        </span>
      </button>
    </article>`;
}

function updatePagination() {
  previousButton.disabled = currentPage <= 1;
  nextButton.disabled = totalPages === 0 || currentPage >= totalPages;
  pages.replaceChildren();

  const pageLabel = document.createElement('span');
  pageLabel.className = 'active';
  pageLabel.textContent = `${totalPages ? currentPage : 0} / ${totalPages}`;
  pages.setAttribute('aria-label', `Página ${totalPages ? currentPage : 0} de ${totalPages}`);
  pages.append(pageLabel);
}

function fillSelect(select, values, defaultLabel) {
  const options = [new Option(defaultLabel, '')];
  values.forEach((value) => options.push(new Option(value, value)));
  select.replaceChildren(...options);
}

async function loadFilters() {
  const response = await fetch(`${PRODUCTS_API}/filters`);
  if (!response.ok) throw new Error(`No se pudieron cargar los filtros (${response.status})`);

  const filters = await response.json();
  fillSelect(categoryFilter, filters.categories, 'Todas las categorías');
  fillSelect(formatFilter, filters.formats, 'Todos los formatos');
}

async function renderProducts() {
  const thisRequest = ++requestNumber;
  if (activeRequest) activeRequest.abort();

  if (estadoForzado) {
    grid.innerHTML = PLANTILLAS[estadoForzado];
    resultCount.textContent = `Referencia de estado: ${estadoForzado}`;
    return;
  }

  activeRequest = new AbortController();
  grid.innerHTML = PLANTILLAS.cargando;
  resultCount.textContent = 'Cargando productos';

  const parameters = new URLSearchParams({
    search: search.value.trim(),
    category: categoryFilter.value,
    format: formatFilter.value,
    page: String(currentPage),
  });

  try {
    const response = await fetch(`${PRODUCTS_API}?${parameters}`, {
      signal: activeRequest.signal,
    });
    if (!response.ok) throw new Error(`No se pudieron cargar los productos (${response.status})`);

    const data = await response.json();
    if (thisRequest !== requestNumber) return;

    currentPage = data.currentPage;
    totalPages = data.totalPages;
    grid.innerHTML = data.products.length
      ? data.products.map(productCard).join('')
      : PLANTILLAS.vacio;

    const firstProduct = data.totalProducts ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
    const lastProduct = Math.min(currentPage * PAGE_SIZE, data.totalProducts);
    resultCount.textContent = `Mostrando ${firstProduct}-${lastProduct} de ${data.totalProducts} productos · Página ${currentPage} de ${totalPages}`;
    updatePagination();
  } catch (error) {
    if (error.name === 'AbortError' || thisRequest !== requestNumber) return;
    console.error('Error al consultar el catálogo:', error);
    grid.innerHTML = PLANTILLAS.error;
    resultCount.textContent = 'Error al cargar los productos';
    totalPages = 0;
    updatePagination();
  }
}

async function openDetail(productId) {
  try {
    const response = await fetch(`${PRODUCTS_API}/${encodeURIComponent(productId)}`);
    if (!response.ok) throw new Error(`No se pudo cargar el producto (${response.status})`);

    const product = await response.json();
    document.querySelector('#detail-id').textContent = `PRODUCTO #${product.id}`;
    document.querySelector('#detail-title').textContent = product.name;
    document.querySelector('#detail-description').textContent = product.description;

    const image = document.querySelector('#detail-image');
    image.src = product.imageUrl;
    image.alt = product.name;

    const values = [
      ['Categoría', product.category],
      ['Formato', product.format],
      ['Unidad de precio', product.priceUnit],
      ['Identificador', product.id],
    ];
    const detailList = document.querySelector('#detail-list');
    detailList.replaceChildren(...values.map(([label, value]) => {
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = label;
      description.textContent = value;
      row.append(term, description);
      return row;
    }));

    document.querySelector('#detail-price').textContent = formatPrice(product.price, product.currency);
    document.querySelector('#detail-currency').textContent = `Moneda: ${product.currency}`;
    document.querySelector('#detail-original-price').textContent = `Precio original: ${formatPrice(product.originalPrice, product.currency)}`;
    document.querySelector('#detail-extracted-at').textContent = `Datos extraídos: ${product.extractedAt}`;
    document.querySelector('#detail-source').href = product.productUrl;
    dialog.showModal();
  } catch (error) {
    console.error('Error al consultar el detalle del producto:', error);
    resultCount.textContent = 'No se pudo cargar el detalle del producto';
  }
}

grid.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-action]');
  if (actionButton?.dataset.action === 'clear') {
    search.value = '';
    categoryFilter.value = '';
    formatFilter.value = '';
    currentPage = 1;
    renderProducts();
    return;
  }
  if (actionButton?.dataset.action === 'retry') {
    renderProducts();
    return;
  }

  const productButton = event.target.closest('[data-product-id]');
  if (productButton) openDetail(productButton.dataset.productId);
});

document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

search.addEventListener('input', () => {
  currentPage = 1;
  renderProducts();
});
[categoryFilter, formatFilter].forEach((control) => control.addEventListener('change', () => {
  currentPage = 1;
  renderProducts();
}));

previousButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage -= 1;
    renderProducts();
  }
});
nextButton.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage += 1;
    renderProducts();
  }
});

document.querySelectorAll('.state-switch-buttons button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.state-switch-buttons button').forEach((item) => item.classList.remove('on'));
    button.classList.add('on');
    estadoForzado = button.dataset.state === 'normal' ? null : button.dataset.state;
    renderProducts();
  });
});

async function initializeCatalog() {
  try {
    await loadFilters();
  } catch (error) {
    console.error('Error al cargar los filtros del catálogo:', error);
  }
  renderProducts();
}

initializeCatalog();