// Revisa que todo enlace o imagen interna de las páginas apunte a un archivo que existe.
// Las páginas son HTML a mano: un archivo renombrado o mal escrito rompe el sitio sin aviso.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const paginas = ["index.html", "pastillero/privacidad.html", "gracias.html", "contacto-error.html", "en/index.html", "pt/index.html", "en/gracias.html", "pt/gracias.html", "en/contacto-error.html", "pt/contacto-error.html"];
let errores = 0;
for (const pagina of paginas) {
  const html = readFileSync(pagina, "utf8");
  for (const [, ruta] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(ruta)) continue;
    // Rutas que sirve Vercel, no archivos del repo: /_vercel/ (medición de visitas) y /api/ (funciones).
    if (/^\/(_vercel|api)\//.test(ruta)) continue;
    const limpia = ruta.split("#")[0].split("?")[0];
    // Las rutas que empiezan con "/" son desde la raíz del sitio; las demás, desde la carpeta de la página.
    const desde = limpia.startsWith("/") ? "." : dirname(pagina);
    const destino = join(desde, limpia.endsWith("/") || limpia === "" ? join(limpia, "index.html") : limpia);
    if (!existsSync(destino)) {
      console.error(`::error file=${pagina}::No existe ${ruta}`);
      errores++;
    }
  }
}
if (errores) process.exit(1);
console.log(`Enlaces internos en orden (${paginas.length} páginas).`);
