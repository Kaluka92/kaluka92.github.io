import { test } from "node:test";
import assert from "node:assert/strict";
import { armarMail, origenPermitido, validarContacto } from "../api/_contacto.mjs";

const bien = { nombre: "Ana Pérez", email: "ana@ejemplo.com.uy", empresa: "Taller Sur", mensaje: "Quiero ordenar las órdenes de trabajo del taller." };

test("acepta una consulta normal", () => {
  const r = validarContacto(bien);
  assert.equal(r.ok, true);
  assert.equal(r.datos.nombre, "Ana Pérez");
});

test("el campo trampa completado es spam y no se avisa", () => {
  assert.deepEqual(validarContacto({ ...bien, sitio_web: "http://spam.example" }), { spam: true });
});

test("muchos enlaces es spam", () => {
  assert.deepEqual(validarContacto({ ...bien, mensaje: "http://a.co http://b.co http://c.co http://d.co compren" }), { spam: true });
});

test("rechaza mail inválido, nombre vacío y mensaje muy corto", () => {
  assert.equal(validarContacto({ ...bien, email: "ana" }).motivo, "email");
  assert.equal(validarContacto({ ...bien, email: "a b@c.com" }).motivo, "email");
  assert.equal(validarContacto({ ...bien, nombre: "   " }).motivo, "falta-nombre");
  assert.equal(validarContacto({ ...bien, mensaje: "hola" }).motivo, "mensaje-corto");
});

test("saca saltos de línea del nombre y del mail (sin inyectar encabezados)", () => {
  const r = validarContacto({ ...bien, nombre: "Ana\r\nBcc: x@y.com", email: "ana@ejemplo.com.uy\nBcc: x@y.com" });
  assert.equal(r.ok, false); // el mail con salto queda inválido
  const r2 = validarContacto({ ...bien, nombre: "Ana\r\nBcc: x@y.com" });
  assert.equal(r2.datos.nombre, "Ana Bcc: x@y.com");
  assert.ok(!armarMail(r2.datos, "c@d.com").subject.includes("\n"));
});

test("corta los textos largos", () => {
  const r = validarContacto({ ...bien, nombre: "x".repeat(500), mensaje: "y".repeat(10_000) });
  assert.equal(r.datos.nombre.length, 100);
  assert.equal(r.datos.mensaje.length, 3000);
});

test("solo acepta envíos desde el sitio y sus vistas previas", () => {
  assert.equal(origenPermitido("https://jpproyectos.com.uy"), true);
  assert.equal(origenPermitido("https://www.jpproyectos.com.uy"), true);
  assert.equal(origenPermitido("https://jpproyectos-web-git-formulario-jpproyectos.vercel.app"), true);
  assert.equal(origenPermitido("https://otro-sitio.com"), false);
  assert.equal(origenPermitido("https://jpproyectos.com.uy.evil.com"), false);
  assert.equal(origenPermitido("http://jpproyectos.com.uy"), false);
  assert.equal(origenPermitido(null), false);
});

test("el mail sale del dominio y la respuesta va a la persona", () => {
  const m = armarMail(validarContacto(bien).datos, "contacto@jpproyectos.com.uy");
  assert.equal(m.from, "Formulario web <web@jpproyectos.com.uy>");
  assert.equal(m.reply_to, "ana@ejemplo.com.uy");
  assert.deepEqual(m.to, ["contacto@jpproyectos.com.uy"]);
  assert.match(m.text, /Empresa: Taller Sur/);
});
