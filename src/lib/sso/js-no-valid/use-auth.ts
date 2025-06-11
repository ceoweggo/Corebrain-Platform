// src/hooks/useAuth.ts
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth as useAuthHook } from '../lib/sso/AuthContext';

export const useAuth = (requireAuth = true) => {
  const auth = useAuthHook();
  const router = useRouter();
  
  useEffect(() => {
    // Si se requiere autenticación y no hay usuario, redireccionar al login
    if (requireAuth && !auth.loading && !auth.user) {
      // Guardar la ruta actual para redireccionar después del login
      document.cookie = `nextUrl=${encodeURIComponent(router.asPath)}; path=/; max-age=300`;
      
      // Redireccionar al login
      router.push('/auth/login');
    }
  }, [requireAuth, auth.loading, auth.user, router, router.asPath]);
  
  return auth;
};

export default useAuth;