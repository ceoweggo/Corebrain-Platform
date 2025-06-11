import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';

/**
 * Componente para manejar el callback después del login en el SSO
 */
const SSOCallback = () => {
  const { handleCallback, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

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
        setError(err.message);
      }
    };

    processCallback();
  }, [searchParams, handleCallback, navigate]);

  if (loading) {
    return <div>Procesando autenticación...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Error de autenticación</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  return <div>Redirigiendo...</div>;
};

export default SSOCallback;