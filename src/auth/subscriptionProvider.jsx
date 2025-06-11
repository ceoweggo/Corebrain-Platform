import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '../lib/sso/AuthContext';
import { fetchUserSubscription, updateSubscription } from '../services/subscription';
import { useNavigate } from 'react-router-dom';

// Define los tipos de suscripción
export const SUBSCRIPTION_TYPES = {
  FREE: 'free',
  BASIC: 'basic',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
};

// Define las características disponibles por tipo de suscripción
export const SUBSCRIPTION_FEATURES = {
  [SUBSCRIPTION_TYPES.FREE]: {
    name: 'Gratuito',
    price: 0,
    features: [
      'Acceso básico al dashboard',
      '1 proyecto',
      'Hasta 20 llamadas por día',
      'Bases de datos SQL y NoSQL',
      'Integración de chat básico',
      'Exportación en JSON',
      'Soporte por email'
    ],
    limits: {
      projects: 1,
      apiCalls: 20,
      storage: 500 // MB
    }
  },
  [SUBSCRIPTION_TYPES.BASIC]: {
    name: 'Básico',
    price: 12,
    features: [
      'Acceso completo al dashboard',
      'Hasta 5 proyectos',
      'Hasta 100 llamadas por día',
      'Integración de chat completo',
      'Exportación en JSON, CSV, Excel y PDF',
      'Soporte por email y chat'
    ],
    limits: {
      projects: 5,
      apiCalls: 100,
      storage: 2000 // MB
    }
  },
  [SUBSCRIPTION_TYPES.PRO]: {
    name: 'Profesional',
    price: 21,
    features: [
      'Acceso completo al dashboard',
      'Hasta 10 proyectos (ampliable)',
      'Hasta 500 llamadas por día (ampliable)',
      'Todos los formatos de exportación',
      'Limitación de acceso a los datos',
      'Funciones de administración de equipos (12€/usuario/mes)',
      'Acceso a todas las funciones premium',
      'Herramientas de análisis avanzadas',
      'Soporte telefónico'
    ],
    limits: {
      projects: 999999, // Ilimitado
      apiCalls: 10000,
      storage: 10000 // MB
    }
  },
  [SUBSCRIPTION_TYPES.ENTERPRISE]: {
    name: 'Empresarial',
    price: 49.95,
    features: [
      'Sin límite de proyectos',
      'Hasta 1000 llamadas por día (ampliable)',
      'Gestión de equipos',
      'Limitación de acceso a los datos',
      'API dedicada con mayor límite',
      'Onboarding personalizado',
      'Integración con sistemas empresariales',
      'Funciones de administración de equipos (12€/usuario/mes)',
      'Herramientas de análisis avanzadas y generación de informes',
      'Soporte 24/7',
    ],
    limits: {
      projects: 999999, // Ilimitado
      apiCalls: 100000,
      storage: 50000 // MB
    }
  }
};

// Crear el contexto de suscripción
const SubscriptionContext = createContext(undefined);

