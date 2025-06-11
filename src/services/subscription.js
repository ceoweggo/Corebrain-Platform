import { API_ENDPOINT } from '../utils/constants';
import { SUBSCRIPTION_FEATURES } from '../utils/constants';

/**
 * Obtiene la información de suscripción del usuario actual
 * @param {string} token - Token de API para autenticación
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} - Datos de la suscripción
 */
export const fetchUserSubscription = async (token, userId) => {
  try {
    console.log('Fetching subscription for user:', userId);
    console.log('Using token:', token);
    
    const response = await fetch(`${API_ENDPOINT}/v1/subscriptions/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        // El usuario no tiene una suscripción, se le asignará la gratuita por defecto
        console.log('No subscription found for user:', userId);
        return null;
      }
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Subscription data received:', data);
    
    // Procesar los datos para asegurar que los productos estén en el formato esperado
    // Si el objeto tiene productos como array o como string, asegurarse de que sea un array
    if (data && typeof data === 'object') {
      // Si el objeto no tiene productos pero tiene status 'active' y tier 'free' o mayor,
      // añadir 'corebrain' por defecto (para solucionar el problema de productos faltantes)
      if ((!data.products || (Array.isArray(data.products) && data.products.length === 0)) && 
          data.status === 'active' && 
          (data.tier === 'free' || data.tier === 'basic' || data.tier === 'pro' || data.tier === 'enterprise')) {
        console.log('Suscripción activa sin productos detectada, añadiendo corebrain por defecto');
        data.products = ['corebrain'];
      }
      // Si los productos existen como string (en vez de array), convertirlos a array
      else if (typeof data.products === 'string') {
        data.products = [data.products];
      } 
      // Si no hay productos, crear un array vacío
      else if (!data.products) {
        data.products = [];
      }
      // Asegurarse que type exista (usando tier si está disponible)
      data.type = data.tier || data.type || 'free';
    }
    
    console.log('Processed subscription data with products:', data);
    return data;
    
  } catch (error) {
    console.error('Error al obtener la suscripción:', error);
    throw error;
  }
};

/**
 * Actualiza la suscripción del usuario a un nuevo plan
 * @param {string} token - Token de API para autenticación
 * @param {string} planType - Tipo de plan al que se quiere cambiar
 * @param {string} userId - ID del usuario
 * @param {string} product - Producto asociado a la suscripción
 * @returns {Promise<Object>} - Datos de la suscripción actualizada
 */
export const updateSubscription = async (token, planType, userId, product) => {
  try {
    // Obtener el precio del plan seleccionado
    const planFeatures = SUBSCRIPTION_FEATURES[planType];
    if (!planFeatures) {
      throw new Error(`Plan type ${planType} not found`);
    }
    console.log('Updating subscription for user:', userId);
    console.log('Using token:', token);
    console.log('Plan type:', planType);
    console.log('Product:', product);

    // Si se proporciona un producto, asegurarse de que esté en el array de productos
    const products = product ? [product] : [];

    const response = await fetch(`${API_ENDPOINT}/v1/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tier: planType,
        price: planFeatures.price,
        user_id: userId,
        planType, // mantener por compatibilidad
        products // Enviar el array de productos
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Subscription update error:', errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
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
    const response = await fetch(`${API_ENDPOINT}/v1/subscriptions/payment`, {
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
    const response = await fetch(`${API_ENDPOINT}/v1/subscriptions/cancel`, {
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
    const response = await fetch(`${API_ENDPOINT}/v1/subscriptions/billing`, {
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