import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../../lib/sso/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Obtener el proveedor de OAuth si se especificó
    const provider = req.query.provider as string | undefined;
    
    // Redireccionar al usuario al SSO de Globodain
    const loginUrl = auth.getLoginUrl(provider || null);
    
    console.log("Redirigiendo a:", loginUrl);
    
    return res.redirect(302, loginUrl);
  } catch (error) {
    console.error('Error iniciando sesión:', error);
    return res.status(500).json({ error: 'Error iniciando sesión' });
  }
}
