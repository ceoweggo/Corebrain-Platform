// src/auth/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import GlobodainSSOClient from '../GlobodainSSOClient';

// Crear el cliente SSO con la configuración predeterminada
const ssoClient = new GlobodainSSOClient(
  process.env.REACT_APP_GLOBODAIN_SSO_URL || 'https://sso.globodain.com',
  process.env.REACT_APP_GLOBODAIN_CLIENT_ID || '',
  process.env.REACT_APP_GLOBODAIN_CLIENT_SECRET || '',
  process.env.REACT_APP_GLOBODAIN_SERVICE_ID || '5',
  process.env.REACT_APP_GLOBODAIN_REDIRECT_URI || ''
);

// Crear el contexto de autenticación
const AuthContext = createContext(null);

/**
 * Proveedor de contexto de autenticación
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('globodain_user');
        const storedToken = localStorage.getItem('globodain_token');
        
        if (storedUser && storedToken) {
          // Verificar que el token todavía es válido
          try {
            await ssoClient.verifyToken(storedToken);
            setUser(JSON.parse(storedUser));
          } catch (e) {
            // Si el token no es válido, intentar renovarlo si hay refresh token
            const refreshToken = localStorage.getItem('globodain_refresh_token');
            if (refreshToken) {
              try {
                const tokenData = await ssoClient.refreshToken(refreshToken);
                localStorage.setItem('globodain_token', tokenData.access_token);
                if (tokenData.refresh_token) {
                  localStorage.setItem('globodain_refresh_token', tokenData.refresh_token);
                }
                
                const userInfo = await ssoClient.getUserInfo(tokenData.access_token);
                if (userInfo) {
                  setUser(userInfo);
                  localStorage.setItem('globodain_user', JSON.stringify(userInfo));
                }
              } catch (refreshError) {
                // Si no se puede renovar, limpiar almacenamiento
                localStorage.removeItem('globodain_user');
                localStorage.removeItem('globodain_token');
                localStorage.removeItem('globodain_refresh_token');
              }
            } else {
              // No hay refresh token, limpiar almacenamiento
              localStorage.removeItem('globodain_user');
              localStorage.removeItem('globodain_token');
            }
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * Procesa el código de autorización después del redireccionamiento del SSO
   * 
   * @param {string} code - Código de autorización del SSO
   * @returns {Promise<Object>} Información del usuario si el login fue exitoso
   */
  const handleCallback = async (code) => {
    try {
      setLoading(true);
      
      // Intercambiar código por token
      const tokenData = await ssoClient.exchangeCodeForToken(code);
      if (!tokenData) {
        throw new Error("Failed to exchange code for token");
      }
      
      // Guardar tokens
      localStorage.setItem('globodain_token', tokenData.access_token);
      if (tokenData.refresh_token) {
        localStorage.setItem('globodain_refresh_token', tokenData.refresh_token);
      }
      
      // Obtener información del usuario
      const userInfo = await ssoClient.getUserInfo(tokenData.access_token);
      if (userInfo) {
        setUser(userInfo);
        localStorage.setItem('globodain_user', JSON.stringify(userInfo));
        return userInfo;
      } else {
        throw new Error("Failed to get user info");
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inicia el proceso de login redireccionando al SSO
   * 
   * @param {string|null} provider - Proveedor OAuth o null para login normal
   */
  const login = (provider = null) => {
    // Guardar la URL actual para redirigir de vuelta después del login
    localStorage.setItem('globodain_auth_redirect', window.location.pathname);
    window.location.href = ssoClient.getLoginUrl(provider);
  };

  /**
   * Cierra la sesión del usuario
   */
  const logout = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('globodain_token');
      const refreshToken = localStorage.getItem('globodain_refresh_token');
      
      if (accessToken && refreshToken) {
        await ssoClient.logout(refreshToken, accessToken);
      }
      
      // Limpiar almacenamiento local
      localStorage.removeItem('globodain_user');
      localStorage.removeItem('globodain_token');
      localStorage.removeItem('globodain_refresh_token');
      
      // Actualizar estado
      setUser(null);
      
      // Redirigir a página principal
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
      // Aunque haya error, limpiar datos locales
      localStorage.removeItem('globodain_user');
      localStorage.removeItem('globodain_token');
      localStorage.removeItem('globodain_refresh_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    handleCallback,
    ssoClient
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook personalizado para acceder al contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;