import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubscription } from '@/lib/subscription/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const PRODUCT_PLANS = {
  corebrain: {
    title: 'CoreBrain SDK',
    description: 'Conecta tus bases de datos con tus aplicaciones de forma segura y eficiente',
    plans: [
      {
        id: 'corebrain-basic',
        name: 'Basic',
        price: '29',
        priceDetail: '/mes',
        description: 'Para equipos pequeños y startups',
        features: [
          { name: 'Hasta 3 proyectos', feature: 'projects', limit: 3 },
          { name: 'Hasta 5 API Keys', feature: 'api_keys', limit: 5 },
          { name: 'Generador de código básico', feature: 'code_generator', tier: 'basic' },
          { name: 'Monitorización básica', feature: 'monitoring', tier: 'basic' },
        ],
      },
      {
        id: 'corebrain-pro',
        name: 'Professional',
        price: '99',
        priceDetail: '/mes',
        description: 'Para empresas medianas',
        popular: true,
        features: [
          { name: 'Hasta 10 proyectos', feature: 'projects', limit: 10 },
          { name: 'Hasta 20 API Keys', feature: 'api_keys', limit: 20 },
          { name: 'Generador de código avanzado', feature: 'code_generator', tier: 'pro' },
          { name: 'Monitorización en tiempo real', feature: 'monitoring', tier: 'pro' },
        ],
      },
      {
        id: 'corebrain-enterprise',
        name: 'Enterprise',
        price: '299',
        priceDetail: '/mes',
        description: 'Para grandes organizaciones',
        features: [
          { name: 'Proyectos ilimitados', feature: 'projects', limit: -1 },
          { name: 'API Keys ilimitadas', feature: 'api_keys', limit: -1 },
          { name: 'Generador de código personalizado', feature: 'code_generator', tier: 'enterprise' },
          { name: 'Monitorización avanzada', feature: 'monitoring', tier: 'enterprise' },
        ],
      },
    ],
  },
  // Otros productos aquí...
};

export const SubscriptionPlans = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { subscription, loading } = useSubscription();
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
  const [showDialog, setShowDialog] = React.useState(false);

  if (!productId || !PRODUCT_PLANS[productId]) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Producto no encontrado</h2>
        <p className="text-muted-foreground mb-4">El producto que buscas no está disponible.</p>
        <Button onClick={() => navigate('/')}>Volver al inicio</Button>
      </div>
    );
  }

  const product = PRODUCT_PLANS[productId];
  const currentPlan = subscription?.products?.[productId]?.plan;

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setShowDialog(true);
  };

  const handleConfirmPlan = async () => {
    // Aquí iría la lógica para actualizar el plan
    try {
      const response = await fetch('/api/subscription/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, planId: selectedPlan }),
      });
      
      if (!response.ok) throw new Error('Failed to update subscription');
      
      // Redirigir al dashboard del producto
      navigate(`/${productId}`);
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
        <p className="text-lg text-muted-foreground">{product.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {product.plans.map((plan) => (
          <Card key={plan.id} className={`p-6 ${plan.popular ? 'border-primary' : ''}`}>
            {plan.popular && (
              <Badge className="absolute top-4 right-4">Más popular</Badge>
            )}
            <div className="mb-6">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-4xl font-bold">{plan.price}€</span>
                <span className="text-muted-foreground">{plan.priceDetail}</span>
              </div>
              <p className="mt-2 text-muted-foreground">{plan.description}</p>
            </div>

            <div className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <div key={feature.feature} className="flex items-start">
                  <Check className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>{feature.name}</span>
                </div>
              ))}
            </div>

            <Button
              className="w-full"
              variant={plan.popular ? 'default' : 'outline'}
              disabled={loading || plan.id === currentPlan}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.id === currentPlan ? 'Plan actual' : 'Seleccionar plan'}
            </Button>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cambio de plan</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres cambiar al plan {
                product.plans.find(p => p.id === selectedPlan)?.name
              }?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmPlan}>
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 