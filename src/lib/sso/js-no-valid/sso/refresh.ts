import type { NextApiRequest, NextApiResponse } from 'next';
import { auth, parseCookies, createCookie } from '../../../lib/sso/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parsear cookies para obtener refresh token
    const cookies = parseCookies(req.headers.cookie || '');
    const refreshToken = cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'No hay token de refresco' });
    }
    
    // Refrescar token
    const tokenData = await auth.refreshToken(refreshToken);
    
    if (!tokenData) {
      return res.status(401).json({ error: 'Error al refrescar token' });
    }
    
    // Crear cookies para almacenar nuevos tokens
    const accessTokenCookie = createCookie('accessToken', tokenData.access_token, {
      maxAge: tokenData.expires_in
    });
    
    const refreshTokenCookie = createCookie('refreshToken', tokenData.refresh_token, {
      maxAge: 60 * 60 * 24 * 30 // 30 días
    });
    
    // Configurar cookies en la respuesta
    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    
    // Devolver éxito
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error refrescando token:', error);
    return res.status(500).json({ error: 'Error refrescando token' });
  }
}