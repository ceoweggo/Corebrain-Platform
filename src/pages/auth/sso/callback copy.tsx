// src/pages/auth/callback.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/sso/AuthContext';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Iniciando autenticación...');
  const { handleCallback, loading, user } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      try {
        console.log('Manejando callback del SSO');
        setStatus('Procesando autenticación...');
        
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        
        console.log('Código recibido:', code ? 'Sí' : 'No');

        if (!code) {
          throw new Error('No se recibió código de autorización');
        }

        setStatus('Procesando código de autorización...');
        
        // Utilizamos el método handleCallback del contexto de autenticación
        const success = await handleCallback(code);

        if (!success) {
          throw new Error('Error al procesar la autenticación');
        }

        setStatus('Creando usuario en el sistema...');
        
        // Obtener información del usuario del contexto de autenticación
        if (!user) {
          throw new Error('No se pudo obtener la información del usuario');
        }
        
        // Crear usuario en la API local
        let createdUser;
        try {
          createdUser = await createUserInAPI(user);
          console.log('Usuario creado correctamente en la API:', createdUser);
        } catch (userError) {
          console.error('Error creando usuario en API:', userError);
          throw new Error('Error al crear usuario en el sistema: ' + 
            (userError instanceof Error ? userError.message : 'Error desconocido'));
        }
        
        setStatus('Logueando en la aplicación...');


        setStatus('Autenticación exitosa, redirigiendo...');
        
        // Obtener la URL a la que hay que redireccionar
        const nextUrl = localStorage.getItem('globodain_auth_redirect') || '/';
        localStorage.removeItem('globodain_auth_redirect');

        console.log('Usuario autenticado, redirigiendo a:', nextUrl);
        navigate(nextUrl, { replace: true });
      } catch (err) {
        console.error('Error en callback:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    };

    processCallback();
  }, [navigate, handleCallback, user]);

  // Función para crear usuario en la API
  const createUserInAPI = async (userData) => {
    const apiUrl = 'http://localhost:5000/api/auth/users';
    
    // Create random password with 10-14 characters
    let password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        name: userData.first_name + " " + userData.last_name, // Usa el nombre del SSO o genera uno del email
        password: password,
        metadata: {
          sso_user_uuid: userData.uuid || userData.sub, // ID del usuario en el proveedor SSO
        }
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error al crear usuario (${response.status})`);
    }
    
    return await response.json();
  };

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
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Volver al inicio
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