import { formatMXN } from "./utils";

export interface WhatsAppMessageParams {
  propertyTitle: string;
  propertyPrice: number;
  propertyAddress: string;
  propertyUrl?: string;
  contactPhone?: string;
}

/**
 * Generate WhatsApp URL for contacting seller about a property
 */
export function generateWhatsAppUrl(params: WhatsAppMessageParams): string {
  const { propertyTitle, propertyPrice, propertyAddress, propertyUrl, contactPhone } = params;

  let message = `Hola, me interesa la propiedad "${propertyTitle}" en ${propertyAddress} con precio de ${formatMXN(propertyPrice)}.`;

  if (propertyUrl) {
    message += `\n\nVer propiedad: ${propertyUrl}`;
  }

  message += "\n\n¿Podria darme mas informacion?";

  const encodedMessage = encodeURIComponent(message);
  const phone = contactPhone?.replace(/\D/g, "") || "";

  // Use +52 country code for Mexico
  return phone
    ? `https://wa.me/52${phone}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;
}

/**
 * Generate WhatsApp URL for sharing a property listing
 */
export function generateShareWhatsAppUrl(
  propertyTitle: string,
  propertyPrice: number,
  propertyUrl: string
): string {
  const message = encodeURIComponent(
    `Mira esta propiedad: ${propertyTitle} - ${formatMXN(propertyPrice)}\n${propertyUrl}`
  );
  return `https://wa.me/?text=${message}`;
}

/**
 * Generate WhatsApp URL for sharing a saved search
 */
export function generateSavedSearchWhatsAppUrl(
  searchName: string,
  searchUrl: string
): string {
  const message = encodeURIComponent(
    `Te comparto esta busqueda de propiedades: ${searchName}\n${searchUrl}`
  );
  return `https://wa.me/?text=${message}`;
}
