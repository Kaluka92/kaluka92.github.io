// Registro de imágenes que no cargan en el navegador de algún visitante (y de
// bloqueos de la política de seguridad). Lo manda el script chico del <head> de
// cada página. Sin datos personales: ni IP ni nada que identifique a la persona;
// solo la ruta, el navegador y el tipo de conexión. Se ve en los logs de Vercel
// buscando "[imagen-rota]".
import { origenPermitido } from "./_contacto.mjs";

const corto = (v, n) => String(v ?? "").replace(/[\u0000-\u001f\u007f]+/g, " ").slice(0, n);

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
  console.warn("[imagen-rota]", JSON.stringify({
    tipo: corto(d.tipo, 20),
    recurso: corto(d.recurso, 200),
    pagina: corto(d.pagina, 100),
    detalle: corto(d.detalle, 200),
    navegador: corto(request.headers.get("user-agent"), 300),
    pantalla: corto(d.pantalla, 20),
    conexion: corto(d.conexion, 40),
  }));
  return new Response(null, { status: 204 });
}
