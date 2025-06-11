// src/utils/subscriptionUtils.js

/**
 * Verifica si un usuario tiene una suscripción activa
 * @param {Object} user - Objeto de usuario
 * @returns {boolean} - Verdadero si el usuario tiene una suscripción activa
 */
export const hasActiveSubscription = (user) => {
    if (!user || !user.subscription) {
      return false;
    }
    
    return user.subscription.status === 'active';
  };
  
  /**
   * Verifica si un usuario tiene un plan específico
   * @param {Object} user - Objeto de usuario
   * @param {string|string[]} plans - Plan o array de planes a verificar
   * @returns {boolean} - Verdadero si el usuario tiene alguno de los planes especificados
   */
  export const hasSubscriptionPlan = (user, plans) => {
    if (!hasActiveSubscription(user)) {
      return false;
    }
    
    const requiredPlans = Array.isArray(plans) ? plans : [plans];
    
    return requiredPlans.includes(user.subscription.plan);
  };
  
  /**
   * Verifica si la suscripción de un usuario ha expirado
   * @param {Object} user - Objeto de usuario
   * @returns {boolean} - Verdadero si la suscripción ha expirado
   */
  export const isSubscriptionExpired = (user) => {
    if (!user || !user.subscription || !user.subscription.end_date) {
      return true;
    }
    
    if (user.subscription.status === 'expired') {
      return true;
    }
    
    const endDate = new Date(user.subscription.end_date);
    const now = new Date();
    
    return endDate < now;
  };
  
  /**
   * Obtiene los días restantes de la suscripción
   * @param {Object} user - Objeto de usuario
   * @returns {number|null} - Número de días restantes o null si no hay suscripción
   */
  export const getSubscriptionDaysRemaining = (user) => {
    if (!hasActiveSubscription(user) || !user.subscription.end_date) {
      return null;
    }
    
    const endDate = new Date(user.subscription.end_date);
    const now = new Date();
    
    // Si ya expiró, devolver 0
    if (endDate < now) {
      return 0;
    }
    
    // Calcular la diferencia en días
    const diffTime = Math.abs(endDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  /**
   * Formatea el precio de una suscripción
   * @param {number} price - Precio de la suscripción
   * @param {string} currency - Moneda (por defecto EUR)
   * @returns {string} - Precio formateado
   */
  export const formatSubscriptionPrice = (price, currency = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(price);
  };
  
  /**
   * Obtiene el nombre legible de un plan de suscripción
   * @param {string} planId - Identificador del plan
   * @returns {string} - Nombre legible del plan
   */
  export const getPlanName = (planId) => {
    const planNames = {
      basic: 'Básico',
      premium: 'Premium',
      enterprise: 'Empresarial',
      trial: 'Prueba'
    };
    
    return planNames[planId] || planId;
  };
  
  /**
   * Obtiene el estado legible de una suscripción
   * @param {string} status - Estado de la suscripción
   * @returns {string} - Estado legible
   */
  export const getSubscriptionStatusName = (status) => {
    const statusNames = {
      active: 'Activa',
      inactive: 'Inactiva',
      trial: 'Período de prueba',
      expired: 'Expirada',
      cancelled: 'Cancelada'
    };
    
    return statusNames[status] || status;
  };
  
  /**
   * Obtiene la clase CSS para un estado de suscripción
   * @param {string} status - Estado de la suscripción
   * @returns {string} - Clase CSS para el estado
   */
  export const getSubscriptionStatusClass = (status) => {
    const statusClasses = {
      active: 'subscription-status-active',
      inactive: 'subscription-status-inactive',
      trial: 'subscription-status-trial',
      expired: 'subscription-status-expired',
      cancelled: 'subscription-status-cancelled'
    };
    
    return statusClasses[status] || 'subscription-status-unknown';
  };
  
  // src/utils/dateUtils.js
  
  /**
   * Formatea una fecha a formato legible
   * @param {Date|string} date - Fecha a formatear
   * @param {Object} options - Opciones de formato
   * @returns {string} - Fecha formateada
   */
  export const formatDate = (date, options = {}) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    
    const formatOptions = { ...defaultOptions, ...options };
    
    return dateObj.toLocaleDateString('es-ES', formatOptions);
  };
  
  /**
   * Formatea una fecha a formato legible con hora
   * @param {Date|string} date - Fecha a formatear
   * @returns {string} - Fecha y hora formateadas
   */
  export const formatDateTime = (date) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return dateObj.toLocaleDateString('es-ES', options);
  };