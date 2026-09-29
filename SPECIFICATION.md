# Especificación de Comportamiento del Sistema

Asume el rol de un Ingeniero de Software Experto. Vamos a construir una aplicación web para explorar un catálogo de supermercado de 4.032 productos basado en un archivo CSV.

## Comportamientos Requeridos

### Backend (Node.js + Express)
1. Cargar en memoria el archivo `data/catalog.csv` al iniciar la aplicación.
2. Implementar los siguientes endpoints mínimos:
   - `GET /api/products`: Debe resolver búsqueda por nombre (case-insensitive), filtrado por categoría o formato, y paginación de 12 productos por página de manera eficiente. Debe retornar el subconjunto de productos, el total de coincidencias y el número de páginas.
   - `GET /api/products/:id`: Retornar la información exacta del producto sin inventar datos.
   - `GET /api/products/filters`: Procesar el catálogo completo y extraer las listas únicas de categorías base y formatos disponibles para llenar los selectores del frontend.

### Frontend (HTML/CSS/JS Nativo)
1. Adaptar `mockup/index.html` para conectarse dinámicamente a la API.
2. Mostrar los estados de: "Cargando" mientras se espera la API, "Sin resultados" si las búsquedas fallan, y "Error" si el servidor no responde.
3. Resolver la navegación de paginación (Siguiente/Anterior).
4. Al hacer clic en una tarjeta de producto, abrir un modal con el detalle completo consultando `/api/products/:id`.

Por favor, confirma que comprendes esta especificación y propón la estructura de archivos ideal (Arquitectura) antes de escribir la primera línea de código.
