import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import GlobodainSSOAuth from './GlobodainSSOAuth';

// Definición de tipos para el contexto
interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role?: string;
  active?: boolean;
  subscription?: Subscription; // Añadimos la suscripción al usuario
  [key: string]: any; // Para otras propiedades que pueda tener el usuario
}

// Nuevo tipo para la información del token API
interface ApiTokenInfo {
  token: string;
  expires: string;
}

// Definición de tipos para la suscripción
interface PaymentMethod {
  type: 'credit_card' | 'paypal' | 'bank_transfer' | 'other';
  last_four?: string;
  expiry?: string;
  provider_id?: string;
  additional_info?: any;
}

interface Payment {
  transaction_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  date: string;
}

interface Subscription {
  status: 'active' | 'inactive' | 'trial' | 'expired' | 'cancelled';
  plan: 'basic' | 'premium' | 'enterprise' | 'trial';
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  payment_method?: PaymentMethod;
  features?: string[];
  payment_history?: Payment[];
  updated_at: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  apiToken: ApiTokenInfo | null;
  login: (provider?: string) => void;
  logout: () => Promise<void>;
  handleCallback: (code: string) => Promise<boolean>;
  refreshApiToken: () => Promise<boolean>;
  
  // Nuevas funciones para gestión de suscripciones
  hasActiveSubscription: () => boolean;
  getSubscriptionDetails: () => Subscription | null;
  updateSubscription: (subscriptionData: Subscription) => Promise<Subscription | null>;
  cancelSubscription: () => Promise<boolean>;
  changePlan: (planId: string) => Promise<boolean>;
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
const API_ENDPOINT = import.meta.env?.VITE_API_ENDPOINT || 'https://api.etedata.ai';

// Crear instancia del cliente SSO
const ssoAuth = new GlobodainSSOAuth(ssoConfig);

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiToken, setApiToken] = useState<ApiTokenInfo | null>(null);

  // Función para obtener token API desde el backend
  const fetchApiToken = async (accessToken: string, user_data?: any): Promise<boolean> => {
    try {
      console.log('Solicitando token API con SSO token...');
      console.log("user_data: ", user_data);

      const response = await fetch(`${API_ENDPOINT}/v1/auth/sso/token`, {
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
      
      // Actualizar con la estructura correcta del token
      setApiToken({
        token: tokenData.access_token.access_token, // Acceder al token anidado
        expires: tokenData.access_token.expires_at || new Date(Date.now() + 24*60*60*1000).toISOString()
      });
      
      // Guardar en localStorage para persistencia
      localStorage.setItem('etedata_api_token', tokenData.access_token.access_token);
      localStorage.setItem('etedata_api_token_expires', tokenData.access_token.expires_at || new Date(Date.now() + 24*60*60*1000).toISOString());
      
      return true;
    } catch (error) {
      console.error('Error solicitando token API:', error);
      return false;
    }
  };

  // Check if user is already in the database
  const getUserByEmail = async (email: string) => {
    const apiUrl = `http://localhost:5000/v1/auth/users/${email}/email`;
    try {
      const response = await fetch(`${apiUrl}`);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener usuario por email:', error);
      return null;
    }
  };

  // Función para crear usuario en la API
  const createUserInAPI = async (userData: any) => {
    const apiUrl = 'http://localhost:5000/v1/auth/users';
    
    // Create random password with 10-14 characters
    let password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    try {
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
    } catch (error) {
      console.error('Error al crear usuario en API:', error);
      throw error;
    }
  };

  // Verificar sesión al cargar
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      setError(null);
      try {
        const sso_token = localStorage.getItem('globodain_access_token');
        if (sso_token) {
          // Verificar token con Globodain SSO
          const userInfo = await ssoAuth.getUserInfo(sso_token);
          if (userInfo) {
            // Obtener información completa del usuario desde la API
            let user_data = await getUserByEmail(userInfo.email);
            if (user_data) {
              const combinedUserData = {
                ...userInfo,
                ...user_data,
                id: user_data.id || userInfo.id,
                email: userInfo.email,
                name: user_data.name || (userInfo.first_name + " " + userInfo.last_name) || userInfo.email
              };
              setUser(combinedUserData);
            } else {
              try {
                user_data = await createUserInAPI(userInfo);
                const combinedUserData = {
                  ...userInfo,
                  ...user_data,
                  id: user_data.id || userInfo.id,
                  email: userInfo.email,
                  name: user_data.name || (userInfo.first_name + " " + userInfo.last_name) || userInfo.email
                };
                setUser(combinedUserData);
              } catch (err) {
                console.error('Error creando usuario en la API:', err);
                setUser(userInfo);
              }
            }
            // Verificar si tenemos un token API válido
            const savedApiToken = localStorage.getItem('etedata_api_token');
            const savedApiTokenExpires = localStorage.getItem('etedata_api_token_expires');
            if (savedApiToken && savedApiTokenExpires) {
              const expiryDate = new Date(savedApiTokenExpires);
              if (expiryDate > new Date()) {
                setApiToken({ token: savedApiToken, expires: savedApiTokenExpires });
              } else {
                await fetchApiToken(sso_token, user_data);
              }
            } else {
              await fetchApiToken(sso_token, user_data);
            }
          } else {
            // Token inválido, intentar refresh
            const refreshToken = localStorage.getItem('globodain_refresh_token');
            if (refreshToken) {
              const newTokens = await ssoAuth.refreshToken(refreshToken);
              if (newTokens && newTokens.access_token) {
                localStorage.setItem('globodain_access_token', newTokens.access_token);
                if (newTokens.refresh_token) {
                  localStorage.setItem('globodain_refresh_token', newTokens.refresh_token);
                }
                const userInfo = await ssoAuth.getUserInfo(newTokens.access_token);
                if (userInfo) {
                  const user_data = await getUserByEmail(userInfo.email);
                  if (user_data) {
                    const combinedUserData = {
                      ...userInfo,
                      ...user_data,
                      id: user_data.id || userInfo.id,
                      email: userInfo.email,
                      name: user_data.name || (userInfo.first_name + " " + userInfo.last_name) || userInfo.email
                    };
                    setUser(combinedUserData);
                  } else {
                    setUser(userInfo);
                  }
                  await fetchApiToken(newTokens.access_token, user_data);
                }
              } else {
                // Limpiar tokens inválidos
                localStorage.removeItem('globodain_access_token');
                localStorage.removeItem('globodain_refresh_token');
                localStorage.removeItem('globodain_user');
                localStorage.removeItem('etedata_api_token');
                localStorage.removeItem('etedata_api_token_expires');
                setUser(null);
                setApiToken(null);
              }
            } else {
              // No hay refresh token disponible, usuario no autenticado
              setUser(null);
              setApiToken(null);
            }
          }
        } else {
          // No hay token, usuario no autenticado
          setUser(null);
          setApiToken(null);
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

  // Renovar token API
  const refreshApiToken = async (): Promise<boolean> => {
    const accessToken = localStorage.getItem('globodain_access_token');
    if (!accessToken) {
      console.error('No hay token SSO para renovar el token API');
      return false;
    }
    
    return await fetchApiToken(accessToken);
  };

  // Iniciar sesión
  const login = (provider?: string) => {
    try {
      setError(null);
      console.log('[AuthContext] Iniciando proceso de login...');
      
      // Guardar URL actual para redireccionar después de la autenticación
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem('globodain_auth_redirect', currentPath);
      
      // Limpiar cualquier token expirado que pudiera causar problemas
      const currentToken = localStorage.getItem('globodain_access_token');
      const tokenExpiry = localStorage.getItem('globodain_token_expires');
      
      // Si el token existe y está expirado, limpiarlo
      if (currentToken && tokenExpiry && new Date(tokenExpiry) <= new Date()) {
        console.log('[AuthContext] Limpiando token expirado antes de login');
        localStorage.removeItem('globodain_access_token');
        localStorage.removeItem('globodain_refresh_token');
        localStorage.removeItem('globodain_token_expires');
      }
      
      // Redirigir al SSO
      const loginUrl = ssoAuth.getLoginUrl(provider);
      console.log('[AuthContext] Redirigiendo a:', loginUrl);
      window.location.href = loginUrl;
    } catch (err) {
      console.error('[AuthContext] Error al iniciar login:', err);
      setError('Error al iniciar el proceso de login.');
    }
  };

  // Cerrar sesión
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
            localStorage.removeItem('etedata_api_token');
            localStorage.removeItem('etedata_api_token_expires');
            
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

  // Manejar callback del SSO
  const handleCallback = async (code: string): Promise<boolean> => {
    setLoading(true);
    try {
      setError(null);
      console.log('[AuthContext] Iniciando handleCallback con código:', code);
      
      // Verificar si ya estamos procesando
      if (localStorage.getItem('processing_callback')) {
        console.log('[AuthContext] Ya se está procesando un callback');
        return false;
      }
      
      // Marcar que estamos procesando
      localStorage.setItem('processing_callback', 'true');
      
      console.log('[AuthContext] Intercambiando código por token...');
      // Intercambiar código por token
      const tokenData = await ssoAuth.exchangeCodeForToken(code);
      
      console.log('[AuthContext] Respuesta de exchangeCodeForToken:', tokenData);
      
      if (!tokenData || !tokenData.access_token) {
        const errorMsg = 'No se pudo obtener el token de acceso';
        console.error('[AuthContext] ' + errorMsg);
        console.error('[AuthContext] tokenData:', tokenData);
        setError(errorMsg);
        localStorage.removeItem('processing_callback');
        return false;
      }
      
      // Guardar tokens en localStorage con expiración
      localStorage.setItem('globodain_access_token', tokenData.access_token);
      localStorage.setItem('globodain_token_expires', tokenData.expires_at || 
        new Date(Date.now() + 24*60*60*1000).toISOString());
      
      if (tokenData.refresh_token) {
        localStorage.setItem('globodain_refresh_token', tokenData.refresh_token);
      }
      
      // Obtener información del usuario
      console.log('[AuthContext] Obteniendo información del usuario...');
      const userInfo = await ssoAuth.getUserInfo(tokenData.access_token);
      
      if (!userInfo) {
        const errorMsg = 'No se pudo obtener información del usuario';
        console.error('[AuthContext] ' + errorMsg);
        setError(errorMsg);
        localStorage.removeItem('processing_callback');
        return false;
      }
      
      console.log('[AuthContext] Información de usuario obtenida:', userInfo.email || 'Sin email');
      
      // ... resto del código ...
      
      localStorage.removeItem('processing_callback');
      return true;
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido en el proceso de callback';
      console.error('[AuthContext] Error en el proceso de callback:', error);
      setError(errorMsg);
      localStorage.removeItem('processing_callback');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // NUEVAS FUNCIONES PARA GESTIÓN DE SUSCRIPCIONES
  
  // Verificar si el usuario tiene una suscripción activa
  const hasActiveSubscription = (): boolean => {
    if (!user || !user.subscription) {
      return false;
    }
    
    return user.subscription.status === 'active';
  };

  // Obtener detalles de la suscripción
  const getSubscriptionDetails = (): Subscription | null => {
    return user?.subscription || null;
  };

  // Actualizar la suscripción del usuario
  const updateSubscription = async (subscriptionData: Subscription): Promise<Subscription | null> => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiToken) {
        setError('No hay token de API disponible para actualizar la suscripción');
        return null;
      }
      
      // Realizar la solicitud a la API
      const response = await fetch(`${API_ENDPOINT}/v1/subscription`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${apiToken.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscriptionData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al actualizar la suscripción:', response.status, errorText);
        setError('Error al actualizar la suscripción');
        return null;
      }
      
      const updatedSubscription = await response.json();
      
      // Actualizar el estado del usuario con la nueva información de suscripción
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          subscription: updatedSubscription
        };
      });
      
      return updatedSubscription;
    } catch (error) {
      console.error('Error al actualizar la suscripción:', error);
      setError('Error al actualizar la suscripción');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cancelar la suscripción
  const cancelSubscription = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiToken) {
        setError('No hay token de API disponible para cancelar la suscripción');
        return false;
      }
      
      const response = await fetch(`${API_ENDPOINT}/v1/subscription/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al cancelar la suscripción:', response.status, errorText);
        setError('Error al cancelar la suscripción');
        return false;
      }
      
      const result = await response.json();
      
      // Actualizar el usuario con la suscripción cancelada
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          subscription: result.subscription
        };
      });
      
      return true;
    } catch (error) {
      console.error('Error al cancelar la suscripción:', error);
      setError('Error al cancelar la suscripción');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cambiar el plan de suscripción
  const changePlan = async (planId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiToken) {
        setError('No hay token de API disponible para cambiar el plan');
        return false;
      }
      
      const response = await fetch(`${API_ENDPOINT}/v1/subscription/change-plan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan: planId })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al cambiar el plan:', response.status, errorText);
        setError('Error al cambiar el plan de suscripción');
        return false;
      }
      
      const result = await response.json();
      
      // Actualizar el usuario con el nuevo plan
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          subscription: result.subscription
        };
      });
      
      return true;
    } catch (error) {
      console.error('Error al cambiar el plan:', error);
      setError('Error al cambiar el plan de suscripción');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Valor del contexto - Actualizado con funciones de suscripción
  const value: AuthContextType = {
    isAuthenticated: !!user,
    user,
    loading,
    error,
    apiToken,
    login,
    logout,
    handleCallback,
    refreshApiToken,
    
    // Nuevas funciones para suscripciones
    hasActiveSubscription,
    getSubscriptionDetails,
    updateSubscription,
    cancelSubscription,
    changePlan
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