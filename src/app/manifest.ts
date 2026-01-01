import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Urbanify",
    short_name: "Urbanify",
    description: "Plataforma de bienes raices en Mexico",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#10b981",
    icons: [
      {
        src: "/icon?size=192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon?size=512",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
