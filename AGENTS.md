# Instrucciones del arnés agéntico

Estas reglas orientan el trabajo de agentes de IA en este repositorio. La persona usuaria conserva el control del alcance y la aprobación de cambios.

## Reglas de control

- Antes de programar, leer `package.json` y `server.js`. Leer también el archivo objetivo y el contexto inmediato que determine el comportamiento solicitado.
- Partir de un archivo, símbolo o comportamiento concreto. Formular una hipótesis local comprobable y elegir una validación breve antes de editar.
- Avanzar en pasos pequeños: cambiar solo lo necesario para el comportamiento pedido, respetar las convenciones existentes y no mezclar refactorizaciones ajenas.
- Después de cada edición, ejecutar primero la validación más específica disponible. Si falla, corregir ese mismo cambio y repetirla antes de ampliar el trabajo.
- No inventar datos de productos ni cambiar el contenido fuente de `data/catalog.csv` como efecto secundario.
- Mantener CommonJS y las dependencias ya declaradas en `package.json`. Consultar antes de añadir dependencias, alterar contratos de API o ampliar el alcance solicitado.
- Informar con claridad de las comprobaciones realizadas y de cualquier validación que no se haya podido ejecutar.

## Límites humanos sobre la IA

- Las instrucciones explícitas de la persona usuaria definen el alcance. No extender cambios a otras capas, archivos o funcionalidades sin autorización.
- No realizar commits, pushes, eliminaciones de datos ni otras operaciones destructivas sin una petición explícita.
- No modificar el frontend, el catálogo ni la estructura pública de la API cuando la tarea no lo requiera.
- Si una instrucción es ambigua y puede cambiar datos, alcance, dependencias o comportamiento visible, pedir aclaración antes de decidir por la persona usuaria.
- Tratar el catálogo como fuente de datos: conservar sus valores originales y representar fielmente lo que responde el backend.

## Referencia del proyecto

- El servidor usa Node.js CommonJS, Express y `csv-parser`.
- `server.js` carga `data/catalog.csv`, sirve `mockup/` y expone la API en `http://localhost:3000`.
- `GET /api/products` acepta `search`, `category`, `format` y `page`; su respuesta contiene `products`, `totalProducts`, `totalPages` y `currentPage`, con un máximo de 12 productos por página.
- `GET /api/products/filters` entrega categorías base y formatos únicos; `GET /api/products/:id` entrega el producto exacto o un `404`.

## Checklist de caja negra en navegador

1. Iniciar el servidor con `node server.js` y abrir `http://localhost:3000/`. Confirmar que aparece la vitrina y que cargan sus estilos.
2. En las herramientas de desarrollo del navegador, revisar que `GET /api/products/filters` responde `200` con arreglos de categorías y formatos, y que ambos selectores se llenan desde esa respuesta.
3. Buscar `Batido` en la interfaz. Confirmar que se solicita `/api/products?search=Batido...`, que la grilla cambia según la respuesta y que cada resultado coincide con un producto devuelto por el backend. Repetir con `batido` para comprobar que la búsqueda no distingue mayúsculas.
4. Revisar el JSON de `GET /api/products`: debe incluir `products`, `totalProducts`, `totalPages` y `currentPage`. La lista contiene hasta 12 productos; debe contener exactamente 12 cuando hay al menos 12 coincidencias en esa página. Para verificar una página completa, probar también `/api/products?page=1` sin filtros.
5. Pulsar Siguiente y Anterior. Confirmar que cambia `page` en la petición, que `currentPage` se actualiza y que cada página muestra los productos recibidos para ella.
6. Aplicar categoría y formato. Confirmar que la petición incluye ambos valores, que los productos cumplen los filtros y que una nueva búsqueda o filtro vuelve a la página 1.
7. Abrir una tarjeta. Confirmar que se consulta `/api/products/:id` y que el modal muestra los campos recibidos del producto. Una petición con un ID inexistente debe responder `404`.
8. Probar una búsqueda sin coincidencias y una API detenida: la vitrina debe mostrar respectivamente los estados de “Sin resultados” y “Error”, sin presentar productos de ejemplo como si fueran datos reales.
