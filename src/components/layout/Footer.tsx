import Link from "next/link";
import { Home } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Bienes Raíces México</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Tu plataforma confiable para encontrar el hogar ideal en México.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/propiedades?status=VENTA"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Propiedades en Venta
                </Link>
              </li>
              <li>
                <Link
                  href="/propiedades?status=RENTA"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Propiedades en Renta
                </Link>
              </li>
              <li>
                <Link
                  href="/mapa"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Buscar en Mapa
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="font-semibold mb-4">Tipos de Propiedad</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/propiedades?type=CASA"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Casas
                </Link>
              </li>
              <li>
                <Link
                  href="/propiedades?type=DEPARTAMENTO"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Departamentos
                </Link>
              </li>
              <li>
                <Link
                  href="/propiedades?type=TERRENO"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terrenos
                </Link>
              </li>
              <li>
                <Link
                  href="/propiedades?type=LOCAL_COMERCIAL"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Locales Comerciales
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/ayuda"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/terminos"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Términos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Bienes Raíces México. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
