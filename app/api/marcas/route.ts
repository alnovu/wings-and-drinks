import { NextResponse } from "next/server";

export async function GET() {
  // Simulamos un retraso de red
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // En el futuro, esto podría venir de una base de datos o de un servicio externo
  const extraMarcas = [
    { id: "wendys", nombre: "Wendy's", logoUrl: "/marcas/wendys.png", isLocal: false },
    { id: "tacobell", nombre: "Taco Bell", logoUrl: "/marcas/tacobell.png", isLocal: false },
    { id: "kelloggs", nombre: "Kellogg's", logoUrl: "/marcas/kelloggs.png", isLocal: false },
    { id: "nestle", nombre: "Nestlé", logoUrl: "/marcas/nestle.png", isLocal: false },
    { id: "ferrari", nombre: "Ferrari", logoUrl: "/marcas/ferrari.png", isLocal: false },
    { id: "porsche", nombre: "Porsche", logoUrl: "/marcas/porsche.png", isLocal: false },
    { id: "ford", nombre: "Ford", logoUrl: "/marcas/ford.png", isLocal: false },
    { id: "chevrolet", nombre: "Chevrolet", logoUrl: "/marcas/chevrolet.png", isLocal: false },
    { id: "intel", nombre: "Intel", logoUrl: "/marcas/intel.png", isLocal: false },
    { id: "amd", nombre: "AMD", logoUrl: "/marcas/amd.png", isLocal: false },
  ];

  return NextResponse.json({ marcas: extraMarcas });
}
