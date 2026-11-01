<div align="center">

```ascii
 ╔═══════════════════════════════════════════════════════════════════════════════════════╗
 ║                                                                                       ║
 ║   ███╗   ██╗███████╗██╗    ██╗    ██████╗  ██████╗ ██╗   ██╗████████╗███████╗         ║
 ║   ████╗  ██║██╔════╝██║    ██║    ██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝         ║
 ║   ██╔██╗ ██║█████╗  ██║ █╗ ██║    ██████╔╝██║   ██║██║   ██║   ██║   █████╗           ║
 ║   ██║╚██╗██║██╔══╝  ██║███╗██║    ██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝           ║
 ║   ██║ ╚████║███████╗╚███╔███╔╝    ██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗         ║
 ║   ╚═╝  ╚═══╝╚══════╝ ╚══╝╚══╝     ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝         ║
 ║                                                                                       ║
 ║                  C H I L E  ·  T O U R I S M  &  T R A N S F E R S                   ║
 ║                 « Pasajeros de Alta Gama · Servicio Continuo 24/7 »                   ║
 ╚═══════════════════════════════════════════════════════════════════════════════════════╝
```

### 🇨🇱 Portal Oficial · Fundada en 2006 · Santiago de Chile

[![Astro](https://img.shields.io/badge/Astro-5.0-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Edge_SSR-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![Zero JS Default](https://img.shields.io/badge/Zero--JS-0_KB_Client_JS-10B981?style=for-the-badge&logo=lighthouse&logoColor=white)](https://pagespeed.web.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Operations 24/7](https://img.shields.io/badge/Operaciones-24%2F7%2F365-D97706?style=for-the-badge&logo=clock&logoColor=white)](https://wa.me/56984128890)

<p align="center">
  <b>Plataforma de alta velocidad para transporte privado corporativo, traslados al Aeropuerto SCL, rutas vitivinícolas y centros de esquí en los Andes chilenos.</b>
</p>

[🌐 Explorar Sitio Web](#-arquitectura-del-sitio-multipágina) • 
[💰 Tarifario Oficial](#-tarifario-oficial-2026-clp) • 
[🚐 Flota Ejecutiva](#-flota-ejecutiva--estándares-de-seguridad) • 
[⚙️ Portal Gerencia](#-portal-de-gerencia--despacho-gerencia) • 
[🚀 Guía de Despliegue](#-despliegue-en-cloudflare-pages)

---

</div>

## 📌 Ficha Técnica de la Empresa

```ascii
┌───────────────────────┬────────────────────────────────────────────────────────┐
│ RAZÓN SOCIAL          │ New Route Chile SpA                                    │
│ FUNDACIÓN             │ Año 2006 (Más de 18 años de trayectoria ininterrumpida)│
│ EQUIPO FUNDADOR       │ 20 profesionales con 10+ años de experiencia hotelera │
│ MATRIZ CORPORATIVA    │ Ahumada 236, Oficina 510, Santiago Centro, Chile       │
│ CONVENIO EMBLEMÁTICO  │ Hotel InterContinental Santiago & Cadenas 5 Estrellas  │
│ CONTACTO CONTINUO     │ 📞 +56 2 2394 2153  ·  📱 WhatsApp: +56 9 8412 8890    │
│ CORREOS OFICIALES     │ contacto@newroute.cl  ·  reservas@newroute.cl          │
│ RÉGIMEN OPERATIVO     │ Monitoreo y despacho 24 horas del día / 365 días al año│
└───────────────────────┴────────────────────────────────────────────────────────┘
```

---

## ⚡ Arquitectura Técnica · 100% Astro & Edge Speed

El proyecto está diseñado para ofrecer una **experiencia de usuario ultra fluida con 0 ms de retraso de renderizado**, combinando **componentes nativos `.astro` sin peso de JavaScript** y componentes reactivos aislados para módulos dinámicos:

```ascii
                     +---------------------------------------+
                     |        CLOUDFLARE EDGE NETWORK        |
                     |       (Más de 330 ciudades CDN)       |
                     +-------------------+-------------------+
                                         |
                       [ Solicitud HTTP / URL Limpia ]
                                         v
   +─────────────────────────────────────+─────────────────────────────────────+
   │                                                                           │
   v                                     v                                     v
[ src/pages/index.astro ]     [ src/pages/empresa.astro ]   [ src/pages/servicios.astro ]
   │ (Página Inicio)                     │ (Historia & Flota)                  │ (Tarifario & FAQ)
   │                                     │                                     │
   ├─► <Navbar.astro>                    ├─► <Navbar.astro>                    ├─► <Navbar.astro>
   ├─► <Hero.astro> [0 KB JS]            ├─► <CompanyHistory.astro>            ├─► <ServicesAndRates.astro>
   ├─► <TestimonialsSection.astro>       ├─► <FleetSection.astro>              │    (Filtros en Vanilla JS)
   ├─► <ContactForm.astro>               └─► <Footer.astro>                    └─► <Footer.astro>
   └─► <Footer.astro>                                                              │
         │                                                                         │
         └───────────────────────────────┬─────────────────────────────────────────┘
                                         │
                             [ Click en Engranaje ⚙️ ]
                                         v
                            [ src/pages/gerencia.astro ]
                                         │
                            +------------┴------------+
                            |  PANTALLA DE LOGIN      |
                            |  Credenciales Clave     |
                            +------------┬------------+
                                         v
                            +-------------------------+
                            |  DASHBOARD DESPACHO     |
                            |  - Asignar Móvil/Chofer |
                            |  - Estados de Reserva   |
                            |  - Exportar CSV / Excel |
                            +-------------------------+
```

---

## 🗂 Estructura de Archivos del Proyecto

```ascii
newroute-chile/
 ├── astro.config.mjs               # Configuración Astro + Cloudflare SSR + Tailwind 4
 ├── wrangler.toml                  # Variables de entorno de Cloudflare Pages
 ├── package.json                   # Dependencias y scripts de build dual
 ├── README.md                      # Documentación maestra del proyecto
 ├── src/
 │    ├── layouts/
 │    │    └── Layout.astro         # Layout maestro con SEO, OpenGraph y JSON-LD
 │    ├── pages/                    # Enrutamiento basado en archivos de Astro
 │    │    ├── index.astro          # Página principal (Home 100% Astro)
 │    │    ├── empresa.astro        # Página individual: Nuestra Empresa (2006)
 │    │    ├── servicios.astro      # Página individual: Servicios & Tarifas
 │    │    └── gerencia.astro       # Portal privado protegido con login
 │    ├── components/
 │    │    ├── astro/               # Componentes nativos 100% Astro (Zero-JS)
 │    │    │    ├── Navbar.astro    # Navegación con menú responsive
 │    │    │    ├── Hero.astro      # Cabecera con imagen y accesos rápidos
 │    │    │    ├── CompanyHistory.astro # Reseña de fundación hotelera
 │    │    │    ├── ServicesAndRates.astro # Catálogo con filtro vanilla JS
 │    │    │    ├── FleetSection.astro   # Fichas técnicas de vehículos
 │    │    │    ├── TestimonialsSection.astro # Testimonios verificados
 │    │    │    ├── ContactForm.astro    # Formulario con almacenamiento local
 │    │    │    └── Footer.astro    # Pie de página con botón de engranaje ⚙️
 │    │    └── views/               # Vistas para fallback SPA (Vite / React)
 │    │         ├── HomeView.tsx
 │    │         ├── EmpresaView.tsx
 │    │         ├── ServiciosView.tsx
 │    │         └── GerenciaView.tsx
 │    ├── data/
 │    │    └── newrouteData.ts      # Datos oficiales extraídos de newroute.cl
 │    └── lib/
 │         └── storage.ts           # Motor de persistencia y exportación CSV
```

---

## 🧭 Arquitectura del Sitio Multipágina

En cumplimiento de las especificaciones de diseño, el sitio divide el contenido en **páginas independientes**, accesibles de forma limpia desde el menú:

| Ruta | Nombre de la Página | Contenido & Propósito |
| :--- | :--- | :--- |
| **`/`** | **Inicio (Home)** | Hero ejecutivo, accesos a páginas individuales, testimonios y contacto directo. |
| **`/empresa`** | **Nuestra Empresa** | Historia oficial (2006), pilares de calidad, convenios hoteleros y catálogo de flota. |
| **`/servicios`** | **Servicios & Tarifas** | Tarifario completo 2026, comparativa 1-3 vs. 4-6 PAX, botón de reserva y FAQ. |
| **`/gerencia`** | **Portal Gerencia** | Acceso administrativo con login, despacho de móviles y exportación a Excel. |

---

## 💰 Tarifario Oficial 2026 (CLP)

Valores oficiales fijados en **Pesos Chilenos (CLP)** con tarifas transparentes, sin recargos nocturnos ni fluctuaciones dinámicas:

```ascii
┌───────────────────────────────────────┬──────────────┬──────────────┬──────────────────┐
│ SERVICIO / DESTINO                    │ 1 a 3 PAX    │ 4 a 6 PAX    │ DURACIÓN         │
├───────────────────────────────────────┼──────────────┼──────────────┼──────────────────┤
│ ✈️  Traslado Aeropuerto SCL ↔ Hoteles  │  $38.000 CLP │  $55.000 CLP │ 35 - 50 minutos  │
│ 🍷 Ruta del Vino Valle de Casablanca   │ $240.000 CLP │ $280.000 CLP │ Full Day (8 hrs) │
│ 🍷 Valle del Maipo (Concha y Toro)    │ $210.000 CLP │ $250.000 CLP │ 5 - 6 horas      │
│ 🍷 Valle de Colchagua Premium         │ $340.000 CLP │ $390.000 CLP │ Full Day (10 hrs)│
│ ⛷️  Farellones & El Colorado           │ $220.000 CLP │ $240.000 CLP │ Jornada Nieve    │
│ ⛷️  Valle Nevado Ski Resort            │ $250.000 CLP │ $270.000 CLP │ Jornada Nieve    │
│ ⛷️  Portillo & Laguna del Inca         │ $350.000 CLP │ $370.000 CLP │ 9 - 10 horas     │
│ ♨️  Termas Baños Colina (Cajón Maipo) │ $360.000 CLP │ $420.000 CLP │ 8 - 9 horas      │
│ ♨️  Termas del Corazón (Aconcagua)     │ $320.000 CLP │ $360.000 CLP │ 8 horas          │
│ 🏞️  Cajón del Maipo & Embalse El Yeso │ $280.000 CLP │ $300.000 CLP │ 7 - 8 horas      │
│ 🏛️  City Tour Santiago Histórico/Mod.  │ $130.000 CLP │ $170.000 CLP │ 4 - 5 horas      │
│ 🌊 Valparaíso Patrimonio & Viña del Mar│ $230.000 CLP │ $270.000 CLP │ Full Day (8 hrs) │
│ ⏱️  Disposición Ejecutiva por Hora     │  $84.000 CLP │ $105.000 CLP │ Mínimo 3 horas   │
└───────────────────────────────────────┴──────────────┴──────────────┴──────────────────┘
```

---

## 🚐 Flota Ejecutiva & Estándares de Seguridad

```ascii
  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
  │  MERCEDES SPRINTER VIP  │  │   SUV EJECUTIVA 4X4     │  │  SEDÁN CONFORT PREMIUM  │
  ├─────────────────────────┤  ├─────────────────────────┤  ├─────────────────────────┤
  │ • Capacidad: 7 a 19 PAX │  │ • Capacidad: 1 a 4 PAX  │  │ • Capacidad: 1 a 3 PAX  │
  │ • Cuero reclinable VIP  │  │ • Tracción 4WD integral │  │ • Insonorización total  │
  │ • Maletero ampliado     │  │ • Equipo nieve/cadenas  │  │ • Cargadores USB/WiFi   │
  │ • Porta-skies y audio   │  │ • Seguro alta montaña   │  │ • Climatizador bi-zona  │
  └─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
```

* **Normativa MTT**: Homologación oficial bajo el Decreto Supremo 80 del Ministerio de Transportes y Telecomunicaciones de Chile.
* **Pólizas de Seguro**: Cobertura por asiento para la totalidad de los pasajeros transportados.
* **Conductores**: Acreditación profesional, presentación impecable y opción bilingüe inglés/español.

---

## ⚙️ Portal de Gerencia & Despacho (`/gerencia`)

El acceso administrativo está **estrictamente protegido por autenticación** y se encuentra **oculto del público**:

### ¿Cómo ingresar?
1. Escribiendo directamente en el navegador la ruta: **/gerencia** (o `#gerencia`).
2. O haciendo clic en el enlace discreto con **ícono de engranaje ⚙️** situado en la barra de copyright del pie de página (`Footer`):
   ```ascii
   © 2006–2026 New Route Chile SpA. Todos los derechos reservados.  ·  Acceso Gerencia ⚙️
   ```

### Credenciales Autorizadas:
* **Usuario**: `gerencia` (o `admin@newroute.cl`)
* **Contraseña**: `gerencia2026` (o `NewRoute2026!`)

### Herramientas del Portal:
* **Dashboard KPI**: Métricas en vivo de solicitudes, reservas confirmadas y volumen monetario en cartera.
* **Control de Estados**: Gestión de estados operativos (*Pendiente, Confirmada, En Curso, Completada, Cancelada*).
* **Asignación Operativa**: Asignación de conductor y número de móvil (ej. *Carlos Muñoz - Móvil 04*).
* **Notificación al Pasajero**: Botón para enviar comprobante formateado directo al WhatsApp del cliente.
* **Exportación Excel/CSV**: Descarga instantánea de la base de datos de solicitudes.
* **Bandeja de Consultas**: Lectura y respuesta a mensajes del formulario de contacto.

---

## 🚀 Despliegue en Cloudflare Pages

### 1. Clonar el repositorio y dependencias:
```bash
git clone https://github.com/tu-organizacion/newroute-chile.git
cd newroute-chile
npm install --legacy-peer-deps
```

### 2. Iniciar servidor de desarrollo en Astro:
```bash
npm run dev:astro
```
> Abrir en el navegador: `http://localhost:3000`

### 3. Compilación de producción:
```bash
npm run build:astro
```
> Genera los paquetes listos para el Edge en la carpeta `dist/`.

### 4. Despliegue directo mediante Wrangler CLI:
```bash
npx wrangler pages deploy dist --project-name newroute-cl
```

### 5. Configuración automática mediante GitHub / GitLab:
Al conectar el repositorio en el panel de Cloudflare Pages:
* **Framework Preset**: `Astro`
* **Build Command**: `npm run build:astro`
* **Build Output Directory**: `dist`
* **Compatibility Flag**: `nodejs_compat`

---

## 📜 Créditos y Contacto

**New Route Chile SpA**  
*Ahumada 236, Oficina 510, Santiago Centro, Región Metropolitana, Chile*  
Teléfono: `+56 2 2394 2153` · WhatsApp: `+56 9 8412 8890` · Email: `contacto@newroute.cl`

<div align="center">
  <sub>© 2006–2026 New Route Chile SpA. Desarrollado con tecnología de ultra alta velocidad. Todos los derechos reservados.</sub>
</div>
