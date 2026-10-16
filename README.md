# Destinos del Mundo

Web de una agencia de viajes con 3 páginas (inicio, destinos y contacto), hecha con **HTML, CSS, Bootstrap 5 y JavaScript**. Proyecto de la asignatura de Entornos de Desarrollo (1º DAW).

## Qué incluye

- Diseño **responsive** (móvil, tablet y escritorio) con Bootstrap 5.
- **Carrusel** de imágenes, tarjetas de destinos y **modales** con los detalles de cada oferta.
- **Filtros funcionales** en la tabla de destinos (tipo, continente y precio máximo) con contador de resultados.
- **Formularios con validación** (Bootstrap + JavaScript) para reservas y contacto.
- El botón "Reservar" abre el formulario con el **destino ya seleccionado**.
- Las reservas y los mensajes se guardan en el navegador (`localStorage`).
- Imágenes optimizadas (de ~31 MB a unos 4 MB) y carga diferida (`loading="lazy"`).

## Estructura

```
index.html       Página de inicio
destinos.html    Listado y filtros de destinos
contactos.html   Formulario de contacto
estilos.css      Estilos propios
script.js        Lógica en JavaScript
imagenes/        Imágenes
```

## Cómo ejecutarlo

Descarga el proyecto y abre `index.html` en el navegador. No necesita instalar nada.

## Mejoras futuras

- Backend en PHP y MySQL para guardar reservas y mensajes en una base de datos.
- Cargar los destinos desde la base de datos en lugar de escribirlos a mano en el HTML.
- Panel de administración para ver las reservas.

## Autor

Imran El Majjaoui
