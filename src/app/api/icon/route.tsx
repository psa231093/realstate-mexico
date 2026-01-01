import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const size = parseInt(searchParams.get("size") || "192");

  // Validate size
  const validSizes = [16, 32, 48, 72, 96, 144, 192, 256, 384, 512];
  const finalSize = validSizes.includes(size) ? size : 192;

  const fontSize = Math.floor(finalSize * 0.55);
  const borderRadius = Math.floor(finalSize * 0.15);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize,
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          borderRadius,
        }}
      >
        U
      </div>
    ),
    {
      width: finalSize,
      height: finalSize,
    }
  );
}
