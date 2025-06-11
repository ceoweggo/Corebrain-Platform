// src/lib/auth.ts
import GlobodainSSOAuth from '../GlobodainSSOAuth';

// Determinar si estamos en producción o desarrollo
// Use import.meta.env for Vite or process.env for webpack/Next.js
// Or use explicit environment variables from your bundler
const isProduction = import.meta?.env?.PROD || (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') || false;
const port = import.meta?.env?.PORT || (typeof process !== 'undefined' && process.env?.PORT) || 8080;

// Configuración del SSO
const ssoConfig = {
  ssoUrl: isProduction 
    ? 'https://sso.globodain.com' 
    : 'http://localhost:3000',
  clientId: isProduction 
    ? '' 
    : '54861d27-d349-4b6f-abc3-0cfdb22eefab',
  clientSecret: isProduction 
    ? '' 
    : '2be63d91-898d-455e-9611-6a3de0b81ba9',
  redirectUri: isProduction 
    ? 'https://corebrain.ai/auth/sso/callback' 
    : `http://localhost:${port}/auth/sso/callback`,
  successRedirect: isProduction 
    ? 'https://corebrain.ai' 
    : `http://localhost:${port}`,
  serviceId: 5 // Asegúrate de establecer tu serviceId aquí
};

// Crear instancia de autenticación
export const auth = new GlobodainSSOAuth(ssoConfig);

/**
 * Parseador de cookies
 * @param {string} cookieStr - String de cookies
 * @returns {object} Objeto con las cookies
 */
export function parseCookies(cookieStr: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  
  if (cookieStr) {
    cookieStr.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.split('=');
      const key = name?.trim();
      if (key) {
        cookies[key] = rest.join('=').trim();
      }
    });
  }
  
  return cookies;
}

/**
 * Genera una cookie de sesión
 * @param {string} name - Nombre de la cookie
 * @param {string} value - Valor de la cookie
 * @param {object} options - Opciones adicionales
 * @returns {string} Cookie formateada
 */
interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
  maxAge?: number;
  expires?: Date;
  domain?: string;
}

export function createCookie(name: string, value: string, options: CookieOptions = {}): string {
  const secure = isProduction;
  const defaultOptions: CookieOptions = {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 días por defecto
  };
  
  const opts = { ...defaultOptions, ...options };
  
  let cookie = `${name}=${encodeURIComponent(value)}`;
  
  if (opts.httpOnly) cookie += '; HttpOnly';
  if (opts.secure) cookie += '; Secure';
  if (opts.sameSite) cookie += `; SameSite=${opts.sameSite}`;
  if (opts.path) cookie += `; Path=${opts.path}`;
  if (opts.maxAge) cookie += `; Max-Age=${opts.maxAge}`;
  if (opts.expires) cookie += `; Expires=${opts.expires.toUTCString()}`;
  if (opts.domain) cookie += `; Domain=${opts.domain}`;
  
  return cookie;
}

/**
 * Genera una cookie para eliminar
 * @param {string} name - Nombre de la cookie a eliminar
 * @returns {string} Cookie de eliminación
 */
export function clearCookie(name: string): string {
  return `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Función para verificar autenticación
 * @param {string} cookieStr - String de cookies (opcional)
 * @returns {Promise<boolean>} True si el usuario está autenticado
 */
export async function isAuthenticated(cookieStr?: string): Promise<boolean> {
  // Obtener token de la cookie
  let cookies;
  
  // Comprobar si estamos en el navegador o en el servidor
  if (typeof window !== 'undefined') {
    // Estamos en el navegador
    cookies = parseCookies(cookieStr || document.cookie);
  } else {
    // Estamos en el servidor
    if (!cookieStr) {
      return false; // No hay cookies para verificar
    }
    cookies = parseCookies(cookieStr);
  }
  
  const accessToken = cookies.accessToken;
  
  if (!accessToken) {
    return false;
  }
  
  try {
    // Verificar token y obtener info del usuario
    const userInfo = await auth.getUserInfo(accessToken);
    
    if (!userInfo) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error verificando autenticación:', error);
    return false;
  }
}