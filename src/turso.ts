import { createClient } from "@libsql/client/web";
import { env } from "cloudflare:workers";

export function getTurso() {
  // Leemos las variables de entorno de Cloudflare o de Astro (para local)
  const url = env.TURSO_DATABASE_URL || import.meta.env.TURSO_DATABASE_URL;
  const authToken = env.TURSO_AUTH_TOKEN || import.meta.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error("Faltan las credenciales de Turso (URL o TOKEN). Revisa tu .dev.vars o Cloudflare.");
  }

  return createClient({
    url,
    authToken,
  });
}