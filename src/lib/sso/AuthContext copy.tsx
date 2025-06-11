import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import GlobodainSSOAuth from './GlobodainSSOAuth';

// Definición de tipos para el contexto
interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role?: string;
  [key: string]: any; // Para otras propiedades que pueda tener el usuario
}

// Nuevo tipo para la información del token API
interface ApiTokenInfo {
  token: string;
  expires: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  apiToken: ApiTokenInfo | null; // Nuevo campo para el token API
  login: (provider?: string) => void;
  logout: () => Promise<void>;
  handleCallback: (code: string) => Promise<boolean>;
  refreshApiToken: () => Promise<boolean>; // Nueva función para renovar el token API
}

// Importar configuración desde archivo separado o usar valores predeterminados
const ssoConfig = {
  ssoUrl: import.meta.env?.VITE_GLOBODAIN_SSO_URL || 'https://sso.globodain.com',
  clientId: import.meta.env?.VITE_GLOBODAIN_CLIENT_ID || '54861d27-d349-4b6f-abc3-0cfdb22eefab',
  clientSecret: import.meta.env?.VITE_GLOBODAIN_CLIENT_SECRET || '2be63d91-898d-455e-9611-6a3de0b81ba9',
  redirectUri: import.meta.env?.VITE_GLOBODAIN_REDIRECT_URI || 'http://localhost:8080/auth/sso/callback',
  successRedirect: import.meta.env?.VITE_GLOBODAIN_SUCCESS_REDIRECT || '/',
  serviceId: import.meta.env?.VITE_GLOBODAIN_SERVICE_ID || '5',
};

// API Endpoint para tokens
const API_ENDPOINT = import.meta.env?.VITE_API_ENDPOINT || 'https://api.corebrain.ai';

