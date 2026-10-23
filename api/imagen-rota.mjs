// Aviso de imágenes que no cargan en el navegador de algún visitante (y de
// bloqueos de la política de seguridad). Lo manda el script chico del <head> de
// cada página. Sin datos personales: ni IP ni nada que identifique a la persona;
// solo la ruta, el navegador y el tipo de conexión. Llega por mail a contacto@
// (los logs de Vercel del plan gratis duran ~30 minutos); ver api/_imagen.mjs.
import { origenPermitido } from "./_contacto.mjs";
import { avisoDeImagen } from "./_imagen.mjs";

export async function POST(request) {
  // sendBeacon manda Origin en los navegadores modernos; sin Origin, se descarta.
  if (!origenPermitido(request.headers.get("origin"))) return new Response(null, { status: 204 });
  if (Number(request.headers.get("content-length") ?? 0) > 4000) return new Response(null, { status: 204 });
  let d;
  try {
    d = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 204 });
  }
  const aviso = avisoDeImagen(d, request.headers.get("user-agent"));
  if (!aviso) return new Response(null, { status: 204 });
  console.warn("[imagen-rota]", JSON.stringify(aviso.datos));

  const clave = process.env.RESEND_API_KEY;
  if (!clave) return new Response(null, { status: 204 });
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${clave}`,
        "Content-Type": "application/json",
        // Resend descarta los pedidos con la misma clave por 24 h.
        "Idempotency-Key": aviso.clave.slice(0, 256),
      },
      body: JSON.stringify({
        from: "Sitio JPProyectos <sitio@jpproyectos.com.uy>",
        to: [process.env.CONTACTO_DESTINO || "contacto@jpproyectos.com.uy"],
        subject: aviso.asunto.slice(0, 150),
        text: aviso.texto,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok && r.status !== 409) console.error("[imagen-rota] Resend respondió", r.status);
  } catch (e) {
    console.error("[imagen-rota] no se pudo avisar:", e?.name);
  }
  return new Response(null, { status: 204 });
}
