# Arquitectura propuesta

## Alcance de esta etapa

Implementar primero el servidor Node.js con Express para cargar y consultar `data/catalog.csv`. El frontend existente en `mockup/` queda sin cambios en esta etapa; su conexión a la API se abordará después.

## Estructura de archivos

```text
server.js                         # Arranque del servidor
src/
	app.js                          # Configuración de Express y rutas
	routes/
		products.routes.js            # Endpoints /api/products
	controllers/
		products.controller.js        # Traduce HTTP a operaciones del servicio
	services/
		catalog.service.js            # Búsqueda, filtros, paginación y detalle
	data/
		catalog.repository.js         # Lectura única del CSV y acceso a registros
data/
	catalog.csv                     # Catálogo fuente existente
mockup/                           # Se conserva intacto durante esta etapa
```

Se utilizarán Express y `csv-parser`, que ya están declarados en `package.json` y son compatibles con el proyecto CommonJS. No se requiere una base de datos ni dependencias adicionales para esta primera versión.

## Carga del catálogo

Al iniciar, `server.js` solicita al repositorio que lea el CSV mediante un stream y espere a que termine de procesarse antes de aceptar peticiones. El repositorio conserva los registros en memoria y expone su lectura al servicio. Si el archivo no existe o no se puede procesar, el inicio debe fallar con un error claro, en vez de servir un catálogo incompleto.

Los valores originales de las columnas se conservan: el servidor no genera ni completa datos de productos. El identificador se trata como texto para preservar exactamente los IDs del archivo.

## API

- `GET /api/products`: acepta `search`, `category`, `format` y `page`. La búsqueda por nombre no distingue mayúsculas de minúsculas; categoría y formato filtran por los valores del catálogo. Devuelve 12 productos por página y metadatos con el total de coincidencias y páginas. Una búsqueda sin coincidencias devuelve una lista vacía y totales en cero.
- `GET /api/products/filters`: devuelve las categorías y formatos únicos del catálogo cargado, para poblar los selectores.
- `GET /api/products/:id`: devuelve el registro completo cuyo ID coincide exactamente, o `404` si no existe.

La ruta `/filters` se registra antes de `/:id` para que Express no interprete `filters` como un identificador. Los parámetros de página inválidos se normalizan a la primera página. El controlador valida y traduce solicitudes HTTP; el servicio contiene la lógica de consulta y el repositorio se limita al acceso a los datos.

## Responsabilidades y evolución

`app.js` configura Express y monta las rutas de API; `server.js` carga los datos y abre el puerto. La API se mantiene independiente del mockup para que el frontend pueda integrarse posteriormente sin mezclar presentación y lógica de catálogo. Cuando se implemente esa integración, se podrá servir `mockup/` desde Express si resulta conveniente, sin cambiar el contrato de estos endpoints.
