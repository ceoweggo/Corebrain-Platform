// Tipos de suscripción base
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
      'CoreBrain con GPT-3.5 limitado',
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
      'CoreBrain con GPT-3.5',
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
      'CoreBrain con GPT-4-Turbo',
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
      'CoreBrain con GPT-4 completo',
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