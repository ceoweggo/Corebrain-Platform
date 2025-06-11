import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ROUTES } from '../../utils/constants';
import { useSubscription } from '../../auth/subscriptionProvider';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPlan?: string; // Plan mínimo requerido (optional)
  requiredFeature?: string; // Característica específica requerida (optional)
}

const PUBLIC_ROUTES = [
  '/auth/sso/callback',
  '/auth/logout',
  '/auth/subscribe',
  '/subscribe',
  '/login', 
];

/**
 * Componente para proteger rutas según autenticación y nivel de suscripción
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Componentes hijos a renderizar si se cumplen los requisitos
 * @returns {JSX.Element} - Componente renderizado
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children 
}) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const location = useLocation();

  // Logs para depuración
  if (subscription) {
    console.log(
      `[ProtectedRoute] Datos de suscripción disponibles:`,
      `Tipo: ${subscription.type || subscription.tier}`,
      `Estado: ${subscription.status}`,
      `Productos: ${JSON.stringify(subscription.products)}`
    );
  } else {
    console.log("[ProtectedRoute] No hay datos de suscripción disponibles");
  }

  if (authLoading || subscriptionLoading) {
    return <div>Loading...</div>;
  }

  // Si la ruta es pública, permitir acceso siempre
  if (PUBLIC_ROUTES.some(route => location.pathname.startsWith(route))) {
    return children;
  }

  if (!isAuthenticated) {
    // Guarda la ruta actual para redirigir después del login
    localStorage.setItem('globodain_auth_redirect', location.pathname + location.search);
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Logs detallados de subscription para debug
  console.log("subscription completo:", subscription);

  // Verificar productos en la suscripción
  const hasProducts = subscription && 
                     subscription.products && 
                     Array.isArray(subscription.products) && 
                     subscription.products.length > 0;

  console.log("¿Tiene productos?", hasProducts);
  
  // Si es una ruta de producto, verificar si tiene los productos necesarios
  const isProductRoute = location.pathname.includes('/products/');
  if (isProductRoute && !hasProducts) {
    console.log("Redirigiendo a subscribe: ruta de producto pero sin productos");
    return <Navigate to={ROUTES.SUBSCRIBE} replace />;
  }

  // Si el usuario está autenticado y tiene una suscripción,
  // permitir el acceso a la ruta solicitada
  if (subscription) {
    return children;
  }

  // Si por alguna razón no hay suscripción, pero está autenticado, 
  // permitir ver la página actual en lugar de redirigir
  console.log("Usuario autenticado pero sin suscripción, se mantiene en la página:", location.pathname);
  return children;
};

export default ProtectedRoute;