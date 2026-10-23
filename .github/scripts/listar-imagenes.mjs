// Genera api/_imagenes.json: la lista de imágenes que existen en el sitio. El
// aviso de imágenes rotas (api/_imagen.mjs) solo acepta esas rutas, así nadie
// puede inventar nombres para gastar el cupo de mails.
//   node .github/scripts/listar-imagenes.mjs            → regenera la lista
//   node .github/scripts/listar-imagenes.mjs --revisar  → falla si está desactualizada (CI)
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const RAIZ = new URL("../..", import.meta.url).pathname;
const SALIDA = join(RAIZ, "api/_imagenes.json");
const EXT = /\.(webp|png|jpe?g|svg|avif|gif)$/i;
const IGNORAR = new Set([".git", "node_modules", ".github", ".vercel", "api", "test"]);

function recorrer(dir, out) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORAR.has(e.name)) continue;
    const ruta = join(dir, e.name);
    if (e.isDirectory()) recorrer(ruta, out);
    else if (EXT.test(e.name)) out.push("/" + relative(RAIZ, ruta).split("\\").join("/"));
  }
  return out;
}

const lista = JSON.stringify(recorrer(RAIZ, []).sort(), null, 1) + "\n";
if (process.argv.includes("--revisar")) {
  let actual = "";
  try { actual = readFileSync(SALIDA, "utf8"); } catch {}
  if (actual !== lista) {
    console.error("api/_imagenes.json está desactualizada: correr node .github/scripts/listar-imagenes.mjs");
    process.exit(1);
  }
  console.log("Lista de imágenes al día.");
} else {
  writeFileSync(SALIDA, lista);
  console.log("api/_imagenes.json actualizada.");
}
