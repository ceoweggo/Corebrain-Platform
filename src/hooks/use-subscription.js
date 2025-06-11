import { API_ENDPOINT } from '../utils/constants';

/**
 * Obtiene la información de suscripción del usuario actual
 * @param {string} token - Token de API para autenticación
 * @returns {Promise<Object>} - Datos de la suscripción
 */
export const fetchUserSubscription = async (token) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/api/subscriptions/current`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        // El usuario no tiene una suscripción, se le asignará la gratuita por defecto
        return null;
      }
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener la suscripción:', error);
    throw error;
  }
};

/**
 * Actualiza la suscripción del usuario a un nuevo plan
 * @param {string} token - Token de API para autenticación
 * @param {string} planType - Tipo de plan al que se quiere cambiar
 * @returns {Promise<Object>} - Datos de la suscripción actualizada
 */
export const updateSubscription = async (token, planType) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/api/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ planType })
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar la suscripción:', error);
    throw error;
  }
};

/**
 * Procesa el pago de una suscripción
 * @param {string} token - Token de API para autenticación
 * @param {string} planType - Tipo de plan que se está pagando
 * @param {Object} paymentDetails - Detalles del pago
 * @returns {Promise<Object>} - Resultado del procesamiento del pago
 */
export const processSubscriptionPayment = async (token, planType, paymentDetails) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/api/subscriptions/payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        planType,
        paymentMethod: paymentDetails.paymentMethod,
        cardDetails: {
          last4: paymentDetails.cardDetails.last4,
          brand: paymentDetails.cardDetails.brand,
          expiryMonth: paymentDetails.cardDetails.expiryMonth,
          expiryYear: paymentDetails.cardDetails.expiryYear
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    throw error;
  }
};

/**
 * Cancela la suscripción actual del usuario
 * @param {string} token - Token de API para autenticación
 * @returns {Promise<Object>} - Resultado de la cancelación
 */
export const cancelSubscription = async (token) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/api/subscriptions/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al cancelar la suscripción:', error);
    throw error;
  }
};

/**
 * Obtiene el historial de facturación del usuario
 * @param {string} token - Token de API para autenticación
 * @returns {Promise<Array>} - Lista de facturas
 */
export const getBillingHistory = async (token) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/api/subscriptions/billing`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener el historial de facturación:', error);
    throw error;
  }
};