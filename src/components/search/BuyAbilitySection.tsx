import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const affordableHomes = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
    badge: "Dentro de CapacidadDeCompra",
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    badge: "Dentro de CapacidadDeCompra",
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    badge: "Dentro de CapacidadDeCompra",
  },
];

export function BuyAbilitySection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Encuentra casas que puedas pagar con CapacidadDeCompra™
          </h2>
          <p className="text-gray-600">
            Responde algunas preguntas. Destacaremos las casas para las que probablemente califiques.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[400px,1fr] gap-6">
          {/* Calculator Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 h-fit">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
              <span className="font-bold text-lg">Zillow Home Loans</span>
            </div>

            {/* Price Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-3xl font-bold text-gray-900">$ - -</p>
                <p className="text-sm text-gray-600 mt-1">Precio objetivo sugerido</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">$ - -</p>
                <p className="text-sm text-gray-600 mt-1">CapacidadDeCompra™</p>
              </div>
            </div>

            {/* Rates Info */}
            <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b">
              <div>
                <p className="text-xl font-bold text-gray-900">$ - -</p>
                <p className="text-xs text-gray-600 mt-1">Pago mensual</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">- - %</p>
                <p className="text-xs text-gray-600 mt-1">Tasa de hoy</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">- - %</p>
                <p className="text-xs text-gray-600 mt-1">APR</p>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 font-semibold text-base py-6 rounded-lg"
            >
              Empecemos
            </Button>
          </div>

          {/* Property Cards Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {affordableHomes.map((home) => (
              <div
                key={home.id}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gray-100">
                  <Image
                    src={home.imageUrl}
                    alt="Casa dentro de presupuesto"
                    fill
                    className="object-cover"
                  />
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant="destructive"
                      className="bg-orange-600 hover:bg-orange-700 font-semibold text-xs px-3 py-1"
                    >
                      {home.badge}
                    </Badge>
                  </div>
                </div>

                {/* Skeleton Content */}
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
