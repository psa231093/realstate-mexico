import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terminos de Uso | Urbanify",
  description: "Terminos y condiciones de uso de la plataforma Urbanify para compra, venta y renta de inmuebles en Mexico.",
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-2">Terminos de Uso</h1>
        <p className="text-muted-foreground mb-8">
          Ultima actualizacion: 19 de diciembre de 2024
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduccion</h2>
            <p className="text-muted-foreground leading-relaxed">
              Bienvenido a Urbanify. Estos Terminos de Uso (&quot;Terminos&quot;) rigen tu acceso y uso de
              la plataforma Urbanify, incluyendo nuestro sitio web, aplicaciones moviles y servicios
              relacionados (colectivamente, el &quot;Servicio&quot;). Al acceder o utilizar el Servicio,
              aceptas estar sujeto a estos Terminos.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Si no estas de acuerdo con estos Terminos, no debes acceder ni utilizar el Servicio.
            </p>
          </section>

          {/* Definitions */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Definiciones</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>&quot;Urbanify&quot;</strong>: La plataforma digital de bienes raices operada por nosotros.</li>
              <li><strong>&quot;Usuario&quot;</strong>: Cualquier persona que acceda o utilice el Servicio.</li>
              <li><strong>&quot;Vendedor&quot;</strong>: Usuario que publica propiedades para venta o renta.</li>
              <li><strong>&quot;Comprador&quot;</strong>: Usuario que busca propiedades para comprar o rentar.</li>
              <li><strong>&quot;Propiedad&quot;</strong>: Cualquier inmueble listado en la plataforma.</li>
              <li><strong>&quot;Contenido&quot;</strong>: Toda informacion, imagenes, descripciones y datos publicados en el Servicio.</li>
            </ul>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Elegibilidad</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para utilizar el Servicio, debes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>Tener al menos 18 anos de edad o la mayoria de edad legal en tu jurisdiccion.</li>
              <li>Tener la capacidad legal para celebrar contratos vinculantes.</li>
              <li>No estar prohibido de usar el Servicio bajo las leyes aplicables.</li>
              <li>Proporcionar informacion veraz y actualizada al registrarte.</li>
            </ul>
          </section>

          {/* Account */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Cuenta de Usuario</h2>
            <p className="text-muted-foreground leading-relaxed">
              Al crear una cuenta en Urbanify:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>Eres responsable de mantener la confidencialidad de tu cuenta y contrasena.</li>
              <li>Aceptas notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta.</li>
              <li>Eres responsable de todas las actividades que ocurran bajo tu cuenta.</li>
              <li>No puedes transferir o ceder tu cuenta a terceros sin nuestro consentimiento.</li>
            </ul>
          </section>

          {/* Property Listings */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Publicacion de Propiedades</h2>
            <p className="text-muted-foreground leading-relaxed">
              Al publicar una propiedad en Urbanify, garantizas que:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>Tienes el derecho legal de vender, rentar o anunciar la propiedad.</li>
              <li>Toda la informacion proporcionada es veraz, precisa y completa.</li>
              <li>Las imagenes corresponden a la propiedad anunciada y son de tu propiedad o tienes permiso para usarlas.</li>
              <li>El precio y las condiciones anunciadas son reales y de buena fe.</li>
              <li>La propiedad cumple con todas las regulaciones y normativas aplicables.</li>
              <li>No publicaras contenido fraudulento, enganoso o ilegal.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nos reservamos el derecho de eliminar cualquier listado que viole estos terminos o que
              consideremos inapropiado, sin previo aviso ni responsabilidad.
            </p>
          </section>

          {/* Prohibited Conduct */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Conducta Prohibida</h2>
            <p className="text-muted-foreground leading-relaxed">
              Al usar el Servicio, te comprometes a NO:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>Publicar informacion falsa, enganosa o fraudulenta.</li>
              <li>Suplantar la identidad de otra persona o entidad.</li>
              <li>Acosar, amenazar o intimidar a otros usuarios.</li>
              <li>Enviar spam, publicidad no solicitada o contenido promocional excesivo.</li>
              <li>Intentar acceder a cuentas de otros usuarios sin autorizacion.</li>
              <li>Utilizar el Servicio para actividades ilegales o lavado de dinero.</li>
              <li>Interferir con el funcionamiento del Servicio o sus sistemas de seguridad.</li>
              <li>Recopilar informacion de usuarios sin su consentimiento.</li>
              <li>Utilizar bots, scrapers u otras herramientas automatizadas sin autorizacion.</li>
            </ul>
          </section>

          {/* Fees */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Tarifas y Pagos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Urbanify puede ofrecer servicios gratuitos y de pago:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>Los servicios basicos de busqueda y navegacion son gratuitos.</li>
              <li>Ciertos servicios premium, como listados destacados, pueden requerir pago.</li>
              <li>Los precios se mostraran claramente antes de cualquier compra.</li>
              <li>Los pagos se procesan a traves de proveedores de pago seguros.</li>
              <li>Las politicas de reembolso se aplicaran segun se especifique en cada servicio.</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Propiedad Intelectual</h2>
            <p className="text-muted-foreground leading-relaxed">
              El Servicio y su contenido original, caracteristicas y funcionalidad son propiedad de
              Urbanify y estan protegidos por leyes de propiedad intelectual de Mexico e internacionales.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Al publicar contenido en el Servicio, nos otorgas una licencia no exclusiva, mundial,
              libre de regalias para usar, reproducir, modificar y mostrar dicho contenido en conexion
              con el Servicio.
            </p>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Descargo de Responsabilidad</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>URBANIFY ES UNA PLATAFORMA DE INTERMEDIACION.</strong> No somos parte de las
              transacciones inmobiliarias entre usuarios. Especificamente:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>No verificamos la veracidad de los listados ni la identidad de los usuarios.</li>
              <li>No garantizamos la disponibilidad, condicion o legalidad de las propiedades.</li>
              <li>No somos responsables de disputas entre compradores y vendedores.</li>
              <li>No proporcionamos asesoria legal, financiera ni inmobiliaria.</li>
              <li>Recomendamos verificar toda informacion de forma independiente.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              EL SERVICIO SE PROPORCIONA &quot;TAL CUAL&quot; Y &quot;SEGUN DISPONIBILIDAD&quot;, SIN GARANTIAS
              DE NINGUN TIPO, YA SEAN EXPRESAS O IMPLICITAS.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Limitacion de Responsabilidad</h2>
            <p className="text-muted-foreground leading-relaxed">
              En la maxima medida permitida por la ley aplicable, Urbanify no sera responsable de:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>Danos indirectos, incidentales, especiales o consecuentes.</li>
              <li>Perdida de beneficios, datos o uso.</li>
              <li>Danos derivados de transacciones con otros usuarios.</li>
              <li>Interrupciones o errores en el Servicio.</li>
            </ul>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Indemnizacion</h2>
            <p className="text-muted-foreground leading-relaxed">
              Aceptas indemnizar y mantener indemne a Urbanify, sus afiliados, directores, empleados y
              agentes de cualquier reclamacion, dano, perdida o gasto (incluyendo honorarios legales)
              que surja de tu uso del Servicio o violacion de estos Terminos.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Terminacion</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos suspender o terminar tu acceso al Servicio en cualquier momento, sin previo aviso,
              por cualquier razon, incluyendo violacion de estos Terminos. Tras la terminacion:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>Tu derecho a usar el Servicio cesara inmediatamente.</li>
              <li>Tus listados seran eliminados de la plataforma.</li>
              <li>Podemos retener cierta informacion segun lo requiera la ley.</li>
            </ul>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">13. Ley Aplicable</h2>
            <p className="text-muted-foreground leading-relaxed">
              Estos Terminos se regiran e interpretaran de acuerdo con las leyes de los Estados Unidos
              Mexicanos, sin dar efecto a sus disposiciones sobre conflicto de leyes.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Cualquier disputa sera sometida a la jurisdiccion exclusiva de los tribunales competentes
              de la Ciudad de Mexico.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">14. Modificaciones</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nos reservamos el derecho de modificar estos Terminos en cualquier momento. Los cambios
              entraran en vigor al publicarse en esta pagina. Tu uso continuado del Servicio despues
              de cualquier modificacion constituye tu aceptacion de los nuevos Terminos.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">15. Contacto</h2>
            <p className="text-muted-foreground leading-relaxed">
              Si tienes preguntas sobre estos Terminos, puedes contactarnos en:
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-foreground font-medium">Urbanify</p>
              <p className="text-muted-foreground">Email: legal@urbanify.mx</p>
              <p className="text-muted-foreground">Ciudad de Mexico, Mexico</p>
            </div>
          </section>

          {/* Related Links */}
          <section className="border-t pt-8 mt-8">
            <p className="text-muted-foreground">
              Consulta tambien nuestra{" "}
              <Link href="/privacidad" className="text-primary hover:underline">
                Politica de Privacidad
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
