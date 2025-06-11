import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/sso/AuthContext';
import { SUBSCRIPTION_TYPES, useSubscription } from '../../auth/subscriptionProvider';
import { ROUTES } from '../../utils/constants';
import PlanCard from '../../components/custom/subscription/planCard';
import PaymentForm from '../../components/custom/subscription/paymentForm';

const Subscribe = () => {
  const { isAuthenticated, user } = useAuth();
  const { 
    subscription, 
    loading, 
    changePlan, 
    getCurrentPlan,
    SUBSCRIPTION_FEATURES
  } = useSubscription();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado para la selección del plan
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Obtener el plan requerido de los parámetros de estado si existe
  useEffect(() => {
    if (location.state?.requiredPlan) {
      setSelectedPlan(location.state.requiredPlan);
    }
  }, [location.state]);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate(ROUTES.LOGIN, { state: { from: location } });
    }
  }, [isAuthenticated, loading, navigate, location]);

  // Obtener el plan actual
  const currentPlan = getCurrentPlan();
  
  // Manejar la selección de un plan
  const handlePlanSelect = (planType) => {
    setSelectedPlan(planType);
    
    if (planType === SUBSCRIPTION_TYPES.FREE) {
      handleFreePlanSelect();
    } else {
      setShowPaymentForm(true);
    }
  };
  
  // Manejar la selección del plan gratuito
  const handleFreePlanSelect = async () => {
    setPaymentProcessing(true);
    setError(null);
    
    try {
      // Cambiar directamente al plan gratuito
      const success = await changePlan(SUBSCRIPTION_TYPES.FREE);
      
      if (success) {
        setSuccess('Has actualizado correctamente a la suscripción gratuita.');
        setTimeout(() => {
          navigate(ROUTES.DASHBOARD);
        }, 2000);
      } else {
        setError('No se pudo actualizar a la suscripción gratuita.');
      }
    } catch (err) {
      setError('Ha ocurrido un error. Por favor, intenta nuevamente.');
      console.error('Error al seleccionar plan gratuito:', err);
    } finally {
      setPaymentProcessing(false);
    }
  };
  
  // Manejar el envío del formulario de pago
  const handlePaymentSubmit = async (paymentDetails) => {
    setPaymentProcessing(true);
    setError(null);
    
    try {
      // Aquí se procesaría el pago con Stripe, PayPal, etc.
      // Simulamos un proceso exitoso
      
      // Actualizar la suscripción en el backend
      const success = await changePlan(selectedPlan);
      
      if (success) {
        setSuccess('Tu suscripción ha sido actualizada correctamente.');
        setShowPaymentForm(false);
        
        // Redirigir al dashboard después de unos segundos
        setTimeout(() => {
          navigate(ROUTES.DASHBOARD);
        }, 2000);
      } else {
        setError('No se pudo actualizar tu suscripción.');
      }
    } catch (err) {
      setError('Error al procesar el pago. Por favor, verifica los datos de tu tarjeta.');
      console.error('Error procesando pago:', err);
    } finally {
      setPaymentProcessing(false);
    }
  };
  
  // Cerrar el formulario de pago
  const handleClosePaymentForm = () => {
    setShowPaymentForm(false);
    setSelectedPlan(null);
  };
  
  // Si está cargando, mostrar spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Elige tu plan</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Selecciona el plan que mejor se adapte a tus necesidades. Puedes cambiar o cancelar en cualquier momento.
          </p>
          
          {location.state?.requiredPlan && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-blue-800 max-w-xl mx-auto">
              <p>Se requiere un plan {SUBSCRIPTION_FEATURES[location.state.requiredPlan].name} o superior para acceder a la funcionalidad solicitada.</p>
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 mx-auto max-w-2xl rounded">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8 mx-auto max-w-2xl rounded">
            <p>{success}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Plan Gratuito */}
          <PlanCard
            plan={SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.FREE]}
            isCurrentPlan={subscription?.type === SUBSCRIPTION_TYPES.FREE}
            onSelect={() => handlePlanSelect(SUBSCRIPTION_TYPES.FREE)}
            highlighted={false}
          />
          
          {/* Plan Básico */}
          <PlanCard
            plan={SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.BASIC]}
            isCurrentPlan={subscription?.type === SUBSCRIPTION_TYPES.BASIC}
            onSelect={() => handlePlanSelect(SUBSCRIPTION_TYPES.BASIC)}
            highlighted={false}
          />
          
          {/* Plan Pro */}
          <PlanCard
            plan={SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.PRO]}
            isCurrentPlan={subscription?.type === SUBSCRIPTION_TYPES.PRO}
            onSelect={() => handlePlanSelect(SUBSCRIPTION_TYPES.PRO)}
            highlighted={true} // Destacamos el plan más popular
          />
          
          {/* Plan Empresarial */}
          <PlanCard
            plan={SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.ENTERPRISE]}
            isCurrentPlan={subscription?.type === SUBSCRIPTION_TYPES.ENTERPRISE}
            onSelect={() => handlePlanSelect(SUBSCRIPTION_TYPES.ENTERPRISE)}
            highlighted={false}
          />
        </div>
        
        {/* Formulario de pago */}
        {showPaymentForm && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-600 mb-4">Completar suscripción</h2>
              <p className="mb-6 text-gray-600">
                Estás a punto de suscribirte al plan {SUBSCRIPTION_FEATURES[selectedPlan].name} por ${SUBSCRIPTION_FEATURES[selectedPlan].price}/mes.
              </p>
              
              <PaymentForm 
                onSubmit={handlePaymentSubmit}
                onCancel={handleClosePaymentForm}
                isProcessing={paymentProcessing}
                planType={selectedPlan}
                planPrice={SUBSCRIPTION_FEATURES[selectedPlan].price}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Subscribe;