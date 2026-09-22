import { NextResponse } from "next/server";

const API_KEY = process.env.BRANDFETCH_API_KEY || "";

// GET: Buscar marcas por nombre
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Falta el parámetro de búsqueda" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.brandfetch.io/v2/search/${encodeURIComponent(q)}`, {
      headers: {
        "Authorization": API_KEY,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Error de Brandfetch" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en búsqueda:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// POST: Descargar imagen y convertirla a Base64 para guardarla localmente (evitando CORS)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "Falta la URL de la imagen" }, { status: 400 });
    }

    const imgRes = await fetch(url);
    if (!imgRes.ok) throw new Error("Error bajando imagen");

    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Asumimos webp/png de brandfetch
    const contentType = imgRes.headers.get("content-type") || "image/png";
    const base64 = `data:${contentType};base64,${buffer.toString('base64')}`;

    return NextResponse.json({ base64 });
  } catch (error) {
    console.error("Error en proxy de imagen:", error);
    return NextResponse.json({ error: "No se pudo descargar la imagen" }, { status: 500 });
  }
}
