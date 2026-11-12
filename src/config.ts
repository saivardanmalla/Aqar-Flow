// src/config.ts
/**
 * Base URL for the Aqar‑Flow API.
 * During local development it falls back to http://localhost:3000.
 * Vite will replace VITE_API_URL at build time (set in Vercel env vars).
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

