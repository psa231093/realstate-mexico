import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politica de Privacidad | Urbanify",
  description: "Politica de privacidad y proteccion de datos personales de Urbanify. Conoce como recopilamos, usamos y protegemos tu informacion.",
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-2">Politica de Privacidad</h1>
        <p className="text-muted-foreground mb-8">
          Ultima actualizacion: 19 de diciembre de 2024
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduccion</h2>
            <p className="text-muted-foreground leading-relaxed">
              En Urbanify, respetamos tu privacidad y nos comprometemos a proteger tus datos personales.
              Esta Politica de Privacidad explica como recopilamos, usamos, compartimos y protegemos tu
              informacion cuando utilizas nuestra plataforma.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Esta politica cumple con la Ley Federal de Proteccion de Datos Personales en Posesion de
              los Particulares (LFPDPPP) de Mexico y el Reglamento General de Proteccion de Datos (GDPR)
              de la Union Europea cuando corresponda.
            </p>
          </section>

          {/* Data Controller */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Responsable del Tratamiento</h2>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-foreground font-medium">Urbanify</p>
              <p className="text-muted-foreground">Ciudad de Mexico, Mexico</p>
              <p className="text-muted-foreground">Email: privacidad@urbanify.mx</p>
            </div>
          </section>

          {/* Data We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Datos que Recopilamos</h2>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">3.1 Informacion que nos proporcionas</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Datos de registro:</strong> nombre, correo electronico, telefono, foto de perfil (al iniciar sesion con Google).</li>
              <li><strong>Datos de propiedades:</strong> direccion, caracteristicas, fotos, precios, descripcion de inmuebles que publicas.</li>
              <li><strong>Comunicaciones:</strong> mensajes que envias a otros usuarios a traves de la plataforma.</li>
              <li><strong>Consultas y soporte:</strong> informacion que proporcionas al contactarnos.</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">3.2 Informacion recopilada automaticamente</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Datos de uso:</strong> paginas visitadas, propiedades vistas, busquedas realizadas.</li>
              <li><strong>Datos del dispositivo:</strong> tipo de navegador, sistema operativo, direccion IP.</li>
              <li><strong>Cookies:</strong> identificadores para personalizar tu experiencia y recordar preferencias.</li>
              <li><strong>Ubicacion aproximada:</strong> basada en tu direccion IP para mostrar propiedades relevantes.</li>
            </ul>
          </section>

          {/* Purpose */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Finalidades del Tratamiento</h2>
            <p className="text-muted-foreground leading-relaxed">
              Utilizamos tus datos personales para:
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">4.1 Finalidades principales</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Crear y administrar tu cuenta de usuario.</li>
              <li>Publicar y gestionar tus listados de propiedades.</li>
              <li>Facilitar la comunicacion entre compradores y vendedores.</li>
              <li>Procesar pagos por servicios premium.</li>
              <li>Brindarte soporte tecnico y atencion al cliente.</li>
              <li>Enviar notificaciones sobre tu cuenta y actividad.</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">4.2 Finalidades secundarias</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Personalizar tu experiencia y recomendaciones de propiedades.</li>
              <li>Enviar comunicaciones de marketing (con tu consentimiento).</li>
              <li>Realizar analisis estadisticos para mejorar el servicio.</li>
              <li>Prevenir fraude y actividades ilegales.</li>
            </ul>
          </section>

          {/* Legal Basis */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Base Legal del Tratamiento</h2>
            <p className="text-muted-foreground leading-relaxed">
              El tratamiento de tus datos personales se fundamenta en:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li><strong>Consentimiento:</strong> Al crear tu cuenta y aceptar estos terminos.</li>
              <li><strong>Ejecucion de contrato:</strong> Para proporcionarte los servicios solicitados.</li>
              <li><strong>Interes legitimo:</strong> Para mejorar y asegurar nuestros servicios.</li>
              <li><strong>Obligacion legal:</strong> Para cumplir con requerimientos legales.</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Comparticion de Datos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos compartir tu informacion con:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li><strong>Otros usuarios:</strong> Tu perfil publico e informacion de contacto cuando publicas propiedades o inicias conversaciones.</li>
              <li><strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar la plataforma (hosting, pagos, email).</li>
              <li><strong>Autoridades:</strong> Cuando sea requerido por ley o para proteger derechos legales.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>No vendemos tus datos personales a terceros.</strong>
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Conservacion de Datos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Conservamos tus datos personales mientras:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>Tu cuenta este activa.</li>
              <li>Sea necesario para proporcionarte servicios.</li>
              <li>Lo requieran obligaciones legales o fiscales.</li>
              <li>Sea necesario para resolver disputas.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Tras la eliminacion de tu cuenta, conservamos ciertos datos de forma anonimizada para fines estadisticos.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Tus Derechos ARCO</h2>
            <p className="text-muted-foreground leading-relaxed">
              De acuerdo con la LFPDPPP, tienes derecho a:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li><strong>Acceso:</strong> Conocer que datos personales tenemos sobre ti.</li>
              <li><strong>Rectificacion:</strong> Corregir datos inexactos o incompletos.</li>
              <li><strong>Cancelacion:</strong> Solicitar la eliminacion de tus datos.</li>
              <li><strong>Oposicion:</strong> Oponerte al tratamiento de tus datos para fines especificos.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Para ejercer estos derechos, contactanos en{" "}
              <a href="mailto:privacidad@urbanify.mx" className="text-primary hover:underline">
                privacidad@urbanify.mx
              </a>
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Cookies y Tecnologias Similares</h2>
            <p className="text-muted-foreground leading-relaxed">
              Utilizamos cookies y tecnologias similares para:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento del sitio.</li>
              <li><strong>Cookies de preferencias:</strong> Recuerdan tus configuraciones.</li>
              <li><strong>Cookies analiticas:</strong> Nos ayudan a entender como usas el sitio.</li>
              <li><strong>Cookies de marketing:</strong> Permiten mostrar anuncios relevantes (con tu consentimiento).</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Puedes gestionar tus preferencias de cookies en la configuracion de tu navegador.
            </p>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Seguridad de los Datos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementamos medidas de seguridad tecnicas y organizativas para proteger tus datos:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>Cifrado de datos en transito mediante HTTPS/TLS.</li>
              <li>Almacenamiento seguro en servidores protegidos.</li>
              <li>Acceso restringido a datos personales solo a personal autorizado.</li>
              <li>Monitoreo continuo de actividades sospechosas.</li>
              <li>Autenticacion segura mediante OAuth 2.0.</li>
            </ul>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Transferencias Internacionales</h2>
            <p className="text-muted-foreground leading-relaxed">
              Tus datos pueden ser transferidos y procesados en servidores ubicados fuera de Mexico.
              Cuando esto ocurra, nos aseguramos de que existan salvaguardas adecuadas para proteger
              tus datos, como clausulas contractuales estandar o certificaciones de privacidad.
            </p>
          </section>

          {/* Children */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Menores de Edad</h2>
            <p className="text-muted-foreground leading-relaxed">
              Urbanify no esta dirigido a menores de 18 anos. No recopilamos intencionalmente
              informacion de menores. Si descubrimos que hemos recopilado datos de un menor,
              los eliminaremos inmediatamente.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">13. Cambios a esta Politica</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos actualizar esta Politica de Privacidad periodicamente. Te notificaremos sobre
              cambios significativos mediante un aviso en la plataforma o por correo electronico.
              Te recomendamos revisar esta pagina regularmente.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">14. Contacto</h2>
            <p className="text-muted-foreground leading-relaxed">
              Si tienes preguntas sobre esta Politica de Privacidad o quieres ejercer tus derechos,
              contactanos:
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-foreground font-medium">Departamento de Privacidad de Urbanify</p>
              <p className="text-muted-foreground">Email: privacidad@urbanify.mx</p>
              <p className="text-muted-foreground">Ciudad de Mexico, Mexico</p>
            </div>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Si no estas satisfecho con nuestra respuesta, puedes presentar una queja ante el
              Instituto Nacional de Transparencia, Acceso a la Informacion y Proteccion de Datos
              Personales (INAI).
            </p>
          </section>

          {/* Related Links */}
          <section className="border-t pt-8 mt-8">
            <p className="text-muted-foreground">
              Consulta tambien nuestros{" "}
              <Link href="/terminos" className="text-primary hover:underline">
                Terminos de Uso
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
