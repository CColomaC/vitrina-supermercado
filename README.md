# 🛒 Vitrina de Exploración de Catálogo - Supermercado

Aplicación web fullstack funcional para la exploración de un catálogo de más de 4.000 productos de supermercado. Este proyecto fue desarrollado bajo un estricto enfoque de **Desarrollo Agéntico Asistido por Inteligencia Artificial (IA)**, donde la dirección de arquitectura, el establecimiento de límites de seguridad y las metodologías de comprobación fueron definidos y validados de forma 100% humana.

---

## 🛠️ Stack Tecnológico Seleccionado

Se priorizaron las tecnologías más amigables, limpias, livianas y libres de capas innecesarias de abstracción, asegurando coherencia absoluta con el problema:

*   **Backend:** **Node.js** con **Express**. Permite levantar un servidor eficiente en pocos minutos.
*   **Gestión de Datos:** Librería **csv-parser** para la lectura asíncrona en memoria. Al tratarse de un catálogo plano de 4.032 productos, el archivo `catalog.csv` se carga directamente en la memoria RAM al arrancar el servidor. Esto permite consultas ultra rápidas en milisegundos sin la necesidad de instalar, configurar o sobredimensionar el proyecto con una base de datos relacional pesada.
*   **Frontend:** **Vanilla JavaScript (JS Nativo)**, **HTML5** y **CSS3**. Se reutilizó y adaptó la estructura visual del mockup provisto, despojándolo de datos estáticos y transformándolo en una capa puramente dinámica que consume la API del servidor.

---

## 🤖 Bitácora del Arnés Agéntico: Secuencia de Prompts

Para cumplir con la consigna de **no editar manualmente la implementación**, el desarrollo se estructuró a través de un canal de control con el agente de IA (**GitHub Copilot Chat**), operando en pasos pequeños y lógicos:

### Fase 1: Especificación y Límites (Dirección Humana)
*   **Prompt inicial enviado:** *"Hola Copilot. Vamos a trabajar siguiendo un arnés agéntico estricto. Por favor, lee todo mi proyecto usando `@workspace` y crea un archivo en la raíz llamado `SPECIFICATION.md` donde describas detalladamente cómo debe comportarse nuestra API de productos de supermercado."*
*   **Resultado:** Definición escrita y estricta de los tres endpoints requeridos (`GET /api/products`, `GET /api/products/:id` y `GET /api/products/filters`).

### Fase 2: Construcción del Backend
*   **Prompt de desarrollo:** *"Crea el archivo `server.js` en la raíz del proyecto. Configura un servidor Express básico que escuche en el puerto 3000. Utiliza la librería `csv-parser` para leer `data/catalog.csv` y cargar los productos en una variable en memoria cuando el servidor encienda. No crees los endpoints todavía, solo asegúrate de que el CSV se lea sin errores."*
*   **Resultado:** Servidor inicializado confirmando en consola la lectura exitosa de los 4.032 productos.

### Fase 3: Lógica de la API (Búsqueda, Filtros y Paginación)
*   **Prompt de desarrollo:** *"Modifica el archivo `server.js` para agregar los tres endpoints de nuestra API según `SPECIFICATION.md`. La paginación (bloques de 12 elementos por página), el filtrado por categoría y formato, y las búsquedas por término (insensibles a mayúsculas) deben procesarse estrictamente aquí en el backend."*
*   **Resultado:** Rutas funcionales que devuelven estructuras de datos JSON dinámicas.

### Fase 4: Conexión y Adaptación del Frontend
*   **Prompt de desarrollo:** *"Modifica el archivo `mockup/app.js` para conectarlo con nuestro backend local. Elimina el arreglo estático 'products' de ejemplo y reemplázalo por funciones que realicen consultas `fetch()` a nuestra API. Los selectores de filtros y los botones de paginación Siguiente/Anterior deben actualizar los parámetros de la URL y repoblar la grilla de productos de manera dinámica."*
*   **Resultado:** Interfaz visual del supermercado conectada al motor del servidor en tiempo real.

---

## 🔍 Registro de Auditoría y Corrección de Errores

El agente de IA no es infalible y requirió estricta supervisión humana:

1.  **El Incidente de la Pantalla en Blanco (`Cannot GET /`):** Al finalizar la Fase 4, al ingresar a `http://localhost:3000`, el navegador arrojaba un error de ruta no encontrada.
2.  **Diagnóstico Humano:** El agente implementó de forma excelente las rutas lógicas de la API, pero omitió configurar el punto de entrada para los archivos visuales de maquetación del cliente.
3.  **Instrucción de Corrección:** Detuve el flujo de la IA y le ordené explícitamente inyectar el middleware de archivos estáticos: `@workspace Modifica el archivo server.js. Asegúrate de incluir la línea app.use(express.static('mockup')); justo antes de las rutas de la API...`.
4.  **Resultado de la Validación:** Al reiniciar el servidor, la interfaz visual cargó y renderizó el catálogo perfectamente.

---

## 🚀 Instrucciones de Ejecución (Comprobación de Caja Negra)

Cualquier evaluador puede clonar este repositorio y repetir las pruebas de verificación siguiendo estos pasos:

1.  Clonar el repositorio desde GitHub.
2.  Instalar las dependencias del proyecto ejecutando en la terminal:
    ```bash
    npm install
    ```
3.  Iniciar el servidor backend:
    ```bash
    node server.js
    ```
4.  Abrir el navegador web e ingresar a: **`http://localhost:3000`**
5.  **Verificación funcional:** 
    *   Escribir *"Chocolate"* o *"Batido"* en la barra de búsqueda y validar que el contador disminuya de 4.032 a las coincidencias reales.
    *   Cambiar de página y verificar que las tarjetas se limpien y carguen un grupo de 12 elementos completamente diferentes traídos desde la API.
    *   Hacer clic sobre una tarjeta y comprobar que se despliega el modal dinámico con el detalle completo del ID consultado.
