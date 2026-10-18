# kaluka92.github.io — sitio de JPProyectos

> **Regla: mantener este archivo al día.** Al terminar cualquier trabajo en este
> proyecto (desde Claude Code, Cowork o Claude Desktop), agregá una entrada en la
> **Bitácora** de abajo: fecha, qué se hizo, por qué y qué quedó pendiente.

Sitio público de JPProyectos (Juan Riverón): presentación como estudio de software a medida, trabajos y productos, y la política de privacidad de Pastillero (la usa Google Play).

## Stack
- HTML y CSS a mano, sin build. GitHub Pages publica `main` en https://kaluka92.github.io/.
- Fuentes de Google Fonts: Unbounded (títulos), Instrument Sans (texto), IBM Plex Mono (etiquetas).
- Marca en `marca/` (copiada de `~/Documents/JPProyectos/marca/`): `marca-animada.svg` en el encabezado, `marca.svg` y `marca-32.png` como favicon, `marca-192.png` para iPhone, `compartir.png` (1200 × 630) para la vista previa de los enlaces.

## Estructura
- `index.html` — la página principal (servicios, trabajos y productos, cómo trabajo, datos, contacto).
- `pastillero/privacidad.html` — política de privacidad de Pastillero. Si cambia lo que hace la app con los datos, actualizarla y cambiar la fecha de vigencia.
- `google70995f6349117a4d.html` — verificación de Google Search Console. No borrar.

## Cosas a tener en cuenta
- CI (`.github/workflows/ci.yml`): revisa que los enlaces e imágenes internas existan.
- `main` = publicado: los cambios van por rama + PR y el usuario los ve antes de mergear (es público).
- El cliente del caso "alquiler de maquinaria y obras" es Marruá: no nombrarlo sin permiso.
- No publicar el teléfono sin que el usuario lo pida; el contacto público es el mail.

## Bitácora

### 2026-10-18 — Sitio nuevo con la marca de JPProyectos (Claude Code, Opus)
- **Qué:** rediseño completo de `index.html` con el logo nuevo (A3, la consola con la J), colores tinta y celeste, y secciones de servicios, trabajos y productos (caso de cliente sin nombre, Gestor UY, Pastillero), forma de trabajo, cuidado de los datos y contacto. Favicon, ícono de iPhone e imagen para compartir.
- **Política de Pastillero:** se aclaró que la app consulta a los servidores de Expo si hay actualizaciones (solo datos técnicos) y se cambió la vigencia al 18/10/2026.
- **Probado:** capturas a 1280 px y 390 px, claro y oscuro, sin desborde horizontal.
- **Pendiente:** dar de alta el sitio en Google Search Console si se quiere (el archivo de verificación ya está).
