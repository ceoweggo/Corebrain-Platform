import type { NextApiRequest, NextApiResponse } from 'next';
import { auth, parseCookies, clearCookie } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parsear cookies para obtener tokens
    const cookies = parseCookies(req.headers.cookie || '');
    
    const accessToken = cookies.accessToken;
    const refreshToken = cookies.refreshToken;
    
    // Si tenemos ambos tokens, intentar cerrar sesión en el SSO
    if (accessToken && refreshToken) {
      try {
        await auth.logout(refreshToken, accessToken);
      } catch (error) {
        console.error('Error cerrando sesión en el SSO:', error);
        // Continuamos para limpiar cookies localmente aunque
        // haya fallado la comunicación con el SSO
      }
    }
    
    // Limpiar cookies
    const clearCookieHeaders = [
      clearCookie('accessToken'),
      clearCookie('refreshToken')
    ];
    
    // Establecer cookies de eliminación
    res.setHeader('Set-Cookie', clearCookieHeaders);
    
    // Redireccionar a la página de inicio
    return res.redirect(302, '/');
  } catch (error) {
    console.error('Error cerrando sesión:', error);
    return res.status(500).json({ error: 'Error cerrando sesión' });
  }
}