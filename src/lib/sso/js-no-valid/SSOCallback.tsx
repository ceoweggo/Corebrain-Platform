// src/auth/SSOCallback.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Componente para manejar el callback después del login en el SSO
 * Este componente es una alternativa al AuthCallback ubicado en pages/auth/callback
 * y se usa dependiendo de la estructura de rutas definida en App.tsx
 */
const SSOCallback: React.FC = () => {
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