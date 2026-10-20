# kaluka92.github.io — sitio de JPProyectos

> **Regla: mantener este archivo al día.** Al terminar cualquier trabajo en este
> proyecto (desde Claude Code, Cowork o Claude Desktop), agregá una entrada en la
> **Bitácora** de abajo: fecha, qué se hizo, por qué y qué quedó pendiente.

Sitio público de JPProyectos (Juan Riverón): presentación como estudio de software a medida, trabajos y productos, y la política de privacidad de Pastillero (la usa Google Play).

## Stack
- HTML y CSS a mano, sin build. **Vercel** (equipo `jpproyectos`, proyecto `jpproyectos-web`, conectado a este repo) publica `main` en **https://jpproyectos.com.uy/**; cada PR tiene su preview. `vercel.json`: encabezados de seguridad (CSP con `frame-ancestors 'none'`, HSTS, nosniff, Referrer y Permissions-Policy) y `www` → dominio sin www.
- Dominio `jpproyectos.com.uy`: comprado en Antel (nic.com.uy, cuenta del usuario, vence el 2027-10-18, renovar). DNS en el panel de Antel: A `@` → `216.198.79.1` y `64.29.17.1`, CNAME `www` → `cname.vercel-dns.com.` (TTL 1 h). TXT `@` `google-site-verification=…` (Search Console, propiedad de dominio: no borrar); Resend (región São Paulo): TXT `resend._domainkey` (DKIM), CNAME `send` → `send.forge.rmta.net.` y `rsend` → `rsend-sae1.forge.rmta.net.`, TXT `_dmarc` `v=DMARC1; p=none;`. Ojo: el panel de Antel dijo "ya existe" al crear `send` habiendo `rsend` y además lo había creado sin mostrarlo: revisar la lista recargada antes de reintentar y TXT `_github-pages-challenge-Kaluka92` (verificación del dominio en GitHub; inofensivo).
- `kaluka92.github.io` (GitHub Pages, rama `gh-pages`): solo páginas que redirigen a las mismas rutas en el dominio nuevo, porque Play Console y el trámite del D-U-N-S tienen esa dirección. Esa rama tiene su propio `vercel.json` con `deploymentEnabled: false`, y el de `main` también la excluye: Vercel no la publica.
- Fuentes de Google Fonts: Unbounded (títulos), Instrument Sans (texto), IBM Plex Mono (etiquetas).
- Marca en `marca/` (copiada de `~/Documents/JPProyectos/marca/`): `marca-animada.svg` en el encabezado, `marca.svg` y `marca-32.png` como favicon, `marca-192.png` para iPhone, `compartir.png` (1200 × 630) para la vista previa de los enlaces.

## Estructura
- `index.html` — la página principal (servicios, trabajos y productos, cómo trabajo, datos, contacto).
- `pastillero/privacidad.html` — política de privacidad de Pastillero. Si cambia lo que hace la app con los datos, actualizarla y cambiar la fecha de vigencia.
- `api/contacto.mjs` — **formulario de contacto** (función de Vercel): valida (`api/_contacto.mjs`, con tests en `test/`), descarta spam (campo trampa `sitio_web`, más de 3 enlaces) sin avisar, acepta solo envíos desde el sitio o sus vistas previas, y manda el mail con **Resend** desde `web@jpproyectos.com.uy` a `contacto@` (ImprovMX → Gmail) con "responder a" la persona. No guarda nada. Variables en Vercel: `RESEND_API_KEY` (clave "sitio-jpproyectos", solo envío, dominio jpproyectos.com.uy) y opcional `CONTACTO_DESTINO`. Respuestas: `gracias.html` y `contacto-error.html` (noindex).
- `google70995f6349117a4d.html` — verificación de Google Search Console. No borrar.
- `capturas/` — capturas en WebP de los trabajos (Gestor UY a 960 px, Pastillero a 480 px), con datos de ejemplo. Cómo se rehacen: Gestor UY desde el sitio público con Playwright (`/calculadoras#irpf-mensual` + botón `.ejemplo`); Pastillero exportando la app a web en una copia aparte (`expo install react-dom react-native-web @expo/metro-runtime` + `expo export -p web`, sin commitear eso) con datos sembrados en `localStorage` (claves `@pastillero/...`). Sistemas de clientes (GIDE, CRM de seguros): copia aparte del repo (`git worktree`) + Supabase local con Colima (`colima start`; `npx supabase@2 init` y `start` en una carpeta `demo/`), esquema y migraciones aplicados con `psql` dentro del contenedor, datos inventados por SQL, `devIndicators: false`, y en la copia: logo genérico, colores de acento cambiados y textos fijos con el nombre del cliente reemplazados. Revisar cada captura antes de usarla. Nunca datos reales ni de clientes.

