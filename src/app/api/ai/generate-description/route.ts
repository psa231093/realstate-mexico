import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

interface PropertyData {
  type: string;
  status: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  colonia?: string;
  municipality?: string;
  state?: string;
  amenities?: string[];
  parkingSpaces?: number;
  yearBuilt?: number;
  price?: number;
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  CASA: "Casa",
  DEPARTAMENTO: "Departamento",
  TERRENO: "Terreno",
  LOCAL_COMERCIAL: "Local Comercial",
  OFICINA: "Oficina",
  BODEGA: "Bodega",
  RANCHO: "Rancho",
};

const STATUS_LABELS: Record<string, string> = {
  VENTA: "en venta",
  RENTA: "en renta",
};

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const body: PropertyData = await request.json();
    const {
      type,
      status,
      bedrooms,
      bathrooms,
      area,
      colonia,
      municipality,
      state,
      amenities,
      parkingSpaces,
      yearBuilt,
      price,
    } = body;

    // Build property details string
    const details: string[] = [];

    if (type) {
      details.push(`Tipo: ${PROPERTY_TYPE_LABELS[type] || type}`);
    }
    if (status) {
      details.push(`Estado: ${STATUS_LABELS[status] || status}`);
    }
    if (bedrooms) {
      details.push(`Recamaras: ${bedrooms}`);
    }
    if (bathrooms) {
      details.push(`Banos: ${bathrooms}`);
    }
    if (area) {
      details.push(`Area: ${area} m2`);
    }
    if (parkingSpaces) {
      details.push(`Estacionamiento: ${parkingSpaces} lugares`);
    }
    if (yearBuilt) {
      details.push(`Ano de construccion: ${yearBuilt}`);
    }
    if (price) {
      const formattedPrice = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0,
      }).format(price);
      details.push(`Precio: ${formattedPrice}`);
    }

    const location = [colonia, municipality, state].filter(Boolean).join(", ");
    if (location) {
      details.push(`Ubicacion: ${location}`);
    }

    if (amenities && amenities.length > 0) {
      details.push(`Amenidades: ${amenities.join(", ")}`);
    }

    const prompt = `Eres un experto en bienes raices en Mexico. Genera una descripcion atractiva y profesional en espanol para una propiedad con las siguientes caracteristicas:

${details.join("\n")}

Instrucciones:
- Escribe en espanol mexicano profesional
- Usa un tono persuasivo pero no exagerado
- Destaca los puntos fuertes de la propiedad
- Menciona la ubicacion si esta disponible
- Si tiene amenidades, resaltalas
- Mantén la descripcion entre 100-200 palabras
- No uses emojis
- No inventes caracteristicas que no se proporcionaron
- Comienza directamente con la descripcion, sin frases introductorias como "Aqui esta la descripcion"

Genera solo la descripcion, sin titulos ni encabezados adicionales.`;

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract text from response
    const textContent = message.content.find((block) => block.type === "text");
    const description = textContent ? textContent.text : "";

    return NextResponse.json({ description });
  } catch (error) {
    console.error("Error generating description:", error);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}
