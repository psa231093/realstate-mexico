import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-primary/20 mb-4">404</div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Pagina no encontrada
        </h1>

        <p className="text-muted-foreground mb-8">
          Lo sentimos, la pagina que buscas no existe o ha sido movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Ir al inicio
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/propiedades">
              <Search className="h-4 w-4 mr-2" />
              Buscar propiedades
            </Link>
          </Button>
        </div>

        <div className="mt-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="javascript:history.back()">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la pagina anterior
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
