// src/lib/withAuth.tsx
import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './AuthContext';

/**
 * HOC para proteger rutas que requieren autenticación
 * @param WrappedComponent Componente a proteger
 * @param options Opciones de configuración
 * @returns Componente protegido
 */
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: {
    requireAuth?: boolean;
    adminOnly?: boolean;
    loadingComponent?: JSX.Element;
  } = {}
) {
  const {
    requireAuth = true,
    adminOnly = false,
    loadingComponent = <div>Cargando...</div>
  } = options;

  // Crear un nuevo componente con protección de autenticación
  const WithAuthComponent = (props: P) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Solo ejecutar en el cliente
      if (typeof window === 'undefined') return;

      // Si no está cargando y no hay usuario (y se requiere autenticación)
      if (!loading && !user && requireAuth) {
        // Guardar la URL actual para redireccionar después del login
        const currentPath = router.asPath;
        document.cookie = `nextUrl=${encodeURIComponent(currentPath)}; path=/; max-age=300`;
        
        // Redireccionar al login
        router.push('/auth/login');
      }

      // Si se requiere ser admin y el usuario no es admin
      if (
        !loading && 
        user && 
        adminOnly && 
        !(user.roles?.includes('admin') || user.isAdmin)
      ) {
        router.push('/unauthorized');
      }
    }, [loading, user, router]);

    // Mientras carga, mostrar componente de carga
    if (loading) {
      return loadingComponent;
    }

    // Si se requiere autenticación y no hay usuario, mostrar null
    // (la redirección ya debería estar en progreso)
    if (requireAuth && !user) {
      return null;
    }

    // Si se requiere ser admin y el usuario no es admin, mostrar null
    // (la redirección ya debería estar en progreso)
    if (
      adminOnly && 
      !(user?.roles?.includes('admin') || user?.isAdmin)
    ) {
      return null;
    }

    // Si todo está bien, renderizar el componente original
    return <WrappedComponent {...props} />;
  };

  // Copiar displayName para facilitar debugging
  WithAuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithAuthComponent;
}

export default withAuth;