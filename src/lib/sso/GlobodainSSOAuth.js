// src/lib/GlobodainSSOAuth.js
import GlobodainSSOClient from './GlobodainSSOClient';

class GlobodainSSOAuth {
  /**
   * @param {object} config - Configuración del servicio SSO
   * @param {string} config.ssoUrl - URL base del servicio SSO
   * @param {string} config.clientId - ID de cliente del servicio
   * @param {string} config.clientSecret - Secreto de cliente del servicio
   * @param {string} config.redirectUri - URI de redirección para OAuth
   * @param {string} config.successRedirect - URL a la que redirigir después del login exitoso
   * @param {number|string} config.serviceId - ID numérico del servicio en el SSO
   */
  constructor(config) {
    // Crear instancia del cliente SSO asegurando el orden correcto de los parámetros
    this.client = new GlobodainSSOClient(
      config.ssoUrl,
      config.clientId,
      config.clientSecret,
      config.redirectUri,
      config.serviceId
    );
    
    // Guardar la URL de éxito para redirecciones post-login
    this.successRedirect = config.successRedirect;
    
    // Log para debugging
    console.log("GlobodainSSOAuth inicializado con:");
    console.log("- URL SSO:", config.ssoUrl);
    console.log("- Cliente ID:", config.clientId);
    console.log("- ID de servicio:", config.serviceId);
  }

  /**
   * Obtener URL para iniciar sesión
   * @param {string|null} provider - Proveedor de OAuth opcional
   * @returns {string} URL de login
   */
  getLoginUrl(provider = null) {
    const url = this.client.getLoginUrl(provider);
    console.log("URL de login generada:", url);
    return url;
  }

  /**
   * Intercambiar código por token
   * @param {string} code - Código de autorización
   * @returns {Promise<object|null>} Datos del token o null si hay error
   */
  async exchangeCodeForToken(code) {
    console.log("Solicitando intercambio de código por token:", code);
    try {
      const result = await this.client.exchangeCodeForToken(code);
      console.log("Intercambio de token completado:", result ? "Éxito" : "Fallido");
      return result;
    } catch (error) {
      console.error("Error en exchangeCodeForToken:", error);
      return null;
    }
  }

  /**
   * Obtener información del usuario
   * @param {string} token - Token de acceso
   * @returns {Promise<object|null>} Información del usuario o null si hay error
   */
  async getUserInfo(token) {
    try {
      console.log("Solicitando información de usuario con token");
      const userInfo = await this.client.verifyToken(token);
      console.log("Información de usuario obtenida:", userInfo ? "Éxito" : "Fallido");
      return userInfo;
    } catch (error) {
      console.error('Error obteniendo información del usuario:', error.message);
      return null;
    }
  }

  /**
   * Refrescar token
   * @param {string} refreshToken - Token de refresco
   * @returns {Promise<object|null>} Nuevos tokens o null si hay error
   */
  async refreshToken(refreshToken) {
    try {
      console.log("Solicitando refresh de token");
      const result = await this.client.refreshToken(refreshToken);
      console.log("Refresh de token completado:", result ? "Éxito" : "Fallido");
      return result;
    } catch (error) {
      console.error('Error refrescando token:', error.message);
      return null;
    }
  }

  /**
   * Cerrar sesión
   * @param {string} refreshToken - Token de refresco
   * @param {string} accessToken - Token de acceso
   * @returns {Promise<boolean>} True si se cerró sesión correctamente
   */
  async logout(refreshToken, accessToken) {
    try {
      const result = await this.client.logout(refreshToken, accessToken);
      return result;
    } catch (error) {
      console.error('Error cerrando sesión:', error.message);
      return false;
    }
  }
}

export default GlobodainSSOAuth;