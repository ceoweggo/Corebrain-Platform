import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Download, 
  Plus, 
  ClipboardCheck, 
  Gift, 
  Clock, 
  ChevronsUpDown,
  CheckCircle,
  Zap,
  AlertCircle,
  RefreshCw,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Importaciones para la funcionalidad de suscripción
import { useSubscription, SUBSCRIPTION_TYPES } from '../auth/subscriptionProvider';
import { useAuth } from '../lib/sso/AuthContext';
import { cancelSubscription, processSubscriptionPayment, getBillingHistory } from '../services/subscription';
import { ROUTES } from '../utils/constants';

// Función auxiliar para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Función para calcular la fecha de renovación (un mes después de la fecha actual)
const calculateRenewalDate = (startDate) => {
  if (!startDate) return formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + 1);
  return formatDate(date);
};

export const Billing = () => {
  const navigate = useNavigate();
  const { user, apiToken } = useAuth();
  const { 
    subscription, 
    loading, 
    changePlan, 
    getCurrentPlan,
    SUBSCRIPTION_FEATURES 
  } = useSubscription();
  
  // Estados para la página
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [processingCancel, setProcessingCancel] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    companyName: '',
    taxId: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'ES'
  });
  const [promoCode, setPromoCode] = useState('');
  const [showNewPlan, setShowNewPlan] = useState(false);
  
  // Obtener historial de facturación al cargar
  useEffect(() => {
    const fetchInvoiceHistory = async () => {
      if (apiToken) {
        try {
          setLoadingInvoices(true);
          const history = await getBillingHistory(apiToken.token);
          setInvoices(history || []);
        } catch (error) {
          console.error('Error al obtener historial de facturas:', error);
          toast.error('No se pudo cargar el historial de facturas');
        } finally {
          setLoadingInvoices(false);
        }
      }
    };

    fetchInvoiceHistory();
  }, [apiToken]);

  // Si no hay facturas en la API, usar datos de ejemplo
  const displayInvoices = invoices.length > 0 ? invoices : [
    { 
      id: 'INV-001', 
      date: formatDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)), 
      amount: `${getCurrentPlan().price}€`, 
      status: 'paid' 
    },
    { 
      id: 'INV-002', 
      date: formatDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)), 
      amount: `${getCurrentPlan().price}€`, 
      status: 'paid' 
    },
    { 
      id: 'INV-003', 
      date: formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), 
      amount: `${getCurrentPlan().price}€`, 
      status: 'paid' 
    },
    { 
      id: 'INV-004', 
      date: formatDate(new Date()), 
      amount: `${getCurrentPlan().price}€`, 
      status: subscription?.status === 'active' ? 'paid' : 'pending' 
    },
  ];

  // Configurar planes disponibles basados en el sistema de suscripción
  const plans = [
    {
      id: SUBSCRIPTION_TYPES.FREE,
      name: SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.FREE].name,
      price: `${SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.FREE].price}€`,
      priceDetail: 'gratis para siempre',
      description: 'Para desarrolladores y proyectos personales',
      features: SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.FREE].features,
      current: subscription?.type === SUBSCRIPTION_TYPES.FREE,
      popular: false
    },
    {
      id: SUBSCRIPTION_TYPES.BASIC,
      name: SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.BASIC].name,
      price: `${SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.BASIC].price}€`,
      priceDetail: 'por mes',
      description: 'Para particulares y estudiantes',
      features: SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.BASIC].features,
      current: subscription?.type === SUBSCRIPTION_TYPES.BASIC,
      popular: true
    },
    {
      id: SUBSCRIPTION_TYPES.PRO,
      name: SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.PRO].name,
      price: `${SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.PRO].price}€`,
      priceDetail: 'por mes',
      description: 'Para profesionales y empresas pequeñas',
      features: SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.PRO].features,
      current: subscription?.type === SUBSCRIPTION_TYPES.PRO,
      popular: true
    },
    {
      id: SUBSCRIPTION_TYPES.ENTERPRISE,
      name: SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.ENTERPRISE].name,
      price: `${SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.ENTERPRISE].price}€`,
      priceDetail: 'por mes',
      description: 'Para medianas y grandes organizaciones',
      features: SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.ENTERPRISE].features,
      current: subscription?.type === SUBSCRIPTION_TYPES.ENTERPRISE,
      popular: false
    }
  ];

  // Calcular información de uso actual
  const currentPlan = getCurrentPlan();
  const usagePercentage = subscription?.usage 
    ? Math.round((subscription.usage.apiCalls / currentPlan.limits.apiCalls) * 100) 
    : 46; // Valor por defecto si no hay datos reales

  // Manejar cambio de plan
  const handlePlanChange = async (planId) => {
    // No hacer nada si ya está en ese plan
    if (subscription?.type === planId) return;
    
    try {
      setProcessingPayment(true);
      
      // Si es un plan de pago y actualmente está en gratuito, mostrar pantalla de pago
      if (planId !== SUBSCRIPTION_TYPES.FREE && subscription?.type === SUBSCRIPTION_TYPES.FREE) {
        // Simular información de pago (en producción esto vendría de un formulario de pago)
        const paymentDetails = {
          paymentMethod: 'credit_card',
          cardDetails: {
            last4: '4242',
            brand: 'visa',
            expiryMonth: '12',
            expiryYear: '2025'
          }
        };
        
        // Procesar el pago con la API
        if (apiToken) {
          try {
            await processSubscriptionPayment(apiToken.token, planId, paymentDetails);
          } catch (error) {
            console.error('Error al procesar el pago:', error);
            toast.error('No se pudo procesar el pago. Por favor, intenta nuevamente.');
            setProcessingPayment(false);
            return;
          }
        }
      }
      
      // Cambiar el plan utilizando el contexto
      const success = await changePlan(planId);
      
      if (success) {
        toast.success(`Has actualizado correctamente a ${SUBSCRIPTION_FEATURES[planId].name}`);
      } else {
        toast.error('No se pudo actualizar el plan. Por favor, intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al cambiar de plan:', error);
      toast.error('Ha ocurrido un error al cambiar de plan');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Manejar cancelación de suscripción
  const handleCancelSubscription = async () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar tu suscripción? Perderás acceso a las funciones premium al final del período de facturación.')) {
      try {
        setProcessingCancel(true);
        
        if (apiToken) {
          await cancelSubscription(apiToken.token);
        }
        
        // Cambiar al plan gratuito
        const success = await changePlan(SUBSCRIPTION_TYPES.FREE);
        
        if (success) {
          toast.success('Suscripción cancelada correctamente');
        } else {
          toast.error('No se pudo cancelar la suscripción');
        }
      } catch (error) {
        console.error('Error al cancelar suscripción:', error);
        toast.error('Ha ocurrido un error al cancelar la suscripción');
      } finally {
        setProcessingCancel(false);
      }
    }
  };

  // Manejar cambios en la información de facturación
  const handleBillingInfoChange = (e) => {
    const { id, value } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [id.replace('billing-', '')]: value
    }));
  };

  // Guardar información de facturación
  const saveBillingInfo = () => {
    // Aquí iría la lógica para guardar en la API
    toast.success('Información de facturación actualizada');
  };
  
  // Manejar aplicación de código promocional
  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      toast.error('Por favor, ingresa un código promocional');
      return;
    }
    
    // Aquí iría la validación del código con la API
    if (promoCode === 'WELCOME10') {
      toast.success('Código promocional aplicado: 10% de descuento');
    } else {
      toast.error('Código promocional inválido');
    }
  };
  
  // Copiar código promocional (simulado para el ejemplo)
  const copyApiKey = () => {
    navigator.clipboard.writeText('WELCOME10');
    toast.success('Código promocional copiado');
  };
  
  // Descargar factura
  const downloadInvoice = (invoiceId) => {
    // Aquí iría la lógica para descargar desde la API
    toast.success(`Factura ${invoiceId} descargada`);
  };

  // Si está cargando, mostrar spinner
  if (loading) {
    return (
      <div className="flex flex-col space-y-4 items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p>Cargando información de suscripción...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Facturación</h1>
        <p className="text-muted-foreground text-lg">
          Gestiona tu suscripción, método de pago e historial de facturas
        </p>
      </div>
      
      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="subscription">Suscripción</TabsTrigger>
          <TabsTrigger value="payment">Pago</TabsTrigger>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscription" className="space-y-6 pt-6">
          <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Plan actual</CardTitle>
                  <CardDescription>
                    {currentPlan.name} - {currentPlan.price}€/mes
                  </CardDescription>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center space-x-2">
                      <Plus size={16} />
                      <span>Cambiar plan</span>
                    </Button>
                  </DialogTrigger>
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
                        <DialogTitle className="text-2xl">Cambiar plan de suscripción</DialogTitle>
                        <DialogDescription className="text-lg">
                          Selecciona el plan que mejor se adapte a tus necesidades
                        </DialogDescription>
                      </DialogHeader>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 py-4 px-2">
                      {plans.map((plan) => (
                        <div
                          key={plan.id}
                          className={cn(
                            "relative rounded-lg border p-4 sm:p-6 transition-all duration-200 hover:shadow-md flex flex-col h-full",
                            plan.current && "border-primary bg-primary/5",
                            plan.popular && "border-primary border-2 shadow-md"
                          )}
                        >
                          {plan.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground whitespace-nowrap">
                              Más popular
                            </div>
                          )}
                          <div className="flex flex-col h-full">
                            <div className="mb-4">
                              <h3 className="text-lg sm:text-xl font-semibold">{plan.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1 min-h-[2.5rem]">{plan.description}</p>
                            </div>
                            <div className="mb-4">
                              <div className="text-2xl sm:text-3xl font-bold">{plan.price}</div>
                              <div className="text-sm text-muted-foreground">{plan.priceDetail}</div>
                            </div>
                            <div className="border-t border-b py-4 flex-grow">
                              <p className="text-sm font-medium mb-3">Incluye:</p>
                              <ul className="space-y-3">
                                {plan.features.map((feature, index) => (
                                  <li key={index} className="flex items-start text-xs sm:text-sm gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                    <span className="text-muted-foreground">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="pt-4">
                              <Button
                                className="w-full"
                                variant={plan.current ? "outline" : "default"}
                                size="lg"
                                onClick={async () => {
                                  await handlePlanChange(plan.id);
                                  setDialogOpen(false);
                                }}
                                disabled={plan.current || processingPayment}
                              >
                                {processingPayment ? (
                                  <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Procesando...
                                  </>
                                ) : plan.current ? (
                                  "Plan actual"
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Uso de API</span>
                    <span className="text-sm text-muted-foreground">
                      {subscription?.usage?.apiCalls || 0} / {currentPlan.limits.apiCalls} llamadas
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${usagePercentage}%` }}
                    />
                  </div>
                </div>
                {subscription?.type !== SUBSCRIPTION_TYPES.FREE && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleCancelSubscription}
                    disabled={processingCancel}
                  >
                    {processingCancel ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Cancelando...
                      </>
                    ) : (
                      "Cancelar suscripción"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md animate-slide-up" style={{animationDelay: '0.3s'}}>
            <CardHeader>
              <div className="flex items-center">
                <Gift className="mr-2 h-5 w-5 text-primary" />
                <CardTitle>Código promocional</CardTitle>
              </div>
              <CardDescription>
                ¿Tienes un código promocional? Aplícalo a tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Ingresa tu código promocional" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button onClick={handleApplyPromoCode}>Aplicar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-6 pt-6">
          <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
            <CardHeader>
              <div className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                <CardTitle>Métodos de pago</CardTitle>
              </div>
              <CardDescription>
                Administra tus métodos de pago
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription?.type !== SUBSCRIPTION_TYPES.FREE ? (
                <div className="p-4 border rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center mr-4">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Visa terminada en 4242</p>
                      <p className="text-sm text-muted-foreground">Expira 12/25</p>
                    </div>
                  </div>
                  <Badge>Predeterminada</Badge>
                </div>
              ) : (
                <div className="p-6 border border-dashed rounded-md text-center">
                  <p className="text-muted-foreground mb-2">No hay métodos de pago registrados</p>
                  <p className="text-sm text-muted-foreground">
                    Añade un método de pago para actualizar a un plan premium
                  </p>
                </div>
              )}
              
              <Button variant="outline" className="w-full flex items-center justify-center">
                <Plus className="mr-2 h-4 w-4" />
                Añadir método de pago
              </Button>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md animate-slide-up" style={{animationDelay: '0.1s'}}>
            <CardHeader>
              <CardTitle>Información de facturación</CardTitle>
              <CardDescription>
                Datos para tus facturas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="billing-companyName">Nombre de empresa</Label>
                  <Input 
                    id="billing-companyName" 
                    value={billingInfo.companyName || "Empresa Demo, S.L."} 
                    onChange={handleBillingInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-taxId">NIF/CIF</Label>
                  <Input 
                    id="billing-taxId" 
                    value={billingInfo.taxId || "B12345678"} 
                    onChange={handleBillingInfoChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billing-address">Dirección</Label>
                <Input 
                  id="billing-address" 
                  value={billingInfo.address || "Calle Principal 123"} 
                  onChange={handleBillingInfoChange}
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="billing-city">Ciudad</Label>
                  <Input 
                    id="billing-city" 
                    value={billingInfo.city || "Madrid"} 
                    onChange={handleBillingInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-postalCode">Código postal</Label>
                  <Input 
                    id="billing-postalCode" 
                    value={billingInfo.postalCode || "28001"} 
                    onChange={handleBillingInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-country">País</Label>
                  <select 
                    id="billing-country" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={billingInfo.country || "ES"}
                    onChange={handleBillingInfoChange}
                  >
                    <option value="ES">España</option>
                    <option value="US">Estados Unidos</option>
                    <option value="FR">Francia</option>
                    <option value="DE">Alemania</option>
                    <option value="IT">Italia</option>
                    <option value="PT">Portugal</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={saveBillingInfo}>Guardar información</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-6 pt-6">
          <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
            <CardHeader>
              <div className="flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                <CardTitle>Historial de facturas</CardTitle>
              </div>
              <CardDescription>
                Ver y descargar facturas anteriores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingInvoices ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : displayInvoices.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Factura</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Importe</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.amount}</TableCell>
                        <TableCell>
                          {invoice.status === 'paid' ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Pagada
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              Pendiente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => downloadInvoice(invoice.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No hay facturas disponibles</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Billing;