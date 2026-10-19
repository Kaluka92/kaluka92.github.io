# kaluka92.github.io — sitio de JPProyectos

> **Regla: mantener este archivo al día.** Al terminar cualquier trabajo en este
> proyecto (desde Claude Code, Cowork o Claude Desktop), agregá una entrada en la
> **Bitácora** de abajo: fecha, qué se hizo, por qué y qué quedó pendiente.

Sitio público de JPProyectos (Juan Riverón): presentación como estudio de software a medida, trabajos y productos, y la política de privacidad de Pastillero (la usa Google Play).

## Stack
- HTML y CSS a mano, sin build. **Vercel** (equipo `jpproyectos`, proyecto `jpproyectos-web`, conectado a este repo) publica `main` en **https://jpproyectos.com.uy/**; cada PR tiene su preview. `vercel.json`: encabezados de seguridad (CSP con `frame-ancestors 'none'`, HSTS, nosniff, Referrer y Permissions-Policy) y `www` → dominio sin www.
- Dominio `jpproyectos.com.uy`: comprado en Antel (nic.com.uy, cuenta del usuario, vence el 2027-10-18, renovar). DNS en el panel de Antel: A `@` → `216.198.79.1` y `64.29.17.1`, CNAME `www` → `cname.vercel-dns.com.` (TTL 1 h). TXT `@` `google-site-verification=…` (Search Console, propiedad de dominio: no borrar) y TXT `_github-pages-challenge-Kaluka92` (verificación del dominio en GitHub; inofensivo).
- `kaluka92.github.io` (GitHub Pages, rama `gh-pages`): solo páginas que redirigen a las mismas rutas en el dominio nuevo, porque Play Console y el trámite del D-U-N-S tienen esa dirección. Esa rama tiene su propio `vercel.json` con `deploymentEnabled: false`, y el de `main` también la excluye: Vercel no la publica.
- Fuentes de Google Fonts: Unbounded (títulos), Instrument Sans (texto), IBM Plex Mono (etiquetas).
- Marca en `marca/` (copiada de `~/Documents/JPProyectos/marca/`): `marca-animada.svg` en el encabezado, `marca.svg` y `marca-32.png` como favicon, `marca-192.png` para iPhone, `compartir.png` (1200 × 630) para la vista previa de los enlaces.

## Estructura
- `index.html` — la página principal (servicios, trabajos y productos, cómo trabajo, datos, contacto).
- `pastillero/privacidad.html` — política de privacidad de Pastillero. Si cambia lo que hace la app con los datos, actualizarla y cambiar la fecha de vigencia.
- `google70995f6349117a4d.html` — verificación de Google Search Console. No borrar.

## Cosas a tener en cuenta
- CI (`.github/workflows/ci.yml`): revisa que los enlaces e imágenes internas existan.
- Seguridad: las páginas no tienen JavaScript; la política de seguridad está en `vercel.json` (encabezado) y repetida en un `<meta>` de cada página. Si algún día hace falta uno, ajustar esa política. El año del pie es fijo: cambiarlo cada enero.
- `sitemap.xml` y `robots.txt` para Google: al sumar una página, agregarla al sitemap.
- `main` = publicado: los cambios van por rama + PR y el usuario los ve antes de mergear (es público).
- **El repo es público:** nada de nombres de clientes, datos de contacto privados ni notas internas en este archivo ni en ningún otro. Los casos de clientes van sin nombre salvo permiso escrito.
- No publicar el teléfono sin que el usuario lo pida; el contacto público es el mail.

## Bitácora

### 2026-10-18 — Sitio nuevo con la marca de JPProyectos (Claude Code, Opus)
- **Qué:** rediseño completo de `index.html` con el logo nuevo (A3, la consola con la J), colores tinta y celeste, y secciones de servicios, trabajos y productos (caso de cliente sin nombre, Gestor UY, Pastillero), forma de trabajo, cuidado de los datos y contacto. Favicon, ícono de iPhone e imagen para compartir.
- **Política de Pastillero:** se aclaró que la app consulta a los servidores de Expo si hay actualizaciones (solo datos técnicos) y se cambió la vigencia al 18/10/2026.
- **Probado:** capturas a 1280 px y 390 px, claro y oscuro, sin desborde horizontal.
- **Publicado** el 2026-10-18 (PR #1) con el OK del usuario: contacto solo por mail, sin WhatsApp (decisión del usuario). Se sumó un CI que revisa los enlaces internos (el control de merges pide checks en verde). Verificado en vivo: portada, imagen para compartir, logo y política nueva.
- Search Console: hecho (ver la entrada siguiente).

### 2026-10-18 — Seguridad, empresas grandes y Google (Claude Code, Opus)
- **Servicios:** cuarta tarjeta "Empresas grandes e instituciones" (instalación en sus servidores, ingreso con usuarios de la institución, auditoría), pedido del usuario para dejar esa puerta abierta sin nombrar trabajos honorarios.
- **Seguridad:** sin JavaScript en las páginas (el año del pie quedó fijo) y política de seguridad por `<meta>` que prohíbe scripts, formularios y conexiones; `referrer` estricto. Probado: sin errores en consola y las fuentes cargan. GitHub Pages ya daba HTTPS obligatorio y HSTS.
- **Repo público:** se sacó de este archivo el nombre del cliente que se había anotado en el PR #1 (sigue en el historial de git de ese commit; borrarlo de ahí requiere reescribir el historial, decisión del usuario).
- **Google:** `sitemap.xml` y `robots.txt`. El sitio ya estaba dado de alta en Search Console; el 2026-10-18 se envió el sitemap y se pidió reindexar la portada.

### 2026-10-18 — Dominio propio jpproyectos.com.uy (Claude Code, Opus)
- **Qué:** el usuario compró `jpproyectos.com.uy` en Antel ($ 948/año). El sitio se mudó de GitHub Pages a **Vercel** (pedido del usuario: todo en un lugar y encabezados de seguridad que Pages no permite). Claude cargó el DNS en el panel de Antel con el Chrome del usuario y pasó las direcciones al dominio: dirección canónica, imagen para compartir, `sitemap.xml` y `robots.txt` con la dirección nueva.
- **Ojo:** el registro público de Antel (whois) muestra nombre, dirección, teléfono y mail del titular.

### 2026-10-18 — Textos de la portada (Claude Code, Opus)
- **Qué:** pedido del usuario: título "Sistemas integrales hechos a medida de tu empresa", bajada abierta a empresas de Uruguay y del exterior, "Un único responsable", "Reemplaza", "Android y iPhone", "la persona que cuidás", "Copias cifradas diarias" y nombre completo de la Ley 18.331. La descripción para Google y para compartir también pasó a "Uruguay y del exterior" (PR #6).
- **Quedó igual:** la tarjeta "Sistemas de gestión a medida" y la etiqueta "Software a medida · Uruguay"; se le ofreció cambiarlas al usuario.
