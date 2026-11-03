import type { APIRoute } from 'astro';
import { getTurso } from '../../../turso';

export const GET: APIRoute = async () => {
  try {
    const turso = getTurso();
    const { rows } = await turso.execute('SELECT * FROM bookings ORDER BY createdAt DESC');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (e: any) {
    console.error("Error en API bookings:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const turso = getTurso();
    const data = await request.json();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const id = 'b-' + Date.now();
    const referenceCode = `NR-2026-${randNum}`;
    const createdAt = new Date().toISOString();
    const status = 'pendiente';

    await turso.execute({
      sql: `INSERT INTO bookings (id, referenceCode, createdAt, serviceId, serviceName, customerName, customerEmail, customerPhone, date, time, passengers, pickupAddress, dropoffAddress, flightNumber, luggageCount, specialRequests, needsBilingualDriver, needsBabySeat, totalEstimatedPrice, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, referenceCode, createdAt, data.serviceId, data.serviceName, data.customerName, data.customerEmail, data.customerPhone, data.date, data.time, data.passengers, data.pickupAddress, data.dropoffAddress || null, data.flightNumber || null, data.luggageCount, data.specialRequests || null, data.needsBilingualDriver ? 1 : 0, data.needsBabySeat ? 1 : 0, data.totalEstimatedPrice, status
      ]
    });

    return new Response(JSON.stringify({ id, referenceCode, createdAt, status, ...data }), { status: 201 });
  } catch (e: any) {
    console.error("Error en API bookings POST:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const turso = getTurso();
    const data = await request.json();
    await turso.execute({
      sql: 'UPDATE bookings SET status = ?, adminNotes = ?, assignedDriver = ? WHERE id = ?',
      args: [data.status, data.adminNotes || null, data.assignedDriver || null, data.id]
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    console.error("Error en API bookings PATCH:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const turso = getTurso();
    const { id } = await request.json();
    await turso.execute({ sql: 'DELETE FROM bookings WHERE id = ?', args: [id] });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    console.error("Error en API bookings DELETE:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};