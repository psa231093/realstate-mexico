export const PROPERTY_TYPE_LABELS = {
  CASA: "Casa",
  DEPARTAMENTO: "Departamento",
  TERRENO: "Terreno",
  LOCAL_COMERCIAL: "Local Comercial",
  OFICINA: "Oficina",
  BODEGA: "Bodega",
  RANCHO: "Rancho",
} as const;

export const PROPERTY_STATUS_LABELS = {
  VENTA: "En Venta",
  RENTA: "En Renta",
  VENDIDO: "Vendida",
  RENTADO: "Rentada",
} as const;

export const AMENITIES = [
  { id: "pool", label: "Alberca" },
  { id: "gym", label: "Gimnasio" },
  { id: "garden", label: "Jardín" },
  { id: "terrace", label: "Terraza" },
  { id: "balcony", label: "Balcón" },
  { id: "parking", label: "Estacionamiento" },
  { id: "security", label: "Seguridad 24/7" },
  { id: "elevator", label: "Elevador" },
  { id: "ac", label: "Aire Acondicionado" },
  { id: "heating", label: "Calefacción" },
  { id: "laundry", label: "Área de Lavado" },
  { id: "storage", label: "Bodega" },
  { id: "petFriendly", label: "Acepta Mascotas" },
  { id: "furnished", label: "Amueblado" },
] as const;
