// Validación del formulario de contacto. Archivo con "_": Vercel no lo publica
// como función; lo usa api/contacto.mjs y lo prueban los tests.

export const LIMITES = { nombre: 100, email: 200, empresa: 120, mensaje: 3000 };

const EMAIL = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/;

// Sin saltos de línea ni caracteres de control: lo que va al asunto o a los
// encabezados del mail no puede inyectar otros encabezados.
function limpiarLinea(v, max) {
  return String(v ?? "").replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

function limpiarTexto(v, max) {
  return String(v ?? "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "").trim().slice(0, max);
}

/**
 * Valida lo que llega del formulario.
 * Devuelve { ok: true, datos } | { ok: false, motivo } | { spam: true }.
 * El spam no se le avisa a quien lo manda: se responde como si hubiera salido.
 */
export function validarContacto(campos) {
  // Campo trampa: invisible para las personas, los robots lo completan.
  if (String(campos.sitio_web ?? "").trim() !== "") return { spam: true };

  const datos = {
    nombre: limpiarLinea(campos.nombre, LIMITES.nombre),
    email: limpiarLinea(campos.email, LIMITES.email),
    empresa: limpiarLinea(campos.empresa, LIMITES.empresa),
    mensaje: limpiarTexto(campos.mensaje, LIMITES.mensaje),
  };

  if (!datos.nombre) return { ok: false, motivo: "falta-nombre" };
  if (!EMAIL.test(datos.email)) return { ok: false, motivo: "email" };
  if (datos.mensaje.length < 10) return { ok: false, motivo: "mensaje-corto" };

  // Muchos enlaces en una consulta de dos líneas = publicidad.
  const enlaces = (datos.mensaje.match(/https?:\/\/|www\./gi) ?? []).length;
  if (enlaces > 3) return { spam: true };

  return { ok: true, datos };
}

/** Solo se aceptan envíos desde el propio sitio (o sus vistas previas de Vercel). */
export function origenPermitido(origen) {
  if (!origen) return false;
  try {
    const { protocol, hostname } = new URL(origen);
    if (protocol !== "https:") return hostname === "localhost";
    return hostname === "jpproyectos.com.uy" || hostname === "www.jpproyectos.com.uy" || /^jpproyectos-web-[a-z0-9-]+\.vercel\.app$/.test(hostname);
  } catch {
    return false;
  }
}

export function armarMail(datos, destino) {
  const empresa = datos.empresa ? `\nEmpresa: ${datos.empresa}` : "";
  return {
    from: "Formulario web <web@jpproyectos.com.uy>",
    to: [destino],
    reply_to: datos.email,
    subject: `Consulta web: ${datos.nombre}${datos.empresa ? ` (${datos.empresa})` : ""}`,
    text: `Nombre: ${datos.nombre}\nMail: ${datos.email}${empresa}\n\n${datos.mensaje}\n\n—\nEnviado desde el formulario de https://jpproyectos.com.uy. Respondé este mail para contestarle.`,
  };
}
