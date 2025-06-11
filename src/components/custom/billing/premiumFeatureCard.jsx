import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

/**
 * Componente para mostrar una característica del plan
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la característica
 * @param {string} props.description - Descripción de la característica
 * @param {string} props.icon - Icono a mostrar
 * @param {boolean} props.isPremium - Indica si es una característica premium
 * @param {boolean} props.isAccessible - Indica si el usuario tiene acceso a esta característica
 * @param {string} [props.upgradePlan] - Plan al que se debe actualizar para acceder (si no es accesible)
 * @param {number} [props.limit] - Límite de la característica (si aplica)
 * @param {number} [props.usedValue] - Valor usado de la característica (si aplica)
 * @param {string} [props.unit] - Unidad del límite (si aplica)
 * @param {string} [props.actionLink] - Enlace para la acción principal
 * @param {string} [props.actionText] - Texto para el botón de acción
 * @returns {JSX.Element} - Componente renderizado
 */
const PremiumFeatureCard = ({
  title,
  description,
  icon,
  isPremium,
  isAccessible,
  upgradePlan,
  limit,
  usedValue = 0,
  unit = '',
  actionLink,
  actionText
}) => {
  // Renderizar el icono adecuado
  const renderIcon = () => {
    switch (icon) {
      case 'folder':
        return (
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
          </svg>
        );
      case 'download':
        return (
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
        );
      case 'chart':
        return (
          <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        );
      case 'code':
        return (
          <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
        );
      case 'database':
        return (
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
          </svg>
        );
      case 'users':
        return (
          <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
          </svg>
        );
    }
  };

  // Calcular el porcentaje de uso
  const calculateUsagePercentage = () => {
    if (!limit || limit <= 0) return 0;
    const percentage = (usedValue / limit) * 100;
    return Math.min(percentage, 100); // Asegurarse de que no supere el 100%
  };
  
  const usagePercentage = calculateUsagePercentage();
  
  // Determinar el color de la barra de progreso
  const getProgressBarColor = () => {
    if (usagePercentage < 50) return 'bg-green-500';
    if (usagePercentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border ${isPremium && !isAccessible ? 'border-gray-200 opacity-75' : 'border-gray-200'}`}>
      <div className="flex flex-col h-full">
        <div className="flex items-start mb-4">
          <div className="mr-4">
            {renderIcon()}
          </div>
          <div>
            <div className="flex items-center">
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              {isPremium && (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                  Premium
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
        </div>
        
        {/* Barra de progreso para características con límite */}
        {isAccessible && limit > 0 && (
          <div className="my-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>
                {usedValue} / {limit === 999999 ? '∞' : limit} {unit}
              </span>
              <span>{usagePercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${getProgressBarColor()}`}
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="mt-auto pt-4">
          {isAccessible ? (
            <Link
              to={actionLink || '#'}
              className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              {actionText || 'Ver más'}
            </Link>
          ) : (
            <Link
              to={`${ROUTES.SUBSCRIBE}${upgradePlan ? `?required=${upgradePlan}` : ''}`}
              className="inline-block bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Actualizar para acceder
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatureCard;