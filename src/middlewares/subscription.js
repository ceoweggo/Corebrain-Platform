// src/middleware/subscriptionMiddleware.js

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Middleware para proteger rutas que requieren una suscripción activa
 * @param {Object} props - Las propiedades del componente
 * @param {React.ReactNode} props.children - El componente hijo a renderizar si la suscripción está activa
 * @param {string} [props.redirectTo='/subscription'] - Ruta a la que redirigir si no hay suscripción activa
 * @returns {React.ReactNode} - El componente hijo o un componente Navigate para redirigir
 */
export const SubscriptionRequired = ({ 
  children, 
  redirectTo = '/subscription' 
}) => {
  const { user, isLoading } = useAuth();

  // Si aún está cargando, muestra un indicador de carga o nada
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Verifica si el usuario tiene una suscripción activa
  const hasActiveSubscription = user?.subscription?.status === 'active';

  // Si no tiene suscripción activa, redirige a la página de suscripción
  if (!hasActiveSubscription) {
    return <Navigate to={redirectTo} />;
  }

  // Si tiene suscripción activa, renderiza el contenido protegido
  return children;
};

/**
 * Middleware para proteger rutas que requieren roles específicos además de suscripción activa
 * @param {Object} props - Las propiedades del componente
 * @param {React.ReactNode} props.children - El componente hijo a renderizar si el usuario tiene el rol requerido
 * @param {string|string[]} props.roles - Rol o roles requeridos para acceder
 * @param {string} [props.redirectTo='/unauthorized'] - Ruta a la que redirigir si no tiene el rol requerido
 * @returns {React.ReactNode} - El componente hijo o un componente Navigate para redirigir
 */
export const RoleAndSubscriptionRequired = ({
  children,
  roles,
  redirectTo = '/unauthorized'
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Convierte roles a array si es un string
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  
  // Verifica si el usuario tiene una suscripción activa y el rol requerido
  const hasActiveSubscription = user?.subscription?.status === 'active';
  const hasRequiredRole = requiredRoles.includes(user?.role);

  if (!hasActiveSubscription) {
    return <Navigate to="/subscription" />;
  }

  if (!hasRequiredRole) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};