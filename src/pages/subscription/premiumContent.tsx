import React from 'react';
import { useSubscription, SUBSCRIPTION_TYPES } from '../../auth/SubscriptionProvider';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

/**
 * Página que muestra contenido premium según el nivel de suscripción
 */
const PremiumContent = () => {
  const { subscription, hasAccess, hasPlanAccess, loading } = useSubscription();
  
  // Si está cargando, mostrar spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Obtener el nombre del plan actual
  const getPlanName = () => {
    if (!subscription) return 'Free';
    
    const planNames = {
      free: 'Free',
      basic: 'Básico',
      pro: 'Profesional',
      enterprise: 'Empresarial'
    };
    
    return planNames[subscription.type] || 'Free';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Contenido Premium</h1>
        
        {/* Banner de plan actual */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-12 text-center">
          <h2 className="text-2xl font-bold mb-2">
            Tu plan actual: <span className="text-blue-600">{getPlanName()}</span>
          </h2>
          <p className="mb-4 text-gray-600">
            {subscription?.type === SUBSCRIPTION_TYPES.FREE 
              ? 'Actualiza tu plan para acceder a más contenido premium.' 
              : 'Gracias por tu suscripción! Disfruta del contenido premium.'}
          </p>
          
          {subscription?.type === SUBSCRIPTION_TYPES.FREE && (
            <Link
              to={ROUTES.SUBSCRIBE}
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Ver planes disponibles
            </Link>
          )}
        </div>
        
        {/* Sección de contenido básico (para todos) */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contenido básico</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={`basic-${item}`} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">Artículo básico {item}</h3>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies.
                  </p>
                  <a href="#" className="mt-4 inline-block text-blue-600 hover:underline">Leer más</a>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Sección de contenido estándar (para suscriptores Basic+) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Contenido estándar</h2>
            <div className="flex items-center">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mr-2">
                Basic+
              </span>
              {!hasPlanAccess(SUBSCRIPTION_TYPES.BASIC) && (
                <Link to={ROUTES.SUBSCRIBE} className="text-blue-600 hover:underline text-sm">
                  Actualizar
                </Link>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div 
                key={`standard-${item}`} 
                className={`bg-white rounded-lg overflow-hidden ${
                  hasPlanAccess(SUBSCRIPTION_TYPES.BASIC) 
                    ? 'shadow-sm' 
                    : 'shadow-sm opacity-50'
                }`}
              >
                <div className="h-48 bg-blue-100 flex items-center justify-center">
                  <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">Artículo estándar {item}</h3>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies.
                  </p>
                  
                  {hasPlanAccess(SUBSCRIPTION_TYPES.BASIC) ? (
                    <a href="#" className="mt-4 inline-block text-blue-600 hover:underline">Leer más</a>
                  ) : (
                    <div className="mt-4 flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                      <span className="text-gray-500 text-sm">Contenido bloqueado</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Sección de contenido premium (para suscriptores Pro+) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Contenido premium</h2>
            <div className="flex items-center">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mr-2">
                Pro+
              </span>
              {!hasPlanAccess(SUBSCRIPTION_TYPES.PRO) && (
                <Link to={ROUTES.SUBSCRIBE} className="text-blue-600 hover:underline text-sm">
                  Actualizar
                </Link>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div 
                key={`premium-${item}`} 
                className={`bg-white rounded-lg overflow-hidden ${
                  hasPlanAccess(SUBSCRIPTION_TYPES.PRO) 
                    ? 'shadow-sm' 
                    : 'shadow-sm opacity-50'
                }`}
              >
                <div className="h-48 bg-purple-100 flex items-center justify-center">
                  <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">Artículo premium {item}</h3>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies.
                  </p>
                  
                  {hasPlanAccess(SUBSCRIPTION_TYPES.PRO) ? (
                    <a href="#" className="mt-4 inline-block text-purple-600 hover:underline">Leer más</a>
                  ) : (
                    <div className="mt-4 flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                      <span className="text-gray-500 text-sm">Contenido bloqueado</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Sección de contenido enterprise (solo para suscriptores Enterprise) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Contenido exclusivo</h2>
            <div className="flex items-center">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mr-2">
                Enterprise
              </span>
              {!hasPlanAccess(SUBSCRIPTION_TYPES.ENTERPRISE) && (
                <Link to={ROUTES.SUBSCRIBE} className="text-blue-600 hover:underline text-sm">
                  Actualizar
                </Link>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div 
                key={`enterprise-${item}`} 
                className={`bg-white rounded-lg overflow-hidden ${
                  hasPlanAccess(SUBSCRIPTION_TYPES.ENTERPRISE) 
                    ? 'shadow-sm' 
                    : 'shadow-sm opacity-50'
                }`}
              >
                <div className="h-48 bg-indigo-100 flex items-center justify-center">
                  <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">Artículo exclusivo {item}</h3>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies.
                  </p>
                  
                  {hasPlanAccess(SUBSCRIPTION_TYPES.ENTERPRISE) ? (
                    <a href="#" className="mt-4 inline-block text-indigo-600 hover:underline">Leer más</a>
                  ) : (
                    <div className="mt-4 flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                      <span className="text-gray-500 text-sm">Contenido bloqueado</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PremiumContent;