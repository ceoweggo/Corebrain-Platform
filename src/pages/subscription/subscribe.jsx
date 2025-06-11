import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/sso/AuthContext';
import { SUBSCRIPTION_TYPES, useSubscription } from '../../auth/subscriptionProvider';
import { ROUTES } from '../../utils/constants';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  X, 
  RefreshCw, 
  Database, 
  Cpu, 
  Zap,
  Code,
  Cloud,
  Shield,
  Boxes,
  ArrowRight,
  Check,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PaymentForm from '../../components/custom/subscription/paymentForm';
import { toast } from '@/components/ui/use-toast';

const PRODUCTS = {
  COREBRAIN: 'corebrain',
  DATAFLOW: 'dataflow',
  AIENGINE: 'aiengine'
};

const products = [
  {
    id: PRODUCTS.COREBRAIN,
    name: 'Corebrain',
    description: 'Conecta la IA a tu DB, directamente desde tu código',
    icon: Database,
    features: [
      'SDK nativo para múltiples lenguajes',
      'Procesamiento en lenguaje natural',
      'Conexión segura a bases de datos SQL y NoSQL',
      'Cache inteligente',
      'Sincronización en tiempo real',
      'Chatbot personalizable',
      'Integracion multiplataforma (Web, Mobile, Desktop)',
      'Limitación de acceso a tablas/colecciones según roles'
    ],
    popular: true
  },
  {
    id: PRODUCTS.DATAFLOW,
    name: 'DataFlow',
    description: 'Automatiza el flujo de datos entre tus sistemas',
    icon: Boxes,
    features: [
      'Pipelines de datos personalizables',
      'Transformaciones en tiempo real',
      'Monitorización avanzada',
      'Integración con sistemas externos'
    ],
    comingSoon: true
  },
  {
    id: PRODUCTS.AIENGINE,
    name: 'AI Engine',
    description: 'Potencia tus aplicaciones con inteligencia artificial',
    icon: Cpu,
    features: [
      'Modelos pre-entrenados',
      'API de procesamiento de lenguaje natural',
      'Análisis predictivo',
      'Aprendizaje automático personalizado'
    ],
    comingSoon: true,
    disabled: true
  }
];

