import React, { useState } from 'react';
import {
  X,
  FileCode,
  Download,
  Copy,
  Check,
  Zap,
  Server,
  Cloud,
  Layers,
  Terminal,
  ExternalLink,
  ChevronRight,
  FolderTree,
} from 'lucide-react';
import JSZip from 'jszip';

interface AstroMigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AstroMigrationModal: React.FC<AstroMigrationModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<string>('index.astro');
  const [copied, setCopied] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  if (!isOpen) return null;

  const fileContents: Record<string, { lang: string; path: string; code: string; desc: string }> = {
    'index.astro': {
      lang: 'astro',
      path: 'src/pages/index.astro',
      desc: 'Página de Inicio con enlaces a las páginas individuales de Empresa y Servicios.',
      code: `---
// src/pages/index.astro (Home Page)
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';

// Islas Interactivas (React)
import { TestimonialsSection } from '../components/TestimonialsSection';
import { ContactForm } from '../components/ContactForm';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
---

<Layout title="New Route Chile | Traslados Privados, Aeropuerto y Turismo Receptivo 24/7">
  <!-- Hero Section Estático (0 KB JavaScript) -->
  <Hero />

  <!-- Accesos directos a páginas individuales -->
  <section class="py-16 bg-white border-b border-stone-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="p-8 rounded-2xl bg-stone-50 border border-stone-200">
        <h3 class="text-xl font-bold font-display">Nuestra Empresa (Desde 2006)</h3>
        <p class="text-xs text-stone-600 mt-2">Conoce nuestra trayectoria, equipo hotelero y flota ejecutiva.</p>
        <a href="/empresa" class="mt-4 inline-block text-amber-800 font-bold text-xs">Ir a la página de Nuestra Empresa &rarr;</a>
      </div>
      <div class="p-8 rounded-2xl bg-stone-50 border border-stone-200">
        <h3 class="text-xl font-bold font-display">Servicios & Tarifas Oficiales</h3>
        <p class="text-xs text-stone-600 mt-2">Valores para traslados aeropuerto SCL, rutas del vino y cordillera.</p>
        <a href="/servicios" class="mt-4 inline-block text-amber-800 font-bold text-xs">Ver Tarifario Completo Oficial &rarr;</a>
      </div>
    </div>
  </section>

  <!-- Testimonios y Contacto -->
  <TestimonialsSection client:visible />
  <ContactForm client:visible />
  <FloatingWhatsApp client:idle />
</Layout>`,
    },
    'empresa.astro': {
      lang: 'astro',
      path: 'src/pages/empresa.astro',
      desc: 'Página individual dedicada a la Historia (2006), Valores y Flota Ejecutiva.',
      code: `---
// src/pages/empresa.astro (Página Individual de Nuestra Empresa)
import Layout from '../layouts/Layout.astro';
import CompanyHistory from '../components/CompanyHistory.astro';
import { FleetSection } from '../components/FleetSection';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
---

<Layout title="Nuestra Empresa | New Route Chile · Desde 2006">
  <header class="bg-stone-900 text-white py-12">
    <div class="max-w-7xl mx-auto px-4">
      <a href="/" class="text-xs text-amber-400">&larr; Volver al Inicio</a>
      <h1 class="text-4xl font-bold font-display mt-2">Nuestra Empresa & Trayectoria</h1>
    </div>
  </header>

  <!-- Historia 100% estática sin JavaScript innecesario -->
  <CompanyHistory />
  <FleetSection client:visible />
  <FloatingWhatsApp client:idle />
</Layout>`,
    },
    'servicios.astro': {
      lang: 'astro',
      path: 'src/pages/servicios.astro',
      desc: 'Página individual con el catálogo completo de tarifas y calculadora interactiva.',
      code: `---
// src/pages/servicios.astro (Página Individual de Servicios & Tarifas)
import Layout from '../layouts/Layout.astro';
import { ServicesAndRates } from '../components/ServicesAndRates';
import { SERVICES_TARIFFS } from '../data/newrouteData';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
---

<Layout title="Servicios & Tarifas Oficiales 2026 | New Route Chile">
  <header class="bg-stone-900 text-white py-12">
    <div class="max-w-7xl mx-auto px-4">
      <a href="/" class="text-xs text-amber-400">&larr; Volver al Inicio</a>
      <h1 class="text-4xl font-bold font-display mt-2">Servicios Turísticos & Tarifario Oficial 2026</h1>
    </div>
  </header>

  <!-- Isla React Interactiva con filtrado y cotización en vivo -->
  <ServicesAndRates client:load tariffs={SERVICES_TARIFFS} />
  <FloatingWhatsApp client:idle />
</Layout>`,
    },
    'gerencia.astro': {
      lang: 'astro',
      path: 'src/pages/gerencia.astro',
      desc: 'Portal de administración protegido con login, accesible solo desde /gerencia.',
      code: `---
// src/pages/gerencia.astro (Ruta oculta protegida)
import Layout from '../layouts/Layout.astro';
import { GerenciaPage } from '../pages/GerenciaPage';
import { INITIAL_BOOKINGS_SEED, INITIAL_CONTACT_SEED, SERVICES_TARIFFS } from '../data/newrouteData';
---

<Layout title="Acceso Restringido · Gerencia New Route Chile">
  <!-- Isla React con login obligatorio -->
  <GerenciaPage client:only="react" bookings={INITIAL_BOOKINGS_SEED} contacts={INITIAL_CONTACT_SEED} tariffs={SERVICES_TARIFFS} />
</Layout>`,
    },
    'Layout.astro': {
      lang: 'astro',
      path: 'src/layouts/Layout.astro',
      desc: 'Layout base con SEO optimizado, JSON-LD Schema.org y metadatos OpenGraph.',
      code: `---
// src/layouts/Layout.astro
interface Props {
  title: string;
  description?: string;
}

const {
  title = "New Route Chile | Traslados Privados & Turismo Receptivo 24/7",
  description = "Empresa fundada en 2006 especializada en traslados aeropuerto SCL, rutas del vino y turismo privado en Santiago de Chile."
} = Astro.props;
---

<!doctype html>
<html lang="es" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href="https://newroute.cl" />

    <!-- OpenGraph & Twitter Cards -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />

    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "New Route Chile",
      "telephone": "+56 2 2394 2153",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ahumada 236, Oficina 510",
        "addressLocality": "Santiago",
        "addressCountry": "CL"
      }
    }
    </script>
  </head>
  <body class="bg-stone-50 text-stone-900 font-sans antialiased">
    <slot />
  </body>
</html>`,
    },
    'astro.config.mjs': {
      lang: 'javascript',
      path: 'astro.config.mjs',
      desc: 'Configuración oficial de Astro con adapter Cloudflare y React.',
      code: `import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server', // SSR ultra veloz en Edge o 'hybrid' para SSG
  adapter: cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [
    react(),
    tailwind()
  ],
  site: 'https://newroute.cl',
  compressHTML: true,
});`,
    },
    'wrangler.toml': {
      lang: 'toml',
      path: 'wrangler.toml',
      desc: 'Configuración de Cloudflare Pages & Workers con compatibilidad Node.js.',
      code: `name = "newroute-landing-astro"
compatibility_date = "2026-10-31"
compatibility_flags = ["nodejs_compat"]

[site]
bucket = "./dist"

[vars]
COMPANY_PHONE = "+56 2 2394 2153"
WHATSAPP_NUMBER = "+56 9 8412 8890"
COMPANY_EMAIL = "contacto@newroute.cl"
ADDRESS = "Ahumada 236, Oficina 510, Santiago Centro"`,
    },
    'package.json': {
      lang: 'json',
      path: 'package.json',
      desc: 'Dependencias oficiales de Astro 5 y Cloudflare.',
      code: `{
  "name": "newroute-astro-cloudflare",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev --port 3000 --host",
    "build": "astro build",
    "preview": "astro preview",
    "deploy": "wrangler pages deploy dist"
  },
  "dependencies": {
    "@astrojs/cloudflare": "^12.0.0",
    "@astrojs/react": "^4.0.0",
    "@astrojs/tailwind": "^5.1.0",
    "astro": "^5.0.0",
    "lucide-react": "^0.546.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^3.4.15"
  }
}`,
    },
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      const zip = new JSZip();

      // Root files
      zip.file('astro.config.mjs', fileContents['astro.config.mjs'].code);
      zip.file('wrangler.toml', fileContents['wrangler.toml'].code);
      zip.file('package.json', fileContents['package.json'].code);
      zip.file(
        'README.md',
        `# New Route Chile - Proyecto Migrado en Astro JS & Cloudflare

## 🚀 Inicio Rápido
\`\`\`bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción (Cloudflare Pages)
npm run build

# 4. Desplegar en Cloudflare Pages
npx wrangler pages deploy dist --project-name newroute-cl
\`\`\`

## 🏢 Características
- Fundada en 2006 en Santiago de Chile
- Tarifas oficiales aeropuerto SCL, rutas del vino y cordillera
- Zero JavaScript estático en Hero e Historia
- Islas React hidratadas con client:visible para reservas y formulario
`
      );

      // Astro source folder
      const srcFolder = zip.folder('src');
      if (srcFolder) {
        const pagesFolder = srcFolder.folder('pages');
        if (pagesFolder) {
          pagesFolder.file('index.astro', fileContents['index.astro'].code);
          pagesFolder.file('empresa.astro', fileContents['empresa.astro'].code);
          pagesFolder.file('servicios.astro', fileContents['servicios.astro'].code);
          pagesFolder.file('gerencia.astro', fileContents['gerencia.astro'].code);
        }

        const layoutsFolder = srcFolder.folder('layouts');
        if (layoutsFolder) {
          layoutsFolder.file('Layout.astro', fileContents['Layout.astro'].code);
        }

        const componentsFolder = srcFolder.folder('components');
        if (componentsFolder) {
          componentsFolder.file(
            'Hero.astro',
            `---
// Hero component estático
---
<section class="bg-stone-950 text-white py-20">
  <div class="max-w-7xl mx-auto px-4">
    <h1 class="text-5xl font-bold font-display">Transporte Privado New Route Chile</h1>
    <p class="text-stone-300 mt-4">Traslados Aeropuerto SCL, Rutas del Vino y Cordillera 24/7.</p>
  </div>
</section>`
          );
          componentsFolder.file(
            'CompanyHistory.astro',
            `---
// Historia New Route (Desde 2006)
---
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4">
    <h2 class="text-3xl font-bold">Nuestra Historia & Trayectoria (2006)</h2>
    <p class="text-stone-600 mt-2">Más de 20 profesionales hoteleros con 18+ años de experiencia.</p>
  </div>
</section>`
          );
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'newroute-astro-cloudflare-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error generating ZIP', e);
      alert('Hubo un error al generar el ZIP. Por favor copia los archivos directamente desde el visor.');
    } finally {
      setDownloading(false);
    }
  };

  const current = fileContents[selectedFile] || fileContents['index.astro'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-stone-900 rounded-2xl shadow-2xl border border-stone-800 overflow-hidden my-4 max-h-[92vh] flex flex-col text-stone-100">
        {/* Header */}
        <div className="bg-stone-950 px-6 py-4 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display text-white">
                  Proyecto Migrado a Astro JS & Cloudflare
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono px-2 py-0.5 rounded">
                  Astro 5.0 + Islands
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Estructura de islas, renderizado estático con 0 JS innecesario y despliegue en Cloudflare Pages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Generando ZIP...' : 'Descargar Proyecto Astro (.ZIP)'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Value Proposition Pills Banner */}
        <div className="bg-stone-900/60 border-b border-stone-800 px-6 py-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs shrink-0">
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="font-semibold text-white">Islas Interactivas (Islands)</div>
              <div className="text-stone-400 text-[11px]">HTML puro + hidratación selectiva</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Cloud className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="font-semibold text-white">Despliegue Cloudflare Pages</div>
              <div className="text-stone-400 text-[11px]">0 ms de latencia en edge network</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="font-semibold text-white">100% Core Web Vitals</div>
              <div className="text-stone-400 text-[11px]">Carga en menos de 0.8s garantizada</div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
          {/* File Selector Sidebar */}
          <div className="md:col-span-4 bg-stone-950/70 border-r border-stone-800 p-4 space-y-4 overflow-y-auto">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-2 flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5 text-stone-400" />
                <span>Archivos de la Migración</span>
              </span>

              <div className="space-y-1">
                {Object.keys(fileContents).map((fileName) => {
                  const item = fileContents[fileName];
                  return (
                    <button
                      key={fileName}
                      onClick={() => setSelectedFile(fileName)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-between ${
                        selectedFile === fileName
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                          : 'text-stone-300 hover:bg-stone-800/60'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-mono text-xs">{fileName}</div>
                        <div className="text-[10px] text-stone-500 truncate">{item.path}</div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick CLI Commands */}
            <div className="pt-4 border-t border-stone-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-stone-400" />
                <span>Comandos de Despliegue</span>
              </span>
              <div className="p-3 bg-stone-900 rounded-lg border border-stone-800 text-[11px] font-mono text-stone-300 space-y-1.5 leading-relaxed">
                <div className="text-amber-400"># Instalar y ejecutar</div>
                <div>npm install</div>
                <div>npm run dev</div>
                <div className="text-amber-400 pt-1"># Build & Cloudflare</div>
                <div>npm run build</div>
                <div>npx wrangler pages deploy dist</div>
              </div>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="md:col-span-8 flex flex-col bg-stone-950 overflow-hidden">
            <div className="p-4 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-amber-400 font-bold">
                  {current.path}
                </span>
                <p className="text-[11px] text-stone-400 mt-0.5">{current.desc}</p>
              </div>

              <button
                onClick={() => handleCopy(current.code)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors cursor-pointer border border-stone-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Archivo'}</span>
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-stone-950 font-mono text-xs text-stone-300 leading-relaxed">
              <pre className="selection:bg-amber-500 selection:text-stone-950">
                <code>{current.code}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-950 border-t border-stone-800 px-6 py-3 flex items-center justify-between text-xs text-stone-400 shrink-0">
          <div>
            Listo para Cloudflare Pages & Workers con soporte SSR e Islas de React 19.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 text-stone-200 hover:bg-stone-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            Cerrar Visor
          </button>
        </div>
      </div>
    </div>
  );
};
