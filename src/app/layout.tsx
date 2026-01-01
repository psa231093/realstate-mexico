import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://urbanify.mx"),
  title: {
    default: "Urbanify - Encuentra tu hogar ideal en Mexico",
    template: "%s | Urbanify",
  },
  description:
    "Urbanify es tu plataforma de bienes raices en Mexico. Encuentra casas, departamentos y propiedades en venta y renta en todo el pais. Calculadoras de credito hipotecario e INFONAVIT.",
  keywords: [
    "bienes raices mexico",
    "casas en venta",
    "departamentos en renta",
    "propiedades mexico",
    "inmuebles",
    "credito hipotecario",
    "infonavit",
    "calculadora hipoteca",
  ],
  authors: [{ name: "Urbanify" }],
  creator: "Urbanify",
  publisher: "Urbanify",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Urbanify",
    title: "Urbanify - Encuentra tu hogar ideal en Mexico",
    description:
      "Plataforma de bienes raices en Mexico. Encuentra casas, departamentos y propiedades en venta y renta.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Urbanify - Bienes Raices Mexico",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Urbanify - Encuentra tu hogar ideal en Mexico",
    description:
      "Plataforma de bienes raices en Mexico. Encuentra casas, departamentos y propiedades.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <SessionProvider>
            <div className="flex min-h-screen flex-col bg-background text-foreground">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
