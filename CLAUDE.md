# kaluka92.github.io — sitio de JPProyectos

> **Regla: mantener este archivo al día.** Al terminar cualquier trabajo en este
> proyecto (desde Claude Code, Cowork o Claude Desktop), agregá una entrada en la
> **Bitácora** de abajo: fecha, qué se hizo, por qué y qué quedó pendiente.

Sitio público de JPProyectos (Juan Riverón): presentación como estudio de software a medida, trabajos y productos, y la política de privacidad de Pastillero (la usa Google Play).

## Stack
- HTML y CSS a mano, sin build. **Vercel** (equipo `jpproyectos`, proyecto `jpproyectos-web`, conectado a este repo) publica `main` en **https://jpproyectos.com.uy/**; cada PR tiene su preview. `vercel.json`: encabezados de seguridad (CSP con `frame-ancestors 'none'`, HSTS, nosniff, Referrer y Permissions-Policy) y `www` → dominio sin www.
- Dominio `jpproyectos.com.uy`: comprado en Antel (nic.com.uy, cuenta del usuario, vence el 2027-10-18, renovar). DNS en el panel de Antel: A `@` → `216.198.79.1` y `64.29.17.1`, CNAME `www` → `cname.vercel-dns.com.` (TTL 1 h). TXT `@` `google-site-verification=…` (Search Console, propiedad de dominio: no borrar); Resend (región São Paulo): TXT `resend._domainkey` (DKIM), CNAME `send` → `send.forge.rmta.net.` y `rsend` → `rsend-sae1.forge.rmta.net.`, TXT `_dmarc` `v=DMARC1; p=none;`. Ojo: el panel de Antel dijo "ya existe" al crear `send` habiendo `rsend` y además lo había creado sin mostrarlo: revisar la lista recargada antes de reintentar y TXT `_github-pages-challenge-Kaluka92` (verificación del dominio en GitHub; inofensivo).
- `kaluka92.github.io` (GitHub Pages, rama `gh-pages`): solo páginas que redirigen a las mismas rutas en el dominio nuevo, porque Play Console y el trámite del D-U-N-S tienen esa dirección. Esa rama tiene su propio `vercel.json` con `deploymentEnabled: false`, y el de `main` también la excluye: Vercel no la publica.
- Fuentes de Google Fonts: Unbounded (títulos), Instrument Sans (texto), IBM Plex Mono (solo datos reales: estado de cada trabajo, pie de la captura, números de las etapas).
- Marca en `marca/` (copiada de `~/Documents/JPProyectos/marca/`): `marca-oscuro.svg` en el encabezado (la marca animada queda en el repo, sin usar: el único movimiento es el cursor del título), `marca.svg` y `marca-32.png` como favicon, `marca-192.png` para iPhone, `compartir.png` (1200 × 630) para la vista previa de los enlaces.

## Diseño
Dirección de arte (estándar de JPProyectos, aprobada por el usuario el 2026-11-02). Es el brief: cualquier cambio de la portada la respeta.
- **Para quién:** dueños de pymes e instituciones. Primero ven pruebas reales y después escriben.
- **Idea:** "obra terminada, con el cursor encendido". Manda el trabajo real; el cursor celeste al final del título es lo único que se mueve (6 parpadeos y queda fijo; sin movimiento con `prefers-reduced-motion`).
- **Color:** tinta `#0f1b2d` en las bandas (apertura, cómo trabajo, contacto y pie), papel frío `#f4f6f9`, pizarra `#4f5b6d` para texto secundario. Celeste `#4aa3df` solo para lo que se toca y el cursor; sobre papel, `#1d6ea8` para llegar a contraste AA.
- **Tipos:** ver Stack. Sin mayúsculas decorativas ni etiquetas sobre cada título.
- **Estructura:** título enorme; captura real que sale por el borde derecho y cruza de la tinta al papel; trabajos en filas alternadas; servicios en lista; etapas en una línea que no termina, porque el mantenimiento sigue; sin foto personal (decisión del usuario).
- **Evitar:** grillas de tarjetas iguales, degradés, vidrio, emojis, "soluciones innovadoras", y mezclar en la portada imágenes de banco.
- **Ojo con los textos:** las traducciones buscan el fragmento de HTML exacto, así que los estilos van por la clase del contenedor y no se tocan las etiquetas internas.

