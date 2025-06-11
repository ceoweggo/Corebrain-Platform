// API Endpoints
export const API_ENDPOINT = import.meta.env?.VITE_API_ENDPOINT || 'http://localhost:5000';
export const SSO_URL = import.meta.env?.VITE_GLOBODAIN_SSO_URL || 'https://sso.globodain.com';

// Rutas de la aplicación
export const ROUTES = {
  DASHBOARD: '/',
  LOGIN: '/login',
  LOGOUT: '/auth/logout',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  SUBSCRIBE: '/subscribe',
  BILLING: '/billing',
  PREMIUM_CONTENT: '/premium',
  AUTH_CALLBACK: '/auth/sso/callback',
  AUTH_LOGOUT_CALLBACK: '/auth/sso/logout-callback'
};

// Colores de la aplicación
export const COLORS = {
  primary: '#3B82F6', // azul
  secondary: '#10B981', // verde
  warning: '#F59E0B', // ámbar
  danger: '#EF4444', // rojo
  success: '#10B981', // verde
  info: '#3B82F6', // azul
  light: '#F3F4F6', // gris claro
  dark: '#1F2937', // gris oscuro
  white: '#FFFFFF',
  black: '#000000'
};

// Responsive breakpoints
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Tipos de suscripción
export const SUBSCRIPTION_TYPES = {
  FREE: 'free',
  BASIC: 'basic',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
};

// Características detalladas de los planes de suscripción base
export const SUBSCRIPTION_FEATURES = {
  [SUBSCRIPTION_TYPES.FREE]: {
    name: 'Gratuito',
    price: 0,
    features: [
      'Acceso básico al dashboard',
      '1 proyecto',
      'Hasta 20 llamadas por día',
      'Corebrain con GPT-3.5 limitado',
      'Exportación en JSON',
      'Soporte por email'
    ],
    limits: {
      projects: 1,
      apiCalls: 20,
      storage: 500, // MB
      tokens: 100000, // Tokens/mes (GPT-3.5)
      userQueries: 50 // Consultas de usuarios finales/mes
    }
  },
  [SUBSCRIPTION_TYPES.BASIC]: {
    name: 'Básico',
    price: 19.99,
    features: [
      'Acceso completo al dashboard',
      'Hasta 5 proyectos',
      'Hasta 100 llamadas por día',
      'Corebrain con GPT-3.5',
      'ChatConnect básico',
      'Exportación en JSON, CSV, Excel y PDF',
      'Soporte por email y chat'
    ],
    limits: {
      projects: 5,
      apiCalls: 100,
      storage: 2000, // MB
      tokens: 500000, // Tokens/mes (GPT-3.5)
      userQueries: 500 // Consultas de usuarios finales/mes
    }
  },
  [SUBSCRIPTION_TYPES.PRO]: {
    name: 'Profesional',
    price: 49.99,
    features: [
      'Acceso completo al dashboard',
      'Hasta 10 proyectos (ampliable)',
      'Hasta 500 llamadas por día (ampliable)',
      'Corebrain con GPT-4-Turbo',
      'Todos los productos principales',
      'Verticales de industria básico',
      'Limitación de acceso a los datos',
      'Funciones de administración de equipos (14.99€/usuario/mes)',
      'Herramientas de análisis avanzadas',
      'Soporte telefónico'
    ],
    limits: {
      projects: 10,
      apiCalls: 10000,
      storage: 10000, // MB
      tokens: 1000000, // Tokens incluidos/mes (GPT-4-Turbo)
      userQueries: 5000 // Consultas de usuarios finales/mes
    },
    upgradableLimits: true
  },
  [SUBSCRIPTION_TYPES.ENTERPRISE]: {
    name: 'Empresarial',
    price: 199.99,
    features: [
      'Sin límite de proyectos',
      'Hasta 1000 llamadas por día (ampliable)',
      'Corebrain con GPT-4 completo',
      'Acceso completo a todos los productos',
      'Verticales de industria avanzados',
      'API dedicada con mayor límite',
      'Onboarding personalizado',
      'Integración con sistemas empresariales',
      'Funciones de administración de equipos (12.99€/usuario/mes)',
      'Soporte 24/7 (opcional)',
    ],
    limits: {
      projects: 999999, // Ilimitado
      apiCalls: 100000,
      storage: 50000, // MB
      tokens: 2000000, // Tokens incluidos/mes (GPT-4)
      userQueries: 50000 // Consultas de usuarios finales/mes
    },
    upgradableLimits: true
  }
};

// Duración de las animaciones
export const ANIMATION_DURATION = {
  fast: '150ms',
  medium: '300ms',
  slow: '500ms'
};

// Mensajes de error
export const ERROR_MESSAGES = {
  GENERIC: 'Ha ocurrido un error. Por favor, intenta nuevamente.',
  UNAUTHORIZED: 'No tienes autorización para acceder a este recurso.',
  SUBSCRIPTION_REQUIRED: 'Se requiere una suscripción para acceder a esta función.',
  NETWORK: 'Error de conexión. Por favor, verifica tu conexión a internet.',
  PAYMENT_FAILED: 'El pago no pudo ser procesado. Por favor, verifica los datos de tu tarjeta.'
};

// Constantes para las localizaciones
export const LOCALES = {
  ES: 'es-ES',
  EN: 'en-US'
};

// Configuración de fechas
export const DATE_FORMAT = {
  SHORT: {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  },
  LONG: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
};