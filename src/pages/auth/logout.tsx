import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/sso/AuthContext';

export const LogoutPage: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);

  // Determinar la URL de redirección basada en el entorno
  const getSsoLogoutUrl = () => {
    // Verificar si estamos en desarrollo local o en producción
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    
    // URL base para el SSO logout
    const baseSsoLogoutUrl = isLocalhost 
      ? 'http://localhost:3000/logout'
      : 'https://sso.globodain.com/logout';
    
    // URL de callback para después del logout del SSO
    const callbackUrl = isLocalhost
      ? 'http://localhost:5173/auth/sso/logout-callback'
      : `${window.location.origin}/auth/sso/logout-callback`;
    
    // Añadir el callback de retorno del SSO y el callback de la app si existe
    let ssoLogoutUrl = `${baseSsoLogoutUrl}?redirect_uri=${encodeURIComponent(callbackUrl)}`;
    
    if (callbackUrl) {
      // Pasamos el callback original también para mantenerlo en la cadena de redirecciones
      ssoLogoutUrl += `&app_callback=${callbackUrl}`;
    }
    
    return ssoLogoutUrl;
  };

  useEffect(() => {
    // Extraer el callback de la URL si existe
    const params = new URLSearchParams(window.location.search);
    const callback = params.get('callback');
    if (callback) {
      setCallbackUrl(callback);
      // Guardar el callback para usarlo después del SSO logout
      sessionStorage.setItem('globodain_logout_callback', callback);
    } else {
      // Ver si hay un callback guardado previamente
      const savedCallback = sessionStorage.getItem('globodain_logout_callback');
      if (savedCallback) {
        setCallbackUrl(savedCallback);
      }
    }

    // Función para realizar el logout
    const performLogout = async () => {
      try {
        setIsLoggingOut(true);
        console.log('Iniciando logout desde la página de logout');
        
        // Ejecutar el logout del AuthContext
        await logout();
        
        // Después de hacer logout local, redirigir al SSO para completar el logout
        const ssoLogoutUrl = getSsoLogoutUrl();
        console.log(`Redirigiendo al SSO logout: ${ssoLogoutUrl}`);
        
        // Redirigir al SSO
        window.location.href = ssoLogoutUrl;
        
        // No necesitamos setIsLoggingOut(false) aquí porque vamos a redirigir
      } catch (error) {
        console.error('Error durante el proceso de logout:', error);
        setIsLoggingOut(false);
      }
    };

    // Si estamos autenticados, ejecutar el logout
    if (isAuthenticated) {
      performLogout();
    } else {
      setIsLoggingOut(false);
    }
  }, [isAuthenticated, logout]);

  // Solo mostrar la página de "Sesión cerrada" si el logout se completó 
  // pero no nos redirigimos al SSO (generalmente solo en caso de error)
  useEffect(() => {
    if (!isLoggingOut && !isAuthenticated) {
      // Verificar si venimos de vuelta del SSO (callback de logout)
      const params = new URLSearchParams(window.location.search);
      const fromSso = params.get('from_sso');
      
      if (fromSso === 'true') {
        // Obtener el callback guardado
        const savedCallback = sessionStorage.getItem('globodain_logout_callback');
        
        if (savedCallback) {
          // Limpiar el callback guardado
          sessionStorage.removeItem('globodain_logout_callback');
          // Redirigir a la URL del callback (decodificar primero)
          const decodedCallback = decodeURIComponent(savedCallback);
          navigate(decodedCallback, { replace: true });
          return;
        }
      }
      
      // Si no hay callback o no venimos del SSO, redirigir a la página principal
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000); // 2 segundos de espera
      
      return () => clearTimeout(timer);
    }
  }, [isLoggingOut, isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md text-center">
        {isLoggingOut ? (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Cerrando sesión...</h1>
            <p className="text-gray-600">
              Por favor espera mientras cerramos tu sesión.
            </p>
          </>
        ) : (
          <>
            <div className="mb-6 text-green-500">
              <svg 
                className="mx-auto h-16 w-16" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Sesión cerrada</h1>
            <p className="text-gray-600 mb-6">
              Has cerrado sesión correctamente. Serás redirigido a la página principal.
            </p>
            <button 
              onClick={() => navigate('/', { replace: true })}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Ir al inicio
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LogoutPage;