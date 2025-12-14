import { NextRequest, NextResponse } from "next/server";
import tinify from "tinify";

// Set TinyPNG API key from environment variable
const apiKey = process.env.TINYPNG_API_KEY;
if (apiKey) {
  tinify.key = apiKey;
}

export async function POST(request: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "TinyPNG API key not configured" },
        { status: 500 }
      );
    }

    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Convert base64 to buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Compress using TinyPNG
    const compressedBuffer = await tinify.fromBuffer(buffer).toBuffer();

    // Convert back to base64
    const compressedBase64 = `data:image/jpeg;base64,${compressedBuffer.toString("base64")}`;

    // Calculate compression stats
    const originalSize = buffer.length;
    const compressedSize = compressedBuffer.length;
    const savedPercentage = Math.round(
      ((originalSize - compressedSize) / originalSize) * 100
    );

    return NextResponse.json({
      compressedImage: compressedBase64,
      stats: {
        originalSize,
        compressedSize,
        savedPercentage,
      },
    });
  } catch (error: unknown) {
    console.error("Image compression error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to compress image";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