// Crear instancia del cliente SSO
const ssoAuth = new GlobodainSSOAuth(ssoConfig);

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiToken, setApiToken] = useState<ApiTokenInfo | null>(null); // Estado para el token API

  // Nueva función: Obtener token API desde el backend
  const fetchApiToken = async (accessToken: string, user_data: any): Promise<boolean> => {
    try {
      console.log('Solicitando token API con SSO token...');
      console.log("user_data: ", user_data);

      const response = await fetch(`${API_ENDPOINT}/api/auth/sso/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_data: user_data
        })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al obtener token API:', response.status, errorText);
        return false;
      }
  
      const tokenData = await response.json();
      
      console.log('Token API obtenido correctamente:', tokenData);
      
      // Update with the correct property names from your API response
      setApiToken({
        token: tokenData.access_token,
        expires: new Date(Date.now() + 24*60*60*1000).toISOString() // Default 24h if no expiration provided
      });
      
      // Guardar en localStorage para persistencia
      localStorage.setItem('corebrain_api_token', tokenData.access_token);
      localStorage.setItem('corebrain_api_token_expires', new Date(Date.now() + 24*60*60*1000).toISOString());
      
      return true;
    } catch (error) {
      console.error('Error solicitando token API:', error);
      return false;
    }
  };

  // Check if user is already in the database
  const getUserByEmail = async (email: string) => {
    const apiUrl = `http://localhost:5000/api/auth/users/${email}/email`;
    const response = await fetch(`${apiUrl}`);
    return await response.json();
  };

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

  // Verificar sesión al cargar - Modificada para manejar el token API
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const sso_token = localStorage.getItem('globodain_access_token');
        if (sso_token) {
          console.log('Token encontrado, verificando...');
          // Verificar token con Globodain SSO
          const userInfo = await ssoAuth.getUserInfo(sso_token);
          if (userInfo) {
            console.log('Usuario autenticado:', userInfo.email || userInfo.id);

            // Actualizamos el usuario en el contexto con los datos de user_data (API)
            //setUser(user_data);
            setUser(userInfo);
            
            // Verificar si tenemos un token API válido
            const savedApiToken = localStorage.getItem('corebrain_api_token');
            const savedApiTokenExpires = localStorage.getItem('corebrain_api_token_expires');
            
            if (savedApiToken && savedApiTokenExpires) {
              const expiryDate = new Date(savedApiTokenExpires);
              
              if (expiryDate > new Date()) {
                // Token API todavía válido
                console.log('Token API válido encontrado en localStorage');
                setApiToken({
                  token: savedApiToken,
                  expires: savedApiTokenExpires
                });
              } else {
                // Token API expirado, solicitar uno nuevo
                console.log('Token API expirado, solicitando uno nuevo');
                await fetchApiToken(sso_token, userInfo);
              }
            } else {
              // No hay token API, solicitar uno nuevo
              console.log('No hay token API, solicitando uno nuevo');
              await fetchApiToken(sso_token, userInfo);
            }
          } else {
            console.log('Token inválido, intentando refresh');
            // Token inválido, intentar refresh
            const refreshToken = localStorage.getItem('globodain_refresh_token');
            if (refreshToken) {
              const newTokens = await ssoAuth.refreshToken(refreshToken);
              if (newTokens && newTokens.access_token) {
                console.log('Token refrescado con éxito');
                localStorage.setItem('globodain_access_token', newTokens.access_token);
                if (newTokens.refresh_token) {
                  localStorage.setItem('globodain_refresh_token', newTokens.refresh_token);
                }
                const userInfo = await ssoAuth.getUserInfo(newTokens.access_token);
                if (userInfo) {
                  console.log('Usuario autenticado:', userInfo.email || userInfo.id);
                  setUser(userInfo);
                  
                  // Solicitar token de acceso a la API
                  await fetchApiToken(newTokens.access_token);
                } else {
                  console.log('No se pudo obtener información del usuario después de refresh');
                }
              } else {
                console.log('No se pudo refrescar el token');
                // Limpiar tokens inválidos
                localStorage.removeItem('globodain_access_token');
                localStorage.removeItem('globodain_refresh_token');
                localStorage.removeItem('globodain_user');
                // Limpiar también tokens API
                localStorage.removeItem('corebrain_api_token');
                localStorage.removeItem('corebrain_api_token_expires');
              }
            } else {
              console.log('No hay refresh token disponible');
            }
          }
        } else {
          console.log('No se encontró token de acceso');
        }
      } catch (error) {
        console.error('Error verificando sesión:', error);
        setError('Error al verificar la sesión. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Nueva función: Renovar token API
  const refreshApiToken = async (): Promise<boolean> => {
    const accessToken = localStorage.getItem('globodain_access_token');
    if (!accessToken) {
      console.error('No hay token SSO para renovar el token API');
      return false;
    }
    
    return await fetchApiToken(accessToken);
  };

  // Iniciar sesión - Sin cambios
  const login = (provider?: string) => {
    try {
      setError(null);
      // Guardar URL actual para redireccionar después de la autenticación
      localStorage.setItem('globodain_auth_redirect', window.location.pathname);
      
      // Redirigir al SSO
      const loginUrl = ssoAuth.getLoginUrl(provider);
      console.log('Redirigiendo a:', loginUrl);
      window.location.href = loginUrl;
    } catch (err) {
      console.error('Error al iniciar login:', err);
      setError('Error al iniciar el proceso de login.');
    }
  };

  // Cerrar sesión - Modificado para limpiar tokens API
  const logout = async () => {
    setLoading(true);
    try {
      setError(null);
      console.log('Iniciando proceso de cierre de sesión...');
      
      const accessToken = localStorage.getItem('globodain_access_token');
      const refreshToken = localStorage.getItem('globodain_refresh_token');
      console.log('accessToken:', accessToken);
      console.log('refreshToken:', refreshToken);
      
      // Intentar hacer logout en el SSO
      let logoutSuccess = false;
      if (accessToken && refreshToken) {
        try {
          logoutSuccess = await ssoAuth.logout(refreshToken, accessToken);
          console.log('Resultado del logout en SSO:', logoutSuccess ? 'Éxito' : 'Fallido');
          if (logoutSuccess) {
            // Limpiar la sesión local
            console.log('Limpiando sesión local...');
            localStorage.removeItem('globodain_access_token');
            localStorage.removeItem('globodain_refresh_token');
            localStorage.removeItem('globodain_user');
            
            // Limpiar también tokens API
            localStorage.removeItem('corebrain_api_token');
            localStorage.removeItem('corebrain_api_token_expires');
            
            setUser(null);
            setApiToken(null);

            console.log('Redirigiendo a la página de logout...');
            window.location.href = '/auth/logout';
          }
        } catch (e) {
          console.error('Error al realizar logout en SSO:', e);
        }
      }
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setError('Error al cerrar sesión. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Manejar callback del SSO - Modificado para obtener token API
  const handleCallback = async (code: string): Promise<boolean> => {
    setLoading(true);
    try {
      setError(null);
      console.log('Intercambiando código por token...');
      // Intercambiar código por token
      const tokenData = await ssoAuth.exchangeCodeForToken(code);
      
      if (!tokenData || !tokenData.access_token) {
        const errorMsg = 'No se pudo obtener el token de acceso';
        console.error(errorMsg);
        setError(errorMsg);
        return false;
      }
      
      // Guardar tokens en localStorage
      localStorage.setItem('globodain_access_token', tokenData.access_token);
      if (tokenData.refresh_token) {
        localStorage.setItem('globodain_refresh_token', tokenData.refresh_token);
      }
      
      // Obtener información del usuario
      console.log('Obteniendo información del usuario...');
      const userInfo = await ssoAuth.getUserInfo(tokenData.access_token);
      
      if (!userInfo) {
        const errorMsg = 'No se pudo obtener información del usuario';
        console.error(errorMsg);
        setError(errorMsg);
        return false;
      }
      
      console.log('Información de usuario obtenida:', userInfo.email || 'Sin email');
      // Check if user is already in the database
      var user_data = await getUserByEmail(userInfo.email);
      console.log("user_data: ", user_data);
      if (!user_data) {
        // Create user in the database
        user_data = await createUserInAPI(userInfo);
      }

      console.log('Información de usuario de la API obtenida:', user_data);
      
      // Guardar información del usuario
      localStorage.setItem('globodain_user', JSON.stringify(userInfo));
      setUser(userInfo);
      
      // Obtener token API con el token SSO
      console.log('Solicitando token API...');
      const apiTokenSuccess = await fetchApiToken(tokenData.access_token, user_data);
      console.log("Token API obtenido: ", apiTokenSuccess)
      if (!apiTokenSuccess) {
        console.error('No se pudo obtener el token API, pero continuamos con la autenticación SSO');
        return false;
      } else {
        console.log("Token API obtenido correctamente");
        return true;
      }
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido en el proceso de callback';
      console.error('Error en el proceso de callback:', error);
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Valor del contexto - Actualizado con nuevos campos
  const value: AuthContextType = {
    isAuthenticated: !!user,
    user,
    loading,
    error,
    apiToken,
    login,
    logout,
    handleCallback,
    refreshApiToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};