## Cosas a tener en cuenta
- CI (`.github/workflows/ci.yml`): revisa que los enlaces e imágenes internas existan y corre `node --test test/*.test.mjs`.
- Seguridad: las páginas no tienen JavaScript (el formulario es un POST común, `form-action 'self'`); la política de seguridad está en `vercel.json` (encabezado) y repetida en un `<meta>` de cada página. Si algún día hace falta uno, ajustar esa política. El año del pie es fijo: cambiarlo cada enero.
- `sitemap.xml` y `robots.txt` para Google: al sumar una página, agregarla al sitemap.
- `main` = publicado: los cambios van por rama + PR y el usuario los ve antes de mergear (es público).
- **El repo es público:** nada de nombres de clientes, datos de contacto privados ni notas internas en este archivo ni en ningún otro. Los casos de clientes van sin nombre salvo permiso escrito.
- No publicar el teléfono sin que el usuario lo pida; el contacto público es **contacto@jpproyectos.com.uy**.
- Mail del dominio: ImprovMX (plan gratis, cuenta del usuario) reenvía `*@jpproyectos.com.uy` al Gmail del usuario. DNS en Antel: MX `@` 10 `mx1.improvmx.com.` y 20 `mx2.improvmx.com.`; TXT `@` `v=spf1 include:spf.improvmx.com include:_spf.google.com ~all`. El usuario responde desde Gmail con "Enviar como" (smtp.gmail.com con contraseña de aplicación; si la revoca, deja de poder enviar como contacto@).

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
- **Después (PR #7):** la tarjeta pasó a "Sistemas integrales a medida". La etiqueta pasó a "Software a medida · Desde Uruguay" (PR #8).

### 2026-10-19 — Descripción general (Claude Code, Opus)
- **Qué:** pedido del usuario: que la portada hable de software de cualquier tipo a medida de cada cliente, sin rubros puntuales (flota, contratos, cobranzas). Cambiaron la bajada, el texto y los puntos de "Sistemas integrales a medida" y "partes diarios" → "formularios" (PR #9). "Trabajos y productos" queda con casos concretos.
- **Plan acordado (paso a paso con el usuario):** 1) mail propio contacto@jpproyectos.com.uy, 2) "Sobre mí", 3) preguntas frecuentes, 4) capturas de los sistemas, 5) formulario de contacto, 6) medición de visitas sin cookies, 7) Gestor UY en subdominio, 8) testimonio con permiso, 9) inglés si hace falta. Revisar también las promesas de "Tus datos, cuidados" (dos pasos, prueba mensual, respuesta en horas) contra lo que tiene cada sistema.

