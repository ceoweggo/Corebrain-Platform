// src/pages/auth/callback.tsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/sso/AuthContext';
import { ROUTES } from '../../../utils/constants';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Iniciando autenticación...');
  const { handleCallback, loading, isAuthenticated } = useAuth();
  
  // Usar useRef para evitar múltiples ejecuciones
  const processingRef = useRef(false);
  const processedRef = useRef(false);

  useEffect(() => {
    const processCallback = async () => {
      // Evitar múltiples ejecuciones
      if (processingRef.current || processedRef.current) {
        console.log('Ya se está procesando el callback o ya fue procesado');
        return;
      }
      
      processingRef.current = true;
      
      try {
        console.log('Manejando callback del SSO');
        setStatus('Procesando autenticación...');
        
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        
        console.log('Código recibido:', code ? 'Sí' : 'No');
        console.log('URL completa:', window.location.href);

        if (!code) {
          throw new Error('No se recibió código de autorización');
        }

        // Verificar si este código ya fue procesado
        const lastProcessedCode = sessionStorage.getItem('last_processed_code');
        if (lastProcessedCode === code) {
          console.log('Este código ya fue procesado anteriormente');
          processedRef.current = true;
          // Si ya tenemos un token, redirigir directamente
          if (localStorage.getItem('globodain_access_token')) {
            const redirectTo = localStorage.getItem('globodain_auth_redirect') || ROUTES.DASHBOARD;
            localStorage.removeItem('globodain_auth_redirect');
            navigate(redirectTo, { replace: true });
          }
          return;
        }

        setStatus('Procesando código de autorización...');
        
        const success = await handleCallback(code);

        if (!success) {
          throw new Error('Error al procesar la autenticación');
        }

        // Marcar el código como procesado
        sessionStorage.setItem('last_processed_code', code);
        processedRef.current = true;

        setStatus('Autenticación exitosa, redirigiendo...');
        
        // Esperar un momento para asegurar que el estado se actualice
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirigir a la página previa si existe, si no a dashboard
        const redirectTo = localStorage.getItem('globodain_auth_redirect') || ROUTES.DASHBOARD;
        localStorage.removeItem('globodain_auth_redirect');
        navigate(redirectTo, { replace: true });
        
      } catch (err) {
        console.error('Error en callback:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        // En caso de error, redirigir a login después de un delay
        setTimeout(() => navigate(ROUTES.LOGIN, { replace: true }), 3000);
      } finally {
        processingRef.current = false;
      }
    };

    processCallback();
    
    // Cleanup function
    return () => {
      processingRef.current = false;
    };
  }, []); // Remover todas las dependencias

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-4">{status}</h1>
          <p className="text-muted-foreground">Por favor, espere...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error de autenticación</h1>
          <p className="text-muted-foreground">{error}</p>
          <button 
            onClick={() => navigate(ROUTES.LOGIN)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Volver a intentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-pulse">
          <h1 className="text-2xl font-bold mb-4">Redirigiendo...</h1>
          <p className="text-muted-foreground">Por favor, espere...</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;