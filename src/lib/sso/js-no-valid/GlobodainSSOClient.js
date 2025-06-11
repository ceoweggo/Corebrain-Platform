// src/auth/GlobodainSSOClient.js
import axios from 'axios';

/**
 * Cliente SDK para servicios de Globodain que se conectan al SSO central (versión React)
 */
class GlobodainSSOClient {
  /**
   * Inicializar el cliente SSO
   * 
   * @param {string} ssoUrl - URL base del servicio SSO (ej: https://sso.globodain.com)
   * @param {string} clientId - ID de cliente del servicio
   * @param {string} clientSecret - Secreto de cliente del servicio 
   * @param {number} serviceId - ID numérico del servicio en la plataforma SSO
   * @param {string} redirectUri - URI de redirección para OAuth
   */
  constructor(ssoUrl, clientId, clientSecret, serviceId, redirectUri) {
    this.ssoUrl = ssoUrl.endsWith('/') ? ssoUrl.slice(0, -1) : ssoUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.serviceId = serviceId;
    this.redirectUri = redirectUri;
    this.tokenCache = {}; // Cache de tokens verificados
  }

  /**
   * Obtener URL para iniciar sesión en SSO
   * 
   * @param {string|null} provider - Proveedor de OAuth (google, microsoft, github) o null para login normal
   * @returns {string} URL para redireccionar al usuario
   */
  getLoginUrl(provider = null) {
    if (provider) {
      return `${this.ssoUrl}/api/auth/oauth/${provider}?service_id=${this.serviceId}`;
    } else {
      const params = new URLSearchParams({
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        response_type: 'code',
      });
      return `${this.ssoUrl}/api/auth/authorize?${params.toString()}`;
    }
  }

  /**
   * Verifica un token de acceso y obtiene información del usuario
   * 
   * @param {string} token - Token JWT a verificar
   * @returns {Promise<Object>} Información del usuario si el token es válido
   * @throws {Error} Si el token no es válido
   */
  async verifyToken(token) {
    // Verificar si ya tenemos información cacheada y válida del token
    const now = new Date();
    if (this.tokenCache[token]) {
      const cacheData = this.tokenCache[token];
      if (new Date(cacheData.expiresAt) > now) {
        return cacheData.userInfo;
      } else {
        // Eliminar token expirado del caché
        delete this.tokenCache[token];
      }
    }

    try {
      // Verificar token con el servicio SSO
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(
        `${this.ssoUrl}/api/auth/service-auth`,
        { service_id: this.serviceId },
        { headers }
      );

      if (response.status !== 200) {
        throw new Error(`Token inválido: ${response.data}`);
      }

      // Obtener información del usuario
      const userResponse = await axios.get(
        `${this.ssoUrl}/api/users/me`,
        { headers }
      );

      if (userResponse.status !== 200) {
        throw new Error(`Error al obtener información del usuario: ${userResponse.data}`);
      }

      const userInfo = userResponse.data;

      // Guardar en caché (15 minutos)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);
      
      this.tokenCache[token] = {
        userInfo: userInfo,
        expiresAt: expiresAt
      };

      return userInfo;
    } catch (error) {
      throw new Error(`Error al verificar token: ${error.message}`);
    }
  }

  /**
   * Autenticar un token para usarlo con este servicio específico
   * 
   * @param {string} token - Token JWT obtenido del SSO
   * @returns {Promise<Object>} Nuevo token específico para el servicio
   * @throws {Error} Si hay un error en la autenticación
   */
  async authenticateService(token) {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(
        `${this.ssoUrl}/api/auth/service-auth`,
        { service_id: this.serviceId },
        { headers }
      );

      if (response.status !== 200) {
        throw new Error(`Error de autenticación: ${response.data}`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Error al autenticar servicio: ${error.message}`);
    }
  }

  /**
   * Intercambia el código de autorización por un token de acceso
   * 
   * @param {string} code - Código de autorización 
   * @returns {Promise<Object>} Tokens de acceso y refresco
   * @throws {Error} Si hay un error al intercambiar el código
   */
  async exchangeCodeForToken(code) {
    try {
      const response = await axios.post(
        `${this.ssoUrl}/api/auth/token`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri
        }
      );

      if (response.status !== 200) {
        throw new Error(`Error al intercambiar código: ${response.data}`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Error al intercambiar código: ${error.message}`);
    }
  }

  /**
   * Renovar un token de acceso usando refresh token
   * 
   * @param {string} refreshToken - Token de refresco
   * @returns {Promise<Object>} Nuevo token de acceso
   * @throws {Error} Si hay un error al renovar el token
   */
  async refreshToken(refreshToken) {
    try {
      const response = await axios.post(
        `${this.ssoUrl}/api/auth/refresh`,
        { refresh_token: refreshToken }
      );

      if (response.status !== 200) {
        throw new Error(`Error al renovar token: ${response.data}`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Error al renovar token: ${error.message}`);
    }
  }

  /**
   * Obtiene información del usuario con el token
   * 
   * @param {string} token - Token de acceso
   * @returns {Promise<Object|null>} Información del usuario o null si hay error
   */
  async getUserInfo(token) {
    try {
      const response = await axios.get(
        `${this.ssoUrl}/api/users/me/profile`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error(`Error obteniendo info de usuario: ${error.message}`);
      return null;
    }
  }

  /**
   * Cerrar sesión (revoca refresh token)
   * 
   * @param {string} refreshToken - Token de refresco a revocar
   * @param {string} accessToken - Token de acceso válido
   * @returns {Promise<boolean>} True si se cerró sesión correctamente
   * @throws {Error} Si hay un error al cerrar sesión
   */
  async logout(refreshToken, accessToken) {
    try {
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(
        `${this.ssoUrl}/api/auth/logout`,
        { refresh_token: refreshToken },
        { headers }
      );

      if (response.status !== 200) {
        throw new Error(`Error al cerrar sesión: ${response.data}`);
      }

      // Limpiar cualquier token cacheado
      if (accessToken in this.tokenCache) {
        delete this.tokenCache[accessToken];
      }

      return true;
    } catch (error) {
      throw new Error(`Error al cerrar sesión: ${error.message}`);
    }
  }
}

export default GlobodainSSOClient;