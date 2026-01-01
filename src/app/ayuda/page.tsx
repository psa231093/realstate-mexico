import { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  Home,
  Calculator,
  MessageCircle,
  User,
  Shield,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Centro de Ayuda",
  description: "Encuentra respuestas a tus preguntas sobre como usar Urbanify.",
};

const helpCategories = [
  {
    icon: Search,
    title: "Buscar Propiedades",
    description: "Como encontrar tu propiedad ideal",
    links: [
      { label: "Como buscar propiedades", href: "/propiedades" },
      { label: "Filtrar por ubicacion y precio", href: "/propiedades" },
      { label: "Guardar busquedas favoritas", href: "/dashboard/busquedas-guardadas" },
    ],
  },
  {
    icon: Home,
    title: "Publicar Propiedad",
    description: "Vende o renta tu propiedad",
    links: [
      { label: "Como publicar una propiedad", href: "/venta" },
      { label: "Subir fotos de calidad", href: "/venta/particular" },
      { label: "Administrar mis publicaciones", href: "/dashboard/mis-propiedades" },
    ],
  },
  {
    icon: Calculator,
    title: "Calculadoras",
    description: "Herramientas financieras",
    links: [
      { label: "Capacidad de compra", href: "/calculadora" },
      { label: "Credito INFONAVIT", href: "/calculadora/infonavit" },
      { label: "Analisis de inversion", href: "/calculadora/inversion" },
    ],
  },
  {
    icon: MessageCircle,
    title: "Mensajes",
    description: "Comunicacion con vendedores",
    links: [
      { label: "Como enviar un mensaje", href: "/dashboard/mensajes" },
      { label: "Ver mis conversaciones", href: "/dashboard/mensajes" },
    ],
  },
  {
    icon: User,
    title: "Mi Cuenta",
    description: "Configuracion de perfil",
    links: [
      { label: "Editar mi perfil", href: "/dashboard/perfil" },
      { label: "Configuracion", href: "/dashboard/configuracion" },
      { label: "Mis favoritos", href: "/dashboard/guardados" },
    ],
  },
  {
    icon: Shield,
    title: "Seguridad y Privacidad",
    description: "Proteccion de tus datos",
    links: [
      { label: "Politica de privacidad", href: "/privacidad" },
      { label: "Terminos de uso", href: "/terminos" },
    ],
  },
];

const faqs = [
  {
    question: "Es gratis publicar una propiedad?",
    answer: "Si, publicar propiedades en Urbanify es completamente gratis. Puedes crear tu cuenta y publicar tus propiedades sin ningun costo.",
  },
  {
    question: "Como puedo contactar a un vendedor?",
    answer: "Puedes enviar un mensaje directo al vendedor desde la pagina de la propiedad. Tambien puedes contactarlo via WhatsApp si el vendedor ha compartido su numero.",
  },
  {
    question: "Como funciona la calculadora de capacidad de compra?",
    answer: "Nuestra calculadora analiza tus ingresos, gastos y el enganche disponible para determinar el precio maximo de vivienda que puedes comprar con un credito hipotecario.",
  },
  {
    question: "Puedo editar mi propiedad despues de publicarla?",
    answer: "Si, puedes editar todos los detalles de tu propiedad en cualquier momento desde tu dashboard en la seccion 'Mis Propiedades'.",
  },
];

export default function AyudaPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Centro de Ayuda
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encuentra respuestas a tus preguntas y aprende a sacar el maximo provecho de Urbanify.
          </p>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {helpCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{category.title}</h3>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {category.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ChevronRight className="h-4 w-4 mr-1" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h3 className="font-semibold text-foreground mb-2">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No encontraste lo que buscabas?
          </h2>
          <p className="text-muted-foreground mb-4">
            Nuestro equipo esta listo para ayudarte.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Contactanos
          </Link>
        </div>
      </div>
    </div>
  );
}