## Estructura
- `seguros/index.html` — página de Seguros (solo español): teléfonos y datos de cada compañía, a mano.
- `index.html` — la página principal en español (servicios, trabajos y productos, cómo trabajo, sobre mí, datos, preguntas, contacto).
- **Idiomas:** `en/index.html` (inglés) y `pt/index.html` (portugués de Brasil) se **generan** desde `index.html` con `python3 .github/scripts/idiomas/generar.py` y las traducciones de `.github/scripts/idiomas/textos.py`. **No editarlas a mano:** al cambiar un texto en español, corregir su par en `textos.py` y regenerar; el CI (`generar.py --revisar`) falla si falta una traducción o si están desactualizadas. Direcciones sin barra final (`/en`, `/pt`: el sitio tiene `trailingSlash: false`), `hreflang` en las tres y en `sitemap.xml`, selector ES·EN·PT arriba. El formulario manda `idioma` y la función responde con `/en/gracias.html`, `/pt/contacto-error.html`, etc. (también traducidas, a mano).
- `pastillero/privacidad.html` — política de privacidad de Pastillero. Si cambia lo que hace la app con los datos, actualizarla y cambiar la fecha de vigencia.
- `api/contacto.mjs` — **formulario de contacto** (función de Vercel): valida (`api/_contacto.mjs`, con tests en `test/`), descarta spam (campo trampa `sitio_web`, más de 3 enlaces) sin avisar, acepta solo envíos desde el sitio o sus vistas previas, y manda el mail con **Resend** desde `web@jpproyectos.com.uy` a `contacto@` (ImprovMX → Gmail) con "responder a" la persona. No guarda nada. Variables en Vercel: `RESEND_API_KEY` (clave "sitio-jpproyectos", solo envío, dominio jpproyectos.com.uy), `SEGUROS_DESTINO` (consultas de `/seguros`) y opcional `CONTACTO_DESTINO`. Respuestas: `gracias.html` y `contacto-error.html` (noindex).
- **Aviso de imágenes rotas:** un `<script>` chico escrito dentro del `<head>` de cada página (autorizado en la CSP por su huella `sha256-…`, en las páginas y en `vercel.json`) avisa a `api/imagen-rota.mjs` cuando una imagen no carga o la CSP bloquea algo, con ruta, navegador, pantalla y tipo de conexión (sin IP ni datos personales). Se ve en los logs de Vercel buscando `[imagen-rota]`. **Si se cambia una sola letra del script, hay que recalcular la huella** (`printf '%s' "<script>" | openssl dgst -sha256 -binary | openssl base64 -A`) en todas las páginas y en `vercel.json`.
- `google70995f6349117a4d.html` — verificación de Google Search Console. No borrar.
- `capturas/` — capturas en WebP de los trabajos (Gestor UY a 960 px, Pastillero a 480 px), con datos de ejemplo. Cómo se rehacen: Gestor UY desde el sitio público con Playwright (`/calculadoras#irpf-mensual` + botón `.ejemplo`); Pastillero exportando la app a web en una copia aparte (`expo install react-dom react-native-web @expo/metro-runtime` + `expo export -p web`, sin commitear eso) con datos sembrados en `localStorage` (claves `@pastillero/...`). Sistemas de clientes (GIDE, CRM de seguros): copia aparte del repo (`git worktree`) + Supabase local con Colima (`colima start`; `npx supabase@2 init` y `start` en una carpeta `demo/`), esquema y migraciones aplicados con `psql` dentro del contenedor, datos inventados por SQL, `devIndicators: false`, y en la copia: logo genérico, colores de acento cambiados y textos fijos con el nombre del cliente reemplazados. Revisar cada captura antes de usarla. Nunca datos reales ni de clientes.

