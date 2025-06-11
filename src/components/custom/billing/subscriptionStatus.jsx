import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

/**
 * Componente para mostrar el estado de la suscripción del usuario
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.subscription - Información de la suscripción del usuario
 * @returns {JSX.Element} - Componente renderizado
 */
const SubscriptionStatus = ({ subscription }) => {
  if (!subscription) {
    return (
      <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-orange-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-orange-700">
              No se pudo obtener la información de tu suscripción. 
              <Link to={ROUTES.SUBSCRIBE} className="font-medium underline ml-1">
                Ver planes disponibles
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Formatear la fecha de expiración si existe
  const formatDate = (dateString) => {
    if (!dateString) return 'No expira';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Colores según el tipo de plan
  const getPlanTypeStyles = (type) => {
    const styles = {
      free: {
        bg: 'bg-gray-100',
        border: 'border-gray-300',
        text: 'text-gray-700',
        badge: 'bg-gray-200 text-gray-800'
      },
      basic: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        badge: 'bg-blue-100 text-blue-800'
      },
      pro: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        badge: 'bg-purple-100 text-purple-800'
      },
      enterprise: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        text: 'text-indigo-700',
        badge: 'bg-indigo-100 text-indigo-800'
      }
    };
    
    return styles[type] || styles.free;
  };
  
  const styles = getPlanTypeStyles(subscription.type);
  
  return (
    <div className={`${styles.bg} border ${styles.border} rounded-lg p-6`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <div className="flex items-center mb-2">
            <h3 className="text-xl font-bold text-gray-900">Tu suscripción</h3>
            <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${styles.badge}`}>
              {subscription.features?.name || subscription.type.charAt(0).toUpperCase() + subscription.type.slice(1)}
            </span>
          </div>
          
          <p className={`${styles.text} mb-1`}>
            <span className="font-medium">Estado:</span> {subscription.status === 'active' ? 'Activa' : 'Inactiva'}
          </p>
          
          {subscription.expiresAt && (
            <p className={styles.text}>
              <span className="font-medium">Expira:</span> {formatDate(subscription.expiresAt)}
            </p>
          )}
          
          {subscription.type === 'free' && (
            <p className="mt-3 text-sm text-gray-600">
              Actualiza a un plan de pago para desbloquear más funcionalidades.
            </p>
          )}
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link 
            to={ROUTES.SUBSCRIBE} 
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 
              ${subscription.type === 'free' 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'}`}
          >
            {subscription.type === 'free' ? 'Actualizar plan' : 'Cambiar plan'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;