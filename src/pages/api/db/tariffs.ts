import type { APIRoute } from 'astro';
import { getTurso } from '../../../turso';

// Función auxiliar para reintentar en caso de errores de red transitorios
async function executeWithRetry(turso: any, sql: string, args: any[], retries = 3, delay = 100) {
  for (let i = 0; i < retries; i++) {
    try {
      return await turso.execute({ sql, args });
    } catch (error: any) {
      // Si es un error de red y aún nos quedan reintentos, esperamos y volvemos a intentar
      if (error.message?.includes('Network connection lost') && i < retries - 1) {
        console.warn(`Error de red detectado. Reintentando (${i + 1}/${retries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error; // Si es otro error o ya no quedan reintentos, lo lanzamos
    }
  }
}

export const GET: APIRoute = async () => {
  try {
    const turso = getTurso();
    // Usamos la función de reintento
    const { rows } = await executeWithRetry(turso, 'SELECT * FROM tariffs', []);
    const parsedRows = rows.map((row: any) => ({
      ...row,
      highlights: row.highlights ? JSON.parse(row.highlights) : [],
      featured: row.featured === 1,
    }));
    return new Response(JSON.stringify(parsedRows), { status: 200 });
  } catch (e: any) {
    console.error("Error en API tariffs GET:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const turso = getTurso();
    const data = await request.json();
    
    const safeString = (val: any) => (val === undefined || val === null || val === '') ? null : String(val);
    const safeNumber = (val: any) => {
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    };
    const safeNullNumber = (val: any) => {
      const num = Number(val);
      return isNaN(num) ? null : num;
    };

    const highlightsJson = JSON.stringify(data.highlights || []);
    
    if (data.isEditing) {
      await executeWithRetry(turso, 
        `UPDATE tariffs SET category=?, name=?, subtitle=?, description=?, price1to3=?, price4to6=?, price7plus=?, durationApprox=?, image=?, featured=?, highlights=? WHERE id=?`,
        [
          safeString(data.category), safeString(data.name), safeString(data.subtitle), safeString(data.description), 
          safeNumber(data.price1to3), safeNumber(data.price4to6), safeNullNumber(data.price7plus), 
          safeString(data.durationApprox), safeString(data.image), data.featured ? 1 : 0, highlightsJson, data.id
        ]
      );
    } else {
      await executeWithRetry(turso, 
        `INSERT INTO tariffs (id, category, name, subtitle, description, price1to3, price4to6, price7plus, durationApprox, image, featured, highlights) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.id, safeString(data.category), safeString(data.name), safeString(data.subtitle), safeString(data.description), 
          safeNumber(data.price1to3), safeNumber(data.price4to6), safeNullNumber(data.price7plus), 
          safeString(data.durationApprox), safeString(data.image), data.featured ? 1 : 0, highlightsJson
        ]
      );
    }
    
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    console.error("Error en API tariffs POST:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const turso = getTurso();
    const { id } = await request.json();
    await executeWithRetry(turso, 'DELETE FROM tariffs WHERE id = ?', [id]);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    console.error("Error en API tariffs DELETE:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};