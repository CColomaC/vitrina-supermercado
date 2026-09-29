# Vitrina de Exploración de Catálogo - Supermercado

Aplicación web funcional construida bajo un esquema de **desarrollo agéntico asistido por IA**, donde las decisiones de arquitectura, los límites de seguridad y las metodologías de comprobación fueron definidos y validados de forma estrictamente humana.

## 1. Bitácora del Arnés Agéntico (Dirección y Control)
Toda la implementación de código fue delegada a un agente (GitHub Copilot Chat), operando bajo las siguientes restricciones documentadas en `AGENTS.md`:
- **Instrucción de Dirección:** Se prohibió la edición manual de código por parte de humanos. La IA solo podía escribir tras la aprobación explícita de especificaciones.
- **Intervenciones y Correcciones:** Durante el desarrollo, el agente falló inicialmente al servir la interfaz visual lanzando un error `Cannot GET /`. Como dirección humana, se intervino deteniendo al agente y ordenándole explícitamente configurar el middleware de archivos estáticos (`express.static`) apuntando a la carpeta de maquetación.

## 2. Decisiones de Arquitectura y Supuestos
Para responder con coherencia y simplicidad al problema de los 4.032 productos, se optó por la siguiente arquitectura:
- **Backend (Node.js + Express):** Actúa como el único motor de procesamiento. Lee el archivo `catalog.csv` al encender y almacena los registros en la memoria RAM. Toda la búsqueda, paginación (bloques de 12) y filtrado se resuelven en el backend para evitar la sobrecarga del navegador del cliente.
- **Supuesto Crítico:** Las categorías en el CSV vienen estructuradas jerárquicamente con el delimitador ` > `. Decidimos procesar con la IA un split de texto para extraer únicamente la categoría raíz (ej. "Huevos, leche y mantequilla") para poblar los selectores del frontend, garantizando una interfaz limpia y usable.
- **Frontend (Vanilla JS):** Se despojó de datos en duro y se convirtió en una capa puramente de renderizado y captura de eventos que consume la API de Express de forma dinámica.

## 3. Instrucciones de Ejecución y Puesta en Marcha
Para replicar y comprobar el funcionamiento del sistema:
1. Clonar este repositorio.
2. Instalar las dependencias en la raíz ejecutando: `npm install`.
3. Iniciar el servidor con el comando: `node server.js`.
4. Abrir en el navegador de internet: `http://localhost:3000`.

