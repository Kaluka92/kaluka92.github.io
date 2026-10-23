// Lógica pura del aviso de imágenes rotas (sin red), para poder testearla.
// Los logs de Vercel en el plan gratis duran ~30 minutos, así que cada aviso
// se manda por mail (Resend) a contacto@. Para que el endpoint público no se
// pueda usar para gastar el cupo de mails (lo comparten el formulario, GIDE y
// el CRM): solo imágenes que existen en el sitio, y la clave de idempotencia
// agrupa por día + tipo + imagen (Resend descarta los repetidos por 24 h), así
// que como mucho llega un mail por imagen y por día.

import imagenes from "./_imagenes.json" with { type: "json" };

const corto = (v, n) => String(v ?? "").replace(/[\u0000-\u001f\u007f]+/g, " ").slice(0, n);
// Solo imágenes que existen (lista generada por .github/scripts/listar-imagenes.mjs;
// el CI falla si queda desactualizada) y directivas de CSP reales: así la
// cantidad de claves distintas por día es fija y chica.
const IMAGENES = new Set(imagenes);
const DIRECTIVAS = new Set([
  "default-src", "script-src", "script-src-elem", "script-src-attr", "style-src", "style-src-elem",
  "style-src-attr", "img-src", "font-src", "connect-src", "media-src", "object-src", "frame-src",
  "child-src", "worker-src", "manifest-src", "form-action", "frame-ancestors", "base-uri",
]);

/** null si el aviso no es válido (no se manda nada). */
export function avisoDeImagen(d, navegador, hoy = new Date().toISOString().slice(0, 10)) {
  if (!d || typeof d !== "object") return null;
  const tipo = corto(d.tipo, 20);
  let clave;
  if (tipo === "imagen" || tipo === "imagen-vacia") {
    const recurso = corto(d.recurso, 130).split("?")[0];
    if (!IMAGENES.has(recurso)) return null;
    clave = `${hoy}|${tipo}|${recurso}`;
  } else if (tipo === "seguridad") {
    // Lo bloqueado puede ser cualquier cosa: se agrupa solo por directiva.
    const directiva = corto(d.detalle, 40);
    if (!DIRECTIVAS.has(directiva)) return null;
    clave = `${hoy}|seguridad|${directiva}`;
  } else {
    return null;
  }
  const datos = {
    tipo,
    recurso: corto(d.recurso, 200),
    pagina: corto(d.pagina, 100),
    detalle: corto(d.detalle, 200),
    navegador: corto(navegador, 300),
    pantalla: corto(d.pantalla, 20),
    conexion: corto(d.conexion, 40),
  };
  const texto = [
    "Un visitante del sitio no pudo cargar algo (aviso automático, sin datos personales).",
    "",
    ...Object.entries(datos).map(([k, v]) => `${k}: ${v || "—"}`),
    "",
    "Llega como mucho un mail por día y por imagen.",
  ].join("\n");
  return { clave, asunto: `[sitio] ${tipo}: ${tipo === "seguridad" ? datos.detalle : datos.recurso}`, texto, datos };
}