const Subscribe = () => {
  const { isAuthenticated, user } = useAuth();
  const { 
    subscription, 
    loading, 
    changePlan, 
    getCurrentPlan
  } = useSubscription();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS.COREBRAIN);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [productInstalled, setProductInstalled] = useState(false);
  const [currentProductSubscription, setCurrentProductSubscription] = useState(null);
  const [hasAnyProduct, setHasAnyProduct] = useState(false);

  // Definir hasSubscription antes de cualquier uso
  const hasSubscription = !!subscription;

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate(ROUTES.LOGIN, { state: { from: location } });
    }
  }, [isAuthenticated, loading, navigate, location]);

  useEffect(() => {
    // Check if user has any product installed
    const hasProducts = subscription?.products && Object.keys(subscription.products).length > 0;
    setHasAnyProduct(hasProducts);

    // Debug info sobre la suscripción del usuario
    console.log('--- INFO USUARIO ---');
    console.log('Tipo de suscripción:', subscription?.type);
    console.log('Productos instalados:', subscription?.products ? Object.keys(subscription.products).length : 0);
    console.log('Productos:', subscription?.products);
    if (subscription?.products) {
      Object.entries(subscription.products).forEach(([prod, sub]) => {
        console.log(`Producto: ${prod}, Plan: ${sub?.type}`);
      });
    }
    // Check if the selected product is installed and get its subscription
    if (selectedProduct) {
      const isInstalled = subscription?.products?.[selectedProduct] !== undefined;
      setProductInstalled(isInstalled);
      
      if (isInstalled) {
        // Get the current subscription for the product
        const productSubscription = subscription?.products?.[selectedProduct];
        setCurrentProductSubscription(productSubscription);
      } else {
        setCurrentProductSubscription(null);
      }
    }
  }, [selectedProduct, subscription]);

  const currentPlan = getCurrentPlan();
  
  const plans = [
    {
      id: SUBSCRIPTION_TYPES.FREE,
      name: 'Gratuito',
      price: '0€',
      priceDetail: 'gratis para siempre',
      description: 'Para desarrolladores y proyectos personales',
      features: [
        'Acceso básico al dashboard',
        '1 proyecto',
        'Hasta 1.000 llamadas/mes',
        'Soporte por email'
      ],
      limits: {
        projects: 1,
        apiCalls: 1000,
        storage: '500MB'
      },
      current: subscription?.type === SUBSCRIPTION_TYPES.FREE,
      popular: false,
      available: !hasSubscription || subscription?.type !== SUBSCRIPTION_TYPES.FREE
    },
    {
      id: SUBSCRIPTION_TYPES.BASIC,
      name: 'Básico',
      price: '12€',
      priceDetail: 'por mes',
      description: 'Para particulares y estudiantes',
      features: [
        'Todo lo del plan Gratuito',
        'Hasta 5 proyectos',
        'Hasta 10.000 llamadas/mes',
        'Soporte prioritario',
        'SDK completo'
      ],
      limits: {
        projects: 5,
        apiCalls: 10000,
        storage: '2GB'
      },
      current: subscription?.type === SUBSCRIPTION_TYPES.BASIC,
      popular: false,
      available: !productInstalled || currentProductSubscription?.type === SUBSCRIPTION_TYPES.BASIC
    },
    {
      id: SUBSCRIPTION_TYPES.PRO,
      name: 'Profesional',
      price: '21€',
      priceDetail: 'por mes',
      description: 'Para profesionales y empresas pequeñas',
      features: [
        'Todo lo del plan Básico',
        'Proyectos ilimitados',
        'Hasta 100.000 llamadas/mes',
        'Soporte 24/7',
        'API dedicada',
        'Análisis avanzado'
      ],
      limits: {
        projects: 'Ilimitados',
        apiCalls: 100000,
        storage: '10GB'
      },
      current: subscription?.type === SUBSCRIPTION_TYPES.PRO,
      popular: true,
      available: !productInstalled || currentProductSubscription?.type === SUBSCRIPTION_TYPES.PRO
    },
    {
      id: SUBSCRIPTION_TYPES.ENTERPRISE,
      name: 'Empresarial',
      price: '49.95€',
      priceDetail: 'por mes',
      description: 'Para medianas y grandes organizaciones',
      features: [
        'Todo lo del plan Pro',
        'Llamadas ilimitadas',
        'SLA garantizado',
        'Soporte dedicado',
        'Implementación personalizada',
        'Auditoría de seguridad'
      ],
      limits: {
        projects: 'Ilimitados',
        apiCalls: 'Ilimitadas',
        storage: '100GB'
      },
      current: subscription?.type === SUBSCRIPTION_TYPES.ENTERPRISE,
      popular: false,
      available: !productInstalled || currentProductSubscription?.type === SUBSCRIPTION_TYPES.ENTERPRISE
    }
  ];

  const handlePlanSelect = (planType) => {
    setSelectedPlan(planType);
    if (planType === SUBSCRIPTION_TYPES.FREE) {
      handleFreePlanSelect(selectedProduct);
    } else {
      setShowPaymentForm(true);
    }
  };

  const handleProductSelect = (productId) => {
    setSelectedProduct(productId);
    setShowProductDetails(true);
  };
  
  const handleFreePlanSelect = async (product) => {
    setPaymentProcessing(true);
    setError(null);
    
    try {
      const success = await changePlan(SUBSCRIPTION_TYPES.FREE, product);
      
      if (success) {
        setSuccess('Has actualizado correctamente a la suscripción gratuita.');
        toast({
          title: "Plan actualizado",
          description: "Has cambiado al plan gratuito correctamente.",
          variant: "default",
        });
        setTimeout(() => {
          navigate(ROUTES.DASHBOARD);
        }, 2000);
      } else {
        setError('No se pudo actualizar a la suscripción gratuita.');
        toast({
          title: "Error",
          description: "No se pudo actualizar a la suscripción gratuita.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError('Ha ocurrido un error. Por favor, intenta nuevamente.');
      console.error('Error al seleccionar plan gratuito:', err);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al cambiar de plan.",
        variant: "destructive",
      });
    } finally {
      setPaymentProcessing(false);
    }
  };
  
  const handlePaymentSubmit = async (paymentDetails) => {
    setPaymentProcessing(true);
    setError(null);
    
    try {
      const success = await changePlan(selectedPlan, selectedProduct);
      
      if (success) {
        setSuccess('Tu suscripción ha sido actualizada correctamente.');
        toast({
          title: "Plan actualizado",
          description: "Tu suscripción ha sido actualizada correctamente.",
          variant: "default",
        });
        setShowPaymentForm(false);
        
        setTimeout(() => {
          navigate(ROUTES.DASHBOARD);
        }, 2000);
      } else {
        setError('No se pudo actualizar tu suscripción.');
        toast({
          title: "Error",
          description: "No se pudo actualizar tu suscripción.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError('Error al procesar el pago. Por favor, verifica los datos de tu tarjeta.');
      console.error('Error procesando pago:', err);
      toast({
        title: "Error",
        description: "Error al procesar el pago. Por favor, verifica los datos de tu tarjeta.",
        variant: "destructive",
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos y Servicios</h1>
          <p className="text-muted-foreground text-lg mt-2">
            {hasAnyProduct 
              ? 'Descubre nuestras soluciones para potenciar tus aplicaciones'
              : 'Elige un producto y un plan para comenzar'}
          </p>
          {!hasSubscription && (
            <div className="mt-2 text-yellow-500 text-base">
              No tienes productos ni suscripción activa. Elige un producto y un plan para comenzar.
            </div>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="flex items-center gap-2"
        >
          Volver al escritorio
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {products
          .filter(product => !product.disabled)
          .map((product) => {
            const ProductIcon = product.icon;
            const isInstalled = subscription?.products?.[product.id] !== undefined;
            return (
              <Card 
                key={product.id}
                className={cn(
                  "relative transition-all duration-200 hover:shadow-lg cursor-pointer",
                  product.comingSoon && "opacity-50"
                )}
                onClick={() => !product.comingSoon && handleProductSelect(product.id)}
              >
                {product.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                    Recomendado
                  </div>
                )}
                {product.comingSoon && (
                  <div className="absolute -top-3 right-4 rounded-full bg-secondary px-4 py-1 text-xs font-medium">
                    Próximamente
                  </div>
                )}
                {isInstalled && (
                  <div className="absolute -top-3 right-4 rounded-full bg-green-500 px-4 py-1 text-xs font-medium text-white flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Instalado
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <ProductIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription className="mt-1">{product.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
      </div>

      <Dialog open={showProductDetails} onOpenChange={setShowProductDetails}>
        <DialogContent className="w-[95vw] max-w-[1400px] h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-background z-10 border-b">
            <div className="absolute right-4 top-4">
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Cerrar</span>
                </Button>
              </DialogClose>
            </div>
            <DialogHeader className="text-left pb-4 pr-14">
              <DialogTitle className="text-2xl">
                {products.find(p => p.id === selectedProduct)?.name}
              </DialogTitle>
              <DialogDescription className="text-lg">
                {productInstalled 
                  ? `Actualmente tienes el plan ${currentProductSubscription?.type || 'gratuito'}`
                  : !hasSubscription
                    ? 'No tienes suscripción activa. Selecciona el plan que mejor se adapte a tus necesidades'
                    : 'Selecciona el plan que mejor se adapte a tus necesidades'}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 py-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-lg border p-6 transition-all duration-200 hover:shadow-md flex flex-col h-full",
                  plan.current && "border-primary bg-primary/5",
                  plan.popular && "border-primary border-2 shadow-md",
                  !plan.available && "opacity-50 cursor-not-allowed"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground whitespace-nowrap">
                    Más popular
                  </div>
                )}
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 min-h-[40px]">{plan.description}</p>
                  </div>
                  <div className="mb-4">
                    <div className="text-3xl font-bold">{plan.price}</div>
                    <div className="text-sm text-muted-foreground">{plan.priceDetail}</div>
                  </div>
                  <div className="border-t border-b py-4 flex-grow">
                    <p className="text-sm font-medium mb-3">Incluye:</p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4">
                  
                    <Button
                      className="w-full"
                      variant={(plan.id === subscription?.tier || plan.id === subscription?.type) ? "outline" : "default"}
                      size="lg"
                      onClick={() => handlePlanSelect(plan.id)}
                      disabled={
                        paymentProcessing ||
                        (plan.id === SUBSCRIPTION_TYPES.FREE
                          ? (productInstalled && currentProductSubscription?.type === SUBSCRIPTION_TYPES.FREE)
                          : (plan.id === subscription?.tier || plan.id === subscription?.type) || !plan.available)
                      }
                    >
                      {paymentProcessing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : plan.id === SUBSCRIPTION_TYPES.FREE ? (
                        productInstalled && currentProductSubscription?.type === SUBSCRIPTION_TYPES.FREE
                          ? "Plan actual"
                          : "Seleccionar plan"
                      ) : (plan.id === subscription?.tier || plan.id === subscription?.type) ? (
                        "Plan actual"
                      ) : !plan.available ? (
                        "No disponible"
                      ) : (
                        "Seleccionar plan"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
        <DialogContent className="sm:max-w-[500px] max-h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100" style={{ background: 'rgba(255,255,255,0.98)' }}>
          <div className="absolute right-4 top-4">
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted"
                onClick={() => setShowPaymentForm(false)}
                disabled={paymentProcessing}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
              </Button>
            </DialogClose>
          </div>
          <DialogHeader className="text-left pb-4 pr-14">
            <DialogTitle className="text-2xl">Completar suscripción</DialogTitle>
            <DialogDescription className="text-lg">
              Estás a punto de suscribirte al plan {selectedPlan && plans.find(p => p.id === selectedPlan)?.name} por {selectedPlan && plans.find(p => p.id === selectedPlan)?.price}/mes
            </DialogDescription>
          </DialogHeader>
          
          <PaymentForm 
            onSubmit={handlePaymentSubmit}
            onCancel={() => setShowPaymentForm(false)}
            isProcessing={paymentProcessing}
            planType={selectedPlan}
            planPrice={selectedPlan && plans.find(p => p.id === selectedPlan)?.price}
            error={error}
            success={success}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Subscribe;