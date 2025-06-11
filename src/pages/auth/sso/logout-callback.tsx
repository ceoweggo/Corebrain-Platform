import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const LogoutCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>('Finalizando cierre de sesión...');

  useEffect(() => {
    const processLogoutCallback = () => {
      try {
        setStatus('Procesando retorno del SSO...');
        
        // Recuperar el callback guardado
        const savedCallback = sessionStorage.getItem('globodain_logout_callback');
        
        // Redirigir a la página de logout con el indicador de que venimos del SSO
        setTimeout(() => {
          if (savedCallback) {
            // Limpiar el callback guardado (lo limpiará el componente de logout)
            window.location.href = `${ROUTES.LOGOUT}?from_sso=true`;
          } else {
            // Si no hay callback, ir directamente a la página de inicio
            navigate('/', { replace: true });
          }
        }, 1000);
        
      } catch (error) {
        console.error('Error en el callback de logout:', error);
        // En caso de error, redirigir a la página principal
        setTimeout(() => navigate('/', { replace: true }), 2000);
      }
    };

    processLogoutCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-4">{status}</h1>
        <p className="text-muted-foreground">Por favor, espere...</p>
      </div>
    </div>
  );
};

export default LogoutCallback; 