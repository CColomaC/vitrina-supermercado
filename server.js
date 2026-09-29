const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const app = express();
const PORT = 3000;
const PAGE_SIZE = 12;
const products = [];
const catalogPath = path.join(__dirname, 'data', 'catalog.csv');

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

function getBaseCategory(category = '') {
  return category.split(/\s*>\s*/)[0].trim();
}

app.use(express.static('mockup'));

app.get('/api/products/filters', (req, res) => {
  const categories = [...new Set(products
    .map((product) => getBaseCategory(product.category))
    .filter(Boolean))]
    .sort((first, second) => first.localeCompare(second, 'es'));
  const formats = [...new Set(products
    .map((product) => product.format)
    .filter(Boolean))]
    .sort((first, second) => first.localeCompare(second, 'es'));

  res.json({ categories, formats });
});

app.get('/api/products', (req, res) => {
  const search = typeof req.query.search === 'string'
    ? req.query.search.trim().toLocaleLowerCase('es')
    : '';
  const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
  const format = typeof req.query.format === 'string' ? req.query.format.trim() : '';
  const requestedPage = Number(req.query.page);
  const currentPage = Number.isInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;

  const filteredProducts = products.filter((product) => {
    const matchesSearch = !search
      || product.name.toLocaleLowerCase('es').includes(search);
    const matchesCategory = !category || getBaseCategory(product.category) === category;
    const matchesFormat = !format || product.format === format;

    return matchesSearch && matchesCategory && matchesFormat;
  });
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  res.json({
    products: filteredProducts.slice(startIndex, startIndex + PAGE_SIZE),
    totalProducts,
    totalPages,
    currentPage,
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  return res.json(product);
});

function loadCatalog() {
  return new Promise((resolve, reject) => {
    const parser = csv();
    const input = fs.createReadStream(catalogPath);

    parser
      .on('data', (product) => products.push(product))
      .on('end', resolve)
      .on('error', reject);

    input.on('error', reject).pipe(parser);
  });
}

loadCatalog()
  .then(() => {
    console.log(`Catálogo cargado: ${products.length} productos.`);
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al leer data/catalog.csv:', error.message);
    process.exitCode = 1;
  });