import type { NextApiRequest, NextApiResponse } from 'next';
import { auth, createCookie } from '../../../lib/sso/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Obtener el código de autorización
    const code = req.query.code as string;
    
    if (!code) {
      return res.status(400).json({ error: 'Código de autorización no proporcionado' });
    }
    
    // Intercambiar código por token
    const tokenData = await auth.exchangeCodeForToken(code);
    
    if (!tokenData) {
      return res.status(401).json({ error: 'Error al obtener token' });
    }
    
    // Crear cookies para almacenar tokens
    const accessTokenCookie = createCookie('accessToken', tokenData.access_token, {
      maxAge: tokenData.expires_in
    });
    
    const refreshTokenCookie = createCookie('refreshToken', tokenData.refresh_token, {
      maxAge: 60 * 60 * 24 * 30 // 30 días
    });
    
    // Obtener URL a redireccionar después del login (si existe)
    const { cookies } = req;
    const nextUrl = cookies.nextUrl ? decodeURIComponent(cookies.nextUrl) : '/';
    
    // Eliminar cookie nextUrl
    const clearNextUrlCookie = 'nextUrl=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Configurar cookies en la respuesta
    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie, clearNextUrlCookie]);
    
    // Redireccionar a la página apropiada
    return res.redirect(302, nextUrl);
  } catch (error) {
    console.error('Error en callback:', error);
    return res.status(500).json({ error: 'Error procesando callback' });
  }
}
