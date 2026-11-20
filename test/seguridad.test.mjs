// Vigila la seguridad del sitio: la huella del script en línea en la política de cada página, los encabezados,
// la redirección de www, el tamaño propio de los SVG (Firefox da 0 de ancho a los que solo traen viewBox) y security.txt.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const vercel = JSON.parse(readFileSync("vercel.json", "utf8"));
const cab = Object.fromEntries(vercel.headers.find((h) => h.source === "/(.*)").headers.map((h) => [h.key.toLowerCase(), h.value]));

function paginas(dir = ".") {
  const salida = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".git", "test", ".github", "capturas"].includes(e.name)) continue;
    const ruta = join(dir, e.name);
    if (e.isDirectory()) salida.push(...paginas(ruta));
    else if (e.name.endsWith(".html")) salida.push(ruta);
  }
  return salida;
}
const huella = (s) => "sha256-" + createHash("sha256").update(s).digest("base64");

test("el script en línea de cada página está autorizado por su huella en el encabezado y en el <meta>", () => {
  let con = 0;
  for (const p of paginas()) {
    const html = readFileSync(p, "utf8");
    for (const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
      con++;
      const h = huella(m[1]);
      assert.ok(cab["content-security-policy"].includes(`'${h}'`), `${p}: la huella ${h} no está en el encabezado de vercel.json`);
      const meta = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]*)"/);
      if (meta) assert.ok(meta[1].includes(`'${h}'`), `${p}: la huella ${h} no está en el <meta> de la página`);
    }
  }
  assert.ok(con > 0, "no se encontró ningún script en línea (¿cambió el aviso de imágenes?)");
});

test("encabezados de seguridad", () => {
  assert.match(cab["strict-transport-security"], /max-age=\d{8,}.*includeSubDomains.*preload/);
  assert.equal(cab["x-content-type-options"], "nosniff");
  assert.equal(cab["x-frame-options"], "DENY");
  assert.match(cab["content-security-policy"], /frame-ancestors 'none'/);
  assert.match(cab["content-security-policy"], /object-src 'none'/);
  assert.equal(cab["cross-origin-opener-policy"], "same-origin");
  assert.equal(cab["cross-origin-resource-policy"], "same-site");
  assert.equal(cab["x-permitted-cross-domain-policies"], "none");
  for (const f of ["camera", "microphone", "geolocation", "payment", "usb"]) assert.match(cab["permissions-policy"], new RegExp(`${f}=\\(\\)`));
});

test("www redirige a jpproyectos.com.uy también en la portada (no solo en las demás rutas)", () => {
  const reglas = vercel.redirects.filter((r) => r.has?.some((c) => c.type === "host" && c.value === "www.jpproyectos.com.uy"));
  assert.ok(reglas.some((r) => r.source === "/" && r.destination === "https://jpproyectos.com.uy/" && r.permanent), "falta la regla de la portada");
  assert.ok(reglas.some((r) => r.source === "/:path*" && r.destination === "https://jpproyectos.com.uy/:path*"), "falta la regla de las demás rutas");
});

test("los SVG tienen width y height propios (si no, Firefox da 0 de ancho y el aviso de imágenes lo toma por roto)", () => {
  for (const dir of ["marca", "seguros/logos"]) {
    for (const f of readdirSync(dir).filter((n) => n.endsWith(".svg"))) {
      const raiz = readFileSync(join(dir, f), "utf8").match(/<svg\b[^>]*>/)?.[0] ?? "";
      assert.match(raiz, /\swidth="[\d.]+(px)?"/, `${dir}/${f}: falta width`);
      assert.match(raiz, /\sheight="[\d.]+(px)?"/, `${dir}/${f}: falta height`);
    }
  }
});

test("security.txt: contacto, vencimiento lejano y dirección canónica", () => {
  const ruta = ".well-known/security.txt";
  assert.ok(existsSync(ruta), "falta .well-known/security.txt");
  const t = readFileSync(ruta, "utf8");
  assert.match(t, /^Contact: mailto:contacto@jpproyectos\.com\.uy$/m);
  assert.match(t, /^Canonical: https:\/\/jpproyectos\.com\.uy\/\.well-known\/security\.txt$/m);
  const vence = new Date(t.match(/^Expires: (.+)$/m)?.[1] ?? "");
  assert.ok(vence.getTime() > Date.now() + 60 * 86400e3, "security.txt vence en menos de 60 días: renovarlo");
});