### 2026-10-20 — Mail propio contacto@jpproyectos.com.uy (Claude Code, Opus)
- **Qué (paso 1 del plan):** el usuario creó la cuenta en ImprovMX; Claude corrigió el dominio mal cargado (`jpproyectos.com`) y cargó el primer MX en Antel; el panel de Antel se trababa (lista de dominios cargando sin fin: se arregla cerrando sesión y volviendo a entrar), así que el usuario cargó el segundo MX y el SPF. Gmail "Enviar como" configurado por el usuario; el código de verificación llegó por el reenvío (probado). La portada y la política de Pastillero usan contacto@ (PR #10).
- **Sigue:** paso 2, "Sobre mí" (faltan datos del usuario).

### 2026-10-20 — Sección "Sobre mí" (Claude Code, Opus)
- **Qué (paso 2 del plan):** sección `#sobre-mi` entre "Cómo trabajo" y "Tus datos", con enlace en el menú. Datos del usuario: desarrolla desde 2024, para clientes desde 2025; Bachillerato Tecnológico (UTU), técnico en redes, analista en seguros; experiencia en venta y atención a clientes; estilo "profesional y cercano". Sin foto por ahora (decisión del usuario). Años fijos en vez de "hace N años" para que no envejezca el texto.

### 2026-10-20 — Preguntas frecuentes (Claude Code, Opus)
- **Qué (paso 3 del plan):** sección `#preguntas` antes de Contacto, con 7 preguntas en `<details>` (sin JavaScript). El usuario dejó el contenido a criterio de Claude y lo aprueba al ver la vista previa. Alineado con el contrato de GIDE: sin precios publicados (presupuesto sin costo, precio cerrado + mensualidad), licencia de uso del sistema mientras esté vigente el servicio, datos del cliente descargables, baja con 30 días de aviso, soporte por gravedad (horas / día hábil / 1–2 días hábiles), moneda: exterior siempre en dólares, Uruguay en pesos o dólares (decisión del usuario).
- **Ojo:** si cambian las condiciones del contrato modelo, actualizar estas respuestas.

### 2026-10-20 — Capturas de los trabajos (Claude Code, Opus)
- **Qué (paso 4 del plan):** 2 capturas de Gestor UY (portada y cálculo de IRPF de ejemplo) y 2 del Pastillero (tomas de hoy y medicamentos, con una persona ficticia) dentro de sus tarjetas; cada una abre en grande. 130 KB en total, `loading="lazy"`. Además, en las preguntas frecuentes las consultas pasan a "hasta tres días hábiles", como dice el contrato.
- **GIDE (cliente):** sin capturas por ahora. El contrato (cláusula OCTAVA) deja el diseño y el código del lado del proveedor, pero la DÉCIMA obliga a reservar datos, precios, clientes y procesos del cliente. Se puede mostrar con datos inventados y sin la marca del cliente; lo prudente es sumar una cláusula de "referencia comercial" o pedir el OK por escrito antes. Decisión del usuario.

### 2026-10-20 — Capturas del sistema de gestión y tarjeta del CRM de seguros (Claude Code, Opus)
- **Qué:** pedido del usuario: capturas de GIDE (Panel y Rentabilidad) y una tarjeta nueva "CRM para una corredora de seguros" (Resumen y Pólizas), todo con datos inventados en bases locales (empresa ficticia "Andes Equipos y Obras", clientes y pólizas de ejemplo) y sin nombre, logo ni colores de los clientes. "Trabajos y productos" pasó a dos columnas (4 tarjetas). Se agregó al contrato de GIDE la autorización para mostrar pantallas con datos ficticios (cláusula DÉCIMA), todavía sin firmar.
- **Hallazgos en otros repos (no corregidos acá):** GIDE tiene "Marrua Group SAS — resumen general" fijo en `panel/page.tsx` (debería usar el nombre de la empresa); crm-web no tiene en el repo la migración 012 (`mensajes_colaborador`), así que no se puede reconstruir la base desde las migraciones.

### 2026-10-20 — Formulario de contacto (Claude Code, Opus)
- **Qué (paso 5 del plan):** formulario en `#contacto` (nombre, mail, empresa opcional, mensaje) que manda con Resend a contacto@; el mail directo queda como alternativa. Dominio verificado en Resend (cuenta del usuario, la misma del CRM; plan gratis: 3.000 mails/mes, 100/día, 3 dominios). Probado con `vercel dev`: válido sin clave → error (log "falta RESEND_API_KEY"), trampa → gracias sin enviar, mail inválido → error, otro origen → 403. Capturas a 1280 y 390 px, claro y oscuro, sin desborde (había uno de 714 px en celular: el form necesitaba `min-width: 0`).
- **Ventaja para otros sistemas:** con el dominio verificado, GIDE (mail semanal) y el CRM pueden mandar desde @jpproyectos.com.uy a cualquier destinatario.
