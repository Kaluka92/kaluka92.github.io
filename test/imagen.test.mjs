import { test } from "node:test";
import assert from "node:assert/strict";
import { avisoDeImagen } from "../api/_imagen.mjs";

const UA = "Mozilla/5.0 (Linux; Android 14; Redmi Note 13) Chrome/141";

test("una imagen del sitio que no carga genera un aviso agrupado por día e imagen", () => {
  const a = avisoDeImagen({ tipo: "imagen", recurso: "/capturas/gestion-panel.webp", pagina: "/", conexion: "4g" }, UA, "2026-10-22");
  assert.equal(a.clave, "2026-10-22|imagen|/capturas/gestion-panel.webp");
  assert.match(a.asunto, /gestion-panel\.webp/);
  assert.match(a.texto, /Redmi Note 13/);
});

test("el mismo aviso con otro navegador cae en la misma clave (no gasta más mails)", () => {
  const a = avisoDeImagen({ tipo: "imagen", recurso: "/marca/marca.svg" }, "uno", "2026-10-22");
  const b = avisoDeImagen({ tipo: "imagen", recurso: "/marca/marca.svg?v=2" }, "otro", "2026-10-22");
  assert.equal(a.clave, b.clave);
});

test("rechaza rutas que no son imágenes del sitio", () => {
  for (const recurso of ["https://otro.com/x.png", "/capturas/x.exe", "/../secreto.png", "", "/capturas/inventada-123.webp", "/a".repeat(80) + ".png"]) {
    assert.equal(avisoDeImagen({ tipo: "imagen", recurso }, UA), null, recurso);
  }
});

test("los bloqueos de seguridad se agrupan solo por directiva", () => {
  const a = avisoDeImagen({ tipo: "seguridad", recurso: "https://cualquiera.example/x.js", detalle: "script-src-elem" }, UA, "2026-10-22");
  const b = avisoDeImagen({ tipo: "seguridad", recurso: "https://otro.example/y.js", detalle: "script-src-elem" }, UA, "2026-10-22");
  assert.equal(a.clave, b.clave);
  assert.equal(avisoDeImagen({ tipo: "seguridad", detalle: "<script>" }, UA), null);
  assert.equal(avisoDeImagen({ tipo: "seguridad", detalle: "directiva-inventada" }, UA), null);
});

test("tipos desconocidos o datos rotos no generan aviso", () => {
  assert.equal(avisoDeImagen({ tipo: "otra-cosa", recurso: "/a.png" }, UA), null);
  assert.equal(avisoDeImagen(null, UA), null);
});
