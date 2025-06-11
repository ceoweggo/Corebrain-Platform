// src/pages/auth/callback.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Componente para manejar el callback después del login en el SSO
 */
export const AuthCallback: React.FC = () => {
  const { handleCallback, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code');
        if (!code) {
          throw new Error('No se recibió código de autorización');
        }

        // Procesar el código de autorización
        await handleCallback(code);

        // Redirigir a la página guardada antes del login o a la página principal
        const redirectTo = localStorage.getItem('globodain_auth_redirect') || '/';
        localStorage.removeItem('globodain_auth_redirect');
        navigate(redirectTo, { replace: true });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    };

    processCallback();
  }, [searchParams, handleCallback, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-xl text-blue-800">Procesando autenticación...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 p-6 rounded-lg shadow-md text-red-800 max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Error de autenticación</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="animate-pulse text-blue-800 text-xl">
        Redirigiendo...
      </div>
    </div>
  );
};

export default AuthCallback;