## Cosas a tener en cuenta
- CI (`.github/workflows/ci.yml`): revisa que los enlaces e imágenes internas existan y corre `node --test test/*.test.mjs`.
- Seguridad: el único JavaScript es el de medición de visitas de Vercel (`/_vercel/insights/script.js`, del propio dominio: `script-src 'self'`, `connect-src 'self'`); el formulario es un POST común (`form-action 'self'`); la política de seguridad está en `vercel.json` (encabezado) y repetida en un `<meta>` de cada página. Si algún día hace falta uno, ajustar esa política. El año del pie es fijo: cambiarlo cada enero.
- **Medición de visitas:** Vercel Web Analytics (plan Hobby: 50.000 eventos/mes para todo el equipo, 30 días de historial, sin cookies; si se pasa, deja de medir, no cobra). Activada en el panel del proyecto; el script va en el `<head>` de cada página (también `gracias.html`, que cuenta los formularios enviados). Aviso en el pie de la portada.
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
- **Hallazgos en otros repos (no corregidos acá):** GIDE tiene el nombre del cliente fijo en `panel/page.tsx` (debería usar el nombre de la empresa); crm-web no tiene en el repo la migración 012 (`mensajes_colaborador`), así que no se puede reconstruir la base desde las migraciones.

### 2026-10-20 — Formulario de contacto (Claude Code, Opus)
- **Qué (paso 5 del plan):** formulario en `#contacto` (nombre, mail, empresa opcional, mensaje) que manda con Resend a contacto@; el mail directo queda como alternativa. Dominio verificado en Resend (cuenta del usuario, la misma del CRM; plan gratis: 3.000 mails/mes, 100/día, 3 dominios). Probado con `vercel dev`: válido sin clave → error (log "falta RESEND_API_KEY"), trampa → gracias sin enviar, mail inválido → error, otro origen → 403. Capturas a 1280 y 390 px, claro y oscuro, sin desborde (había uno de 714 px en celular: el form necesitaba `min-width: 0`).
- **Ventaja para otros sistemas:** con el dominio verificado, GIDE (mail semanal) y el CRM pueden mandar desde @jpproyectos.com.uy a cualquier destinatario.

### 2026-10-20 — Medición de visitas sin cookies (Claude Code, Opus)
- **Qué (paso 6 del plan):** Vercel Web Analytics gratis (Hobby) activado en `jpproyectos-web` y script en las 4 páginas; CSP abre solo `script-src`/`connect-src 'self'`. El chequeo de enlaces saltea `/_vercel/` y `/api/`. Aviso en el pie: "Las visitas se miden de forma anónima, sin cookies."
- **Decisión:** el sitio deja de ser "cero JavaScript", con un único script del propio dominio; se le explicó al usuario antes.

