// src/lib/GlobodainSSOClient.js
class GlobodainSSOClient {
  /**
   * Constructor del cliente SSO de Globodain
   * @param {string} ssoUrl - URL base del servicio SSO
   * @param {string} clientId - ID de cliente del servicio
   * @param {string} clientSecret - Secreto de cliente del servicio
   * @param {string} redirectUri - URI de redirección para OAuth
   * @param {string|number} serviceId - ID del servicio en el SSO
   */
  constructor(ssoUrl, clientId, clientSecret, redirectUri, serviceId) {
    this.ssoUrl = ssoUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.serviceId = serviceId;
    this.tokenExchangeInProgress = false;
    this.lastExchangedCode = null;
    
    // Validación básica de parámetros
    if (!this.ssoUrl) throw new Error('ssoUrl es requerido');
    if (!this.clientId) throw new Error('clientId es requerido');
    if (!this.clientSecret) throw new Error('clientSecret es requerido');
    if (!this.redirectUri) throw new Error('redirectUri es requerido');
    if (!this.serviceId) throw new Error('serviceId es requerido');
    
    console.log('GlobodainSSOClient inicializado');
    console.log('- URL de redirección configurada:', this.redirectUri);
  }

  /**
   * Obtener URL para iniciar sesión
   * @param {string|null} provider - Proveedor de OAuth opcional
   * @returns {string} URL de login
   */
  getLoginUrl(provider = null) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
    });

    if (provider) {
      params.append('provider', provider);
    }

    const url = `${this.ssoUrl}/api/auth/authorize?${params.toString()}`;
    return url;
  }

  /**
   * Intercambiar código por token
   * @param {string} code - Código de autorización
   * @returns {Promise<object|null>} Datos del token o null si hay error
   */
  async exchangeCodeForToken(code) {
    try {
      if (!code) {
        console.error('Código de autorización no proporcionado');
        return null;
      }

      // Evitar procesar el mismo código múltiples veces
      if (this.lastExchangedCode === code) {
        console.warn('Este código ya fue procesado previamente');
        return null;
      }

      // Evitar llamadas duplicadas
      if (this.tokenExchangeInProgress) {
        console.warn('Ya hay un intercambio de token en progreso');
        return null;
      }

      this.tokenExchangeInProgress = true;
      this.lastExchangedCode = code; // Guardar el código procesado

      console.log('Solicitando token con código:', code);
      console.log('URL de solicitud:', `${this.ssoUrl}/api/auth/token`);

      const requestBody = {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
        service_id: parseInt(this.serviceId, 10)
      };
  
      console.log('Cuerpo de la solicitud:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${this.ssoUrl}/api/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Respuesta status:', response.status);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en exchangeCodeForToken. Status:', response.status, 'Mensaje:', errorText);
        throw new Error(`Error al intercambiar código: ${response.status} - ${errorText}`);
      }
  
      const tokenData = await response.json();
      
      // Validación de respuesta
      console.log('Respuesta completa del token:', tokenData);
      
      if (!tokenData.access_token) {
        console.error('La respuesta no contiene access_token');
        return null;
      }
      
      // Si falta refresh_token, registrarlo pero continuar
      if (!tokenData.refresh_token) {
        console.warn('La respuesta no contiene refresh_token');
      }
      
      return tokenData;
    } catch (error) {
      console.error('Error en exchangeCodeForToken:', error);
      return null;
    } finally {
      this.tokenExchangeInProgress = false;
    }
  }

  /**
   * Verificar token con el servidor SSO
   * @param {string} token - Token de acceso
   * @returns {Promise<object|null>} Información del usuario o null si hay error
   */
  async verifyToken(token) {
    try {
      const serviceAuthUrl = `${this.ssoUrl}/api/auth/service-auth?service_id=${this.serviceId}`;
      const response = await fetch(serviceAuthUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error('Error al verificar token. Status:', response.status);
        return null;
      }

      // También obtener la información completa del perfil
      const userProfileResponse = await fetch(`${this.ssoUrl}/api/users/me/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (userProfileResponse.ok) {
        return await userProfileResponse.json();
      } else {
        // Si no podemos obtener el perfil completo, devolvemos la respuesta básica
        return await response.json();
      }
    } catch (error) {
      console.error('Error en verifyToken:', error);
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
      const response = await fetch(`${this.ssoUrl}/api/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token'
        })
      });

      if (!response.ok) {
        console.error('Error al refrescar token. Status:', response.status);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error en refreshToken:', error);
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

      const serviceAuthUrl = `${this.ssoUrl}/api/auth/logout?refresh_token=${refreshToken}`;
      const response = await fetch(serviceAuthUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error en logout:', error);
      return false;
    }
  }
}

export default GlobodainSSOClient;