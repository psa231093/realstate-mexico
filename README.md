# Bienes Raíces México

Una plataforma moderna de bienes raíces para el mercado mexicano, inspirada en Zillow.

## Estado del Proyecto

⚠️ **Estado Actual: Prototipo con UI/UX Completa, Pendiente Integración Backend**

### ✅ Lo que se ha implementado:

- ✅ Next.js 16 con App Router
- ✅ TypeScript configurado con modo estricto
- ✅ Tailwind CSS con configuración personalizada
- ✅ shadcn/ui components (Button, Card, Input, Badge)
- ✅ Prisma ORM con esquema completo de base de datos
- ✅ Estructura de proyecto organizada
- ✅ Layout básico con Navbar y Footer
- ✅ Constantes para estados mexicanos y tipos de propiedad
- ✅ Utilidades para formato de MXN, direcciones mexicanas
- ✅ UI/UX completa para búsqueda, listado y detalle de propiedades
- ✅ Wizard de publicación de propiedades (frontend)
- ✅ Integración de mapas (Mapbox)

### ⚠️ Lo que falta (Crítico):

- ❌ **Integración con base de datos** - Actualmente usa datos de prueba
- ❌ **API routes** - No hay endpoints para CRUD de propiedades
- ❌ **Autenticación completa** - NextAuth configurado pero no integrado
- ❌ **Almacenamiento de imágenes** - Falta integración con cloud storage
- ❌ **Seguridad** - API keys hardcodeadas, falta validación
- ❌ **Persistencia real** - Listings se guardan en localStorage

**👉 Ver [ROADMAP.md](./ROADMAP.md) para el plan completo de implementación.**

## Tecnologías

### Frontend
- **Next.js 16** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilizado
- **shadcn/ui** - Componentes UI
- **Lucide React** - Iconos
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **TanStack Query** - Gestión de estado del servidor
- **Embla Carousel** - Carruseles de imágenes

### Backend
- **Next.js API Routes** - API endpoints
- **Prisma** - ORM para PostgreSQL
- **NextAuth.js** - Autenticación
- **bcrypt** - Hash de contraseñas

### Mapas y Geolocalización
- **Mapbox GL JS** - Mapas interactivos (pendiente de configurar)

## Estructura del Proyecto

```
realestate-mexico/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Layout principal
│   │   ├── page.tsx         # Homepage
│   │   └── globals.css      # Estilos globales
│   ├── components/
│   │   ├── ui/              # Componentes shadcn/ui
│   │   └── layout/          # Navbar, Footer
│   ├── lib/
│   │   ├── prisma.ts        # Cliente Prisma
│   │   └── utils.ts         # Utilidades
│   ├── constants/           # Estados mexicanos, tipos de propiedad
│   ├── hooks/               # React hooks personalizados
│   └── types/               # Tipos TypeScript
├── prisma/
│   └── schema.prisma        # Esquema de base de datos
└── public/                  # Archivos estáticos
```

## Base de Datos

### Modelos Principales:

- **User** - Usuarios (USER, AGENT, ADMIN roles)
- **Property** - Propiedades con datos mexicanos (colonia, municipio, estado)
- **PropertyImage** - Imágenes de propiedades
- **Favorite** - Favoritos de usuarios
- **SavedSearch** - Búsquedas guardadas
- **Inquiry** - Consultas/contactos

### Tipos de Propiedad:
- CASA (Casa)
- DEPARTAMENTO (Departamento)
- TERRENO (Terreno)
- LOCAL_COMERCIAL (Local Comercial)
- OFICINA (Oficina)
- BODEGA (Bodega)
- RANCHO (Rancho)

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar base de datos

Actualiza el archivo `.env` con tu URL de PostgreSQL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/realestate_mexico"
```

### 3. Ejecutar migraciones de Prisma

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. (Opcional) Crear datos de prueba

```bash
npx prisma db seed
```

### 5. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Variables de Entorno

Copia `.env.example` a `.env` y configura:

- `DATABASE_URL` - URL de PostgreSQL
- `NEXTAUTH_SECRET` - Secreto para NextAuth (genera con `openssl rand -base64 32`)
- `NEXT_PUBLIC_MAPBOX_TOKEN` - Token de Mapbox (obtén en https://mapbox.com)
- `UPLOADTHING_SECRET` - Secret de UploadThing para subida de imágenes

## Scripts Disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Construir para producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar linter
```

## 🗺️ Roadmap y Planificación

Este proyecto sigue un roadmap estratégico de 5 fases para transformar la plataforma de un prototipo a una aplicación de producción completa.

### Documentos del Roadmap

- **[ROADMAP.md](./ROADMAP.md)** - Roadmap completo y detallado (16 semanas)
- **[ROADMAP_QUICK_REFERENCE.md](./ROADMAP_QUICK_REFERENCE.md)** - Referencia rápida del roadmap
- **[PHASE1_IMPLEMENTATION.md](./PHASE1_IMPLEMENTATION.md)** - Guía detallada de implementación para Fase 1
- **[TASKS_BREAKDOWN.json](./TASKS_BREAKDOWN.json)** - Desglose de tareas para herramientas de gestión de proyectos

### Fases del Roadmap

1. **Fase 1: Foundation & Security** (3 semanas) - 🔴 CRÍTICA
   - Integración de base de datos
   - API completa
   - Autenticación completa
   - Gestión de imágenes en la nube

2. **Fase 2: Core Features** (3 semanas) - 🔴 CRÍTICA
   - Páginas de detalle de propiedades
   - Búsqueda y filtros
   - Favoritos y búsquedas guardadas
   - Panel de administración

3. **Fase 3: Enhancement & Optimization** (3 semanas) - 🟡 IMPORTANTE
   - Optimización de rendimiento
   - Testing y QA
   - SEO y Analytics

4. **Fase 4: Intelligence & Innovation** (3 semanas) - 🟢 INNOVACIÓN
   - Features de IA
   - Inteligencia de mercado
   - Herramientas avanzadas

5. **Fase 5: Monetization & Scale** (4 semanas) - 🟢 REVENUE
   - Listings premium
   - Sistema de suscripciones
   - Escalabilidad

**Ver [ROADMAP.md](./ROADMAP.md) para detalles completos.**

## Próximos Pasos Inmediatos

**⚠️ Estado Actual:** La aplicación usa datos de prueba (mock data). La **Fase 1** es crítica para hacer la plataforma funcional.

1. **Revisar** el roadmap completo en `ROADMAP.md`
2. **Comenzar** con Fase 1, Semana 1 (ver `PHASE1_IMPLEMENTATION.md`)
3. **Configurar** variables de entorno (ver `.env.example`)
4. **Implementar** API routes para propiedades
5. **Reemplazar** todos los datos de prueba con consultas a la base de datos

## Características Mexicanas

- ✅ Idioma español en toda la interfaz
- ✅ Formato de moneda en pesos mexicanos (MXN)
- ✅ Formato de direcciones mexicanas (calle, colonia, municipio, estado, CP)
- ✅ 32 estados mexicanos soportados
- ✅ Terminología de bienes raíces local

## Licencia

MIT
