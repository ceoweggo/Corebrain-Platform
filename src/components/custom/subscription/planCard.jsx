import React from 'react';

/**
 * Componente para mostrar un plan de suscripción
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.plan - Información del plan
 * @param {boolean} props.isCurrentPlan - Indica si es el plan actual del usuario
 * @param {boolean} props.highlighted - Indica si el plan debe destacarse visualmente
 * @param {Function} props.onSelect - Función a ejecutar cuando se selecciona el plan
 * @returns {JSX.Element} - Componente renderizado
 */
const PlanCard = ({ plan, isCurrentPlan, highlighted, onSelect }) => {
  return (
    <div 
      className={`border bg-white rounded-xl overflow-hidden transition-all duration-300 
        ${highlighted 
          ? 'transform hover:-translate-y-2 shadow-xl border-2 border-blue-500' 
          : 'shadow-lg hover:shadow-xl border border-gray-200'}`}
    >
      <div 
        className={`p-6 ${highlighted ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
      >
        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
        <div className="flex items-end mb-4">
          <span className="text-3xl font-bold">${plan.price}</span>
          {plan.price > 0 && <span className="text-sm ml-1 mb-1">/mes</span>}
        </div>
        
        {highlighted && (
          <span className="inline-block bg-blue-600 text-xs px-3 py-1 rounded-full mb-4">
            Más popular
          </span>
        )}
        
        {isCurrentPlan && (
          <span className="inline-block bg-green-500 text-xs px-3 py-1 rounded-full mb-4">
            Plan actual
          </span>
        )}
      </div>
      
      <div className="p-6">
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={onSelect}
          disabled={isCurrentPlan}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 focus:outline-none
            ${isCurrentPlan 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : highlighted 
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
            }`}
        >
          {isCurrentPlan ? 'Plan actual' : 'Seleccionar plan'}
        </button>
      </div>
    </div>
  );
};

export default PlanCard;