### 2026-10-20 — Gestor UY en gestor.jpproyectos.com.uy (Claude Code, Opus)
- **Qué (paso 7 del plan):** CNAME `gestor` en Antel → Vercel (proyecto gestor-uy, mismo equipo), y el enlace "Abrir Gestor UY" apunta al subdominio. En gestor-uy (PR #69) las URL absolutas pasan al dominio y `gestor-uy.vercel.app` redirige con 301.

### 2026-10-20 — Versiones en inglés y portugués (Claude Code, Opus)
- **Qué (paso 9 del plan, pedido del usuario: inglés y portugués):** `/en` y `/pt` generadas desde la portada en español (109 textos traducidos por Claude, portugués de Brasil), con `hreflang`, sitemap con alternativas, selector de idioma y páginas de gracias/error por idioma. En inglés/portugués la pregunta de precios dice que para el exterior es siempre en dólares (no menciona pesos) y Gestor UY aclara que es para Uruguay y en español. No se afirma en qué idiomas se hacen las reuniones (el usuario no lo dijo).
- **De paso:** el chequeo de enlaces resolvía mal las rutas que empiezan con "/" dentro de subcarpetas.
- **Pendiente:** que el usuario (o alguien nativo) revise las traducciones.

### 2026-10-20 — Aviso de imágenes rotas (Claude Code, Opus)
- **Por qué:** a una persona con Android (Redmi, Chrome) no le cargaba ninguna imagen del sitio, ni en incógnito, aunque la imagen abierta sola sí se veía; en el celular del usuario (mismo modelo) y en simulaciones de iPhone/Android todo cargaba. El servidor entrega bien (200, tipos correctos) y no hay firewall en Vercel. Sin poder reproducirlo, se mide: el aviso registra cada imagen que falla y bloqueos de la CSP, para saber si le pasa a más gente y por qué.
- **Pendiente:** revisar los logs `[imagen-rota]` en unos días; si el problema es el formato (WebP/SVG), sumar PNG/JPG de respaldo con `<picture>`.

### 2026-10-22 — Imágenes rotas: aviso por mail (Claude Code, Opus)
- **Problema:** el aviso de imágenes rotas (PR #19) solo escribía `[imagen-rota]` en los logs de Vercel, y en el plan Hobby los logs **duran ~30 minutos**: revisarlos "en unos días" no podía funcionar (el 2026-10-22 la consulta de 3 días dio "outside the available retention").
- **Arreglo:** `api/imagen-rota.mjs` manda cada aviso por mail (Resend, `sitio@jpproyectos.com.uy` → contacto@). Lógica pura en `api/_imagen.mjs` (5 tests): solo rutas de imágenes del propio sitio; los bloqueos de seguridad se agrupan por directiva; `Idempotency-Key` = día + tipo + imagen, así que llega como mucho un mail por imagen y por día y nadie puede gastar el cupo de Resend que comparten el formulario, GIDE y el CRM.
- **Pendiente:** esperar mails `[sitio] imagen: …` del Redmi que no cargaba imágenes y decidir (ej. `<picture>` con JPG de respaldo si es el formato WebP).
- **Endurecido y publicado (PR #21, 2026-10-23):** solo imágenes de `api/_imagenes.json` (generada con `node .github/scripts/listar-imagenes.mjs`; el CI corre `--revisar` y falla si se agrega una imagen sin regenerarla) y directivas CSP reales. Probado en producción: un aviso de prueba de `/marca/marca-32.png` llegó por mail a contacto@ ("[sitio] imagen: …", de `sitio@jpproyectos.com.uy`).
- **Al agregar o renombrar imágenes:** correr `node .github/scripts/listar-imagenes.mjs` antes del commit.


### 2026-10-23 — Dependabot de seguridad (Claude Code, Sonnet)
- Se agregó `.github/dependabot.yml` (solo actualizaciones de seguridad, sin PRs por cada versión nueva; esas las hace la rutina de los lunes). Motivo: la revisión de seguridad del 23/10 vio que este repo no lo tenía y una corrección de seguridad puede salir entre dos corridas de las rutinas (caso certifi en control-restos).
- Pendiente del usuario: confirmar que "Dependabot security updates" esté activado en Settings → Code security.

### 2026-11-01 — Seguimiento de la auditoría quincenal (Claude Code, Opus)
- **Contexto:** la rutina del 25/10 sí corrió (informe: https://claude.ai/artifact/KDLz5DK85PBnKfYj73pnFh). Esto es el seguimiento local de sus hallazgos, más lo que ella no podía ver (configuración de GitHub y de Vercel). Solo lectura. No corrí los tests localmente: me baso en el CI de `main`, en verde.
- **Bien:** `main` protegida, secret scanning y push protection activos, 0 alertas de secretos, sin secretos nuevos. Encabezados de producción correctos (CSP, HSTS con preload, nosniff, X-Frame-Options, Permissions-Policy).
- **Sigue pendiente:** `/api/contacto` sin límite de envíos: el Firewall de Vercel de `jpproyectos-web` no está configurado y el cupo de mails de Resend se comparte con las otras apps. El regex de origen acepta cualquier `jpproyectos-web-*.vercel.app`. Acciones sin SHA y `ci.yml` sin `permissions:`. PR #20: abierto a propósito hasta publicar la función de cuentas.

### 2026-11-01 — Origen del formulario (Claude Code, Opus)
- **`origenPermitido`:** ya no acepta cualquier `jpproyectos-web-*.vercel.app`, porque cualquiera puede crear un proyecto con ese nombre. Ahora compara con `VERCEL_URL` y `VERCEL_BRANCH_URL` del propio deploy. Con los dominios de producción no cambia nada.

### 2026-11-02 — Rediseño de la portada (Claude Code, Opus)
- **Pedido del usuario:** probar la skill `frontend-design` y el estándar de diseño rediseñando todo el sitio, con una mezcla de "obra terminada" y "consola". La dirección de arte quedó arriba, en **Diseño**.
- **Qué cambió:** portada en los 3 idiomas (mismo contenido, nuevo orden: trabajos antes que servicios) y páginas de gracias y de error. Textos nuevos: "desde Uruguay" sin punto medio, pie de la captura ("con datos de ejemplo"), "Saltar al contenido" y "Trabajos" en el menú. La política de Pastillero conserva su identidad a propósito.
- **Auditoría `design-is` (hecha a mano, sin escribir sus archivos en este repo público):** salieron y se corrigieron el borde de los campos del formulario (contraste 1,52:1), la falta de enlace para saltar al contenido y la escala de letra con tamaños de más.
- **Limpieza:** se sacó de esta bitácora un nombre de cliente que seguía escrito. Sigue en el historial de git; borrarlo de ahí requiere reescribirlo (decisión del usuario).
- **Sin probar:** envío real del formulario (no se tocaron los campos ni la función), un celular real y el Redmi que no cargaba imágenes. Las capturas son de 960 px: se ven algo blandas en pantallas de alta densidad; conviene rehacerlas al doble si se quiere mejorar.

### 2026-11-02 — Pestaña Seguros (Claude Code, Opus)
- **Pedido del usuario:** una pestaña "Seguros" con su trayectoria, logos, información, teléfonos comerciales y de siniestros y enlaces de cada compañía.
- **Qué se hizo:** página nueva `seguros/index.html` (dirección `/seguros`, solo en español porque es para clientes de Uruguay), logos en `seguros/logos/`, sitemap y revisión de enlaces. En la portada de los 3 idiomas se suma la pestaña. **Cambio de menú:** debajo de 1000 px el menú ya no se oculta: quedan a la vista Seguros y Contacto (`nav li:not(:nth-last-child(-n+2))`), porque si no la pestaña no existía en el celular.
- **Fuentes (2026-11-02):** direcciones y teléfonos centrales del [registro de empresas de seguros del BCU](https://www.bcu.gub.uy/Servicios-Financieros-SSF/Paginas/empresas_Seguros.aspx); números de siniestros del sitio de cada compañía. **Al cambiar un número, cambiar también la fecha "Revisados el" de la página.** Los logos se bajaron de los sitios oficiales y van sobre blanco también en modo oscuro.
- **RF Seguros y formulario (decisión del usuario, 2026-11-02):** `/seguros` nombra a RF Seguros, su corretaje; es la excepción a no nombrarlo en sitios públicos. El formulario de esa página manda `area=seguros` y la función envía a la casilla de la variable `SEGUROS_DESTINO` de Vercel (producción y vista previa), con asunto "Consulta de seguros". La dirección no va en el HTML ni en este repo público, y el navegador no puede elegir destino. El formulario de la portada sigue yendo a `contacto@`.
- **Confirmado por el usuario:** siniestros de Barbuss 0800 2777, 24 horas (su fuente: barbuss.com/uy); dirección y central según el BCU. "Urban Travel" es Urban Global Travel. No se pone número de registro: en Uruguay el corredor tiene un número por compañía, no uno solo.
- **Riesgo aceptado por el usuario:** se usan los logos de las compañías sin pedir autorización; si alguna objeta, se saca el suyo.
- **Formulario:** el usuario envió una prueba desde la vista previa y llegó a la casilla de RF Seguros.
- **Sin probar:** los números no se llamaron.

