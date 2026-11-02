// src/pages/api/imagekit-auth.ts
import type { APIRoute } from 'astro';
import { getUploadAuthParams } from '@imagekit/astro/server';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async () => {
  const privateKey = env.IMAGEKIT_PRIVATE_KEY;
  // CAMBIO AQUÍ: Quitamos el prefijo PUBLIC_
  const publicKey = env.IMAGEKIT_PUBLIC_KEY; 

  console.log("Debug API - Private Key:", privateKey ? "Cargada ✅" : "No encontrada ❌");
  console.log("Debug API - Public Key:", publicKey ? "Cargada ✅" : "No encontrada ❌");

  if (!privateKey || !publicKey) {
    return new Response(JSON.stringify({ error: 'Faltan las claves de ImageKit. Revisa .dev.vars' }), { status: 500 });
  }

  const authParams = getUploadAuthParams({
    privateKey: privateKey,
    publicKey: publicKey,
  });

  return new Response(JSON.stringify({
    ...authParams,
    publicKey: publicKey
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};