export const SubscriptionProvider = ({ children }) => {
  const { user, apiToken, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Obtener la suscripción del usuario al cargar o cuando cambia el usuario/token
  useEffect(() => {
    const getSubscription = async () => {
      if (isAuthenticated && user && apiToken) {
        try {
          setLoading(true);
          setError(null);
          const userSubscription = await fetchUserSubscription(apiToken.token, user.id);
          
          const defaultSubscription = {
            type: SUBSCRIPTION_TYPES.FREE,
            status: 'active',
            expiresAt: null,
            features: SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.FREE].features,
            limits: SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.FREE].limits,
            price: SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.FREE].price,
            startedAt: new Date().toISOString(),
            products: [],
            usage: {
              projects: 0,
              apiCalls: 0,
              storage: 0
            }
          };

          // Siempre establecer una suscripción, ya sea la del usuario o la gratuita por defecto
          if (!userSubscription) {
            console.log("No hay suscripción, usando la gratuita por defecto");
            setSubscription(defaultSubscription);
          } else {
            console.log("Suscripción obtenida de la API:", userSubscription);
            
            // Asegurarse de que los productos estén correctamente definidos y aplicar solución de respaldo
            let products = userSubscription.products || [];
            
            // Si no hay productos pero la suscripción está activa, añadir corebrain por defecto
            if (products.length === 0 && userSubscription.status === 'active' && 
                (userSubscription.tier === 'free' || userSubscription.tier === 'basic' || 
                 userSubscription.tier === 'pro' || userSubscription.tier === 'enterprise')) {
              console.log("Suscripción activa sin productos detectada, añadiendo corebrain por defecto");
              products = ['corebrain'];
            }
            
            // Para depuración
            console.log("Productos en la suscripción (después de normalización):", products);
            
            // Crear la suscripción con los datos normalizados
            const normalizedSubscription = {
              ...defaultSubscription,
              ...userSubscription,
              // Usar el tipo correcto (convertir 'tier' a 'type' si es necesario)
              type: userSubscription.tier || userSubscription.type || SUBSCRIPTION_TYPES.FREE,
              // Asegurar que los productos estén como array y se conserven
              products: products,
              features: SUBSCRIPTION_FEATURES[userSubscription.tier || userSubscription.type || SUBSCRIPTION_TYPES.FREE].features,
              limits: SUBSCRIPTION_FEATURES[userSubscription.tier || userSubscription.type || SUBSCRIPTION_TYPES.FREE].limits,
              price: SUBSCRIPTION_FEATURES[userSubscription.tier || userSubscription.type || SUBSCRIPTION_TYPES.FREE].price
            };
            
            console.log("Suscripción normalizada:", normalizedSubscription);
            setSubscription(normalizedSubscription);
          }
        } catch (err) {
          console.error('Error al obtener la suscripción:', err);
          setError('No se pudo obtener la información de tu suscripción.');
          // En caso de error, establecer la suscripción gratuita por defecto
          setSubscription({
            type: SUBSCRIPTION_TYPES.FREE,
            status: 'active',
            expiresAt: null,
            features: SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.FREE].features,
            limits: SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.FREE].limits,
            price: SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.FREE].price,
            startedAt: new Date().toISOString(),
            products: [],
            usage: {
              projects: 0,
              apiCalls: 0,
              storage: 0
            }
          });
        } finally {
          setLoading(false);
        }
      } else {
        // Si no está autenticado, no hay suscripción
        setSubscription(null);
        setLoading(false);
      }
    };

    getSubscription();
  }, [isAuthenticated, user, apiToken]);

  // Función para cambiar de plan
  const changePlan = async (newPlanType, product) => {
    if (!isAuthenticated || !apiToken || !user) {
      setError('Debes iniciar sesión para cambiar tu plan');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      // Actualizar la suscripción en el backend (la API gestiona todo el flujo, incluido Stripe)
      const updatedSubscription = await updateSubscription(apiToken.token, newPlanType, user.id, product);
      if (updatedSubscription) {
        setSubscription(updatedSubscription);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error al cambiar el plan:', err);
      setError('No se pudo actualizar tu plan. Por favor, intenta nuevamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Verificar si un usuario tiene acceso a una característica específica
  const hasAccess = (feature) => {
    if (!subscription) return false;
    return subscription.features.includes(feature);
  };

  // Verificar si un usuario tiene un producto específico
  const hasProduct = (product) => {
    if (!subscription) return false;
    return subscription.products?.includes(product) || false;
  };

  // Verificar si un usuario tiene acceso según su plan
  const hasPlanAccess = (requiredPlan) => {
    if (!subscription) return false;
    const planHierarchy = {
      [SUBSCRIPTION_TYPES.FREE]: 0,
      [SUBSCRIPTION_TYPES.BASIC]: 1,
      [SUBSCRIPTION_TYPES.PRO]: 2,
      [SUBSCRIPTION_TYPES.ENTERPRISE]: 3
    };
    return planHierarchy[subscription.type] >= planHierarchy[requiredPlan];
  };

  // Obtener la información del plan actual
  const getCurrentPlan = () => {
    if (!subscription) return SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.FREE];
    return SUBSCRIPTION_FEATURES[subscription.type];
  };

  const value = {
    subscription,
    loading,
    error,
    changePlan,
    hasAccess,
    hasProduct,
    hasPlanAccess,
    getCurrentPlan,
    SUBSCRIPTION_TYPES,
    SUBSCRIPTION_FEATURES
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// Hook para usar el contexto de suscripción
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription debe ser usado dentro de un SubscriptionProvider');
  }
  return context;
};