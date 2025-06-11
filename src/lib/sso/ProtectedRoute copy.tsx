import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Componente para proteger rutas que requieren autenticación
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, login } = useAuth();
  const location = useLocation();

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, iniciar flujo de login en lugar de redirigir a una ruta específica
  if (!isAuthenticated) {
    // Guardar la URL actual para redirigir después del login
    localStorage.setItem('globodain_auth_redirect', location.pathname);
    
    // Iniciamos directamente el flujo de login en lugar de navegar a una ruta
    // Esto evita conflictos con el AppRoutes
    login();
    
    // Mientras se prepara la redirección, mostramos un mensaje
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-pulse">
            <p className="text-lg text-gray-700">Redirigiendo al inicio de sesión...</p>
          </div>
        </div>
      </div>
    );
  }

  // Si está autenticado, mostrar el contenido protegido
  return <>{children}</>;
};

export default ProtectedRoute;