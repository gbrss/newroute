// scripts/seed.ts
import fs from 'fs';
import path from 'path';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.dev.vars' });

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function seed() {
  console.log('Leyendo newrouteData.ts...');
  const dataPath = path.resolve('src/data/newrouteData.ts');
  let fileContent = fs.readFileSync(dataPath, 'utf8');

  // 1. Limpiar comentarios para evitar errores de sintaxis
  fileContent = fileContent.replace(/\/\/.*$/gm, ''); // Elimina comentarios de línea
  fileContent = fileContent.replace(/\/\*[\s\S]*?\*\//g, ''); // Elimina comentarios de bloque

  // 2. Extraer el array entre corchetes
  const startMarker = 'export const SERVICES_TARIFFS: ServiceTariff[] = ';
  const startIndex = fileContent.indexOf(startMarker);
  
  if (startIndex === -1) {
    console.error('❌ No se encontró el array SERVICES_TARIFFS.');
    process.exit(1);
  }

  const arrayStart = startIndex + startMarker.length;
  const arrayEnd = fileContent.indexOf('];', arrayStart);

  if (arrayEnd === -1) {
    console.error('❌ No se encontró el cierre del array.');
    process.exit(1);
  }

  let arrayString = fileContent.substring(arrayStart, arrayEnd + 2);

  // 3. Reemplazar cualquier variable de imagen (con o sin .src) por un string vacío
  // Esto convierte: image: heroAndesImg.src, -> image: "",
  arrayString = arrayString.replace(/image:\s*[\w.]+(?:\.src)?/g, 'image: ""');

  // 4. Evaluar el array ya limpio
  let services;
  try {
    // Usamos Function en lugar de eval directo para un mejor contexto
    services = new Function(`return ${arrayString}`)();
  } catch (e) {
    console.error('❌ Error de sintaxis al procesar el array:', e);
    process.exit(1);
  }

  console.log(`✅ Se encontraron ${services.length} servicios. Insertando en Turso...`);

  // 5. Insertar en Turso
  for (const s of services) {
    const highlightsJson = JSON.stringify(s.highlights || []);
    
    try {
      await turso.execute({
        sql: `INSERT OR IGNORE INTO tariffs (id, category, name, subtitle, description, price1to3, price4to6, price7plus, durationApprox, image, featured, highlights) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          s.id,
          s.category,
          s.name,
          s.subtitle || null,
          s.description || null,
          s.price1to3 || 0,
          s.price4to6 || 0,
          s.price7plus || null,
          s.durationApprox || null,
          s.image || null,
          s.featured ? 1 : 0,
          highlightsJson
        ]
      });
      console.log(`  ✅ Insertado: ${s.name}`);
    } catch (error) {
      console.error(`  ❌ Error con ${s.name}:`, error);
    }
  }

  console.log('🎉 ¡Migración completada!');
  process.exit(0);
}

seed();