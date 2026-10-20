// Formulario de contacto: recibe el POST de la portada, valida y manda el
// mensaje con Resend a contacto@ (ImprovMX lo reenvía al Gmail del usuario).
// No guarda nada. Variables en Vercel: RESEND_API_KEY y, opcional, CONTACTO_DESTINO.
import { armarMail, origenPermitido, validarContacto } from "./_contacto.mjs";

const volver = (ruta) => new Response(null, { status: 303, headers: { Location: ruta } });

export async function POST(request) {
  if (!origenPermitido(request.headers.get("origin"))) return new Response("Origen no permitido", { status: 403 });
  if (Number(request.headers.get("content-length") ?? 0) > 20_000) return volver("/contacto-error.html");

  let campos;
  try {
    campos = Object.fromEntries(await request.formData());
  } catch {
    return volver("/contacto-error.html");
  }

  const resultado = validarContacto(campos);
  if (resultado.spam) return volver("/gracias.html");
  if (!resultado.ok) return volver(`/contacto-error.html?motivo=${resultado.motivo}`);

  const clave = process.env.RESEND_API_KEY;
  if (!clave) {
    console.error("[contacto] falta RESEND_API_KEY");
    return volver("/contacto-error.html");
  }

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${clave}`, "Content-Type": "application/json" },
      body: JSON.stringify(armarMail(resultado.datos, process.env.CONTACTO_DESTINO || "contacto@jpproyectos.com.uy")),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) {
      // Sin datos de la persona en el log: solo el estado de Resend.
      console.error("[contacto] Resend respondió", r.status, (await r.text()).slice(0, 300));
      return volver("/contacto-error.html");
    }
  } catch (e) {
    console.error("[contacto] no se pudo enviar:", e?.name);
    return volver("/contacto-error.html");
  }
  return volver("/gracias.html");
}

export function GET() {
  return volver("/#contacto");
}
