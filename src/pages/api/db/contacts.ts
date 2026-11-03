import type { APIRoute } from 'astro';
import { getTurso } from '../../../turso';

export const GET: APIRoute = async () => {
  try {
    const turso = getTurso();
    const { rows } = await turso.execute('SELECT * FROM contacts ORDER BY createdAt DESC');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (e: any) {
    console.error("Error en API contacts:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const turso = getTurso();
    const data = await request.json();
    const id = 'c-' + Date.now();
    const createdAt = new Date().toISOString();
    await turso.execute({
      sql: 'INSERT INTO contacts (id, createdAt, name, email, phone, subject, message, read, replied) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [id, createdAt, data.name, data.email, data.phone, data.subject, data.message, 0, 0]
    });
    return new Response(JSON.stringify({ id, createdAt, ...data, read: false, replied: false }), { status: 201 });
  } catch (e: any) {
    console.error("Error en API contacts POST:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const turso = getTurso();
    const { id, read } = await request.json();
    await turso.execute({ sql: 'UPDATE contacts SET read = ? WHERE id = ?', args: [read ? 1 : 0, id] });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    console.error("Error en API contacts PATCH:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const turso = getTurso();
    const { id } = await request.json();
    await turso.execute({ sql: 'DELETE FROM contacts WHERE id = ?', args: [id] });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    console.error("Error en API contacts DELETE:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};