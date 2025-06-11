import React from 'react';
import { useBilling } from '@/auth/BillingContext';
import { SubscriptionType, ProductType, IndustryVertical } from '@/types/billing';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

const SubscriptionPlans = () => {
  const { billingState, setBillingState } = useBilling();

  const plans = [
    {
      type: SubscriptionType.FREE,
      name: 'Free',
      price: 0,
      description: 'Perfecto para empezar y probar las funcionalidades básicas',
      features: [
        'CoreBrain básico',
        '1 proyecto',
        'Exportación JSON',
        'Soporte por email',
        '100K tokens/mes (GPT-3.5)',
        '20 API calls/día',
        '50 consultas/mes',
        '500MB almacenamiento'
      ]
    },
    {
      type: SubscriptionType.BASIC,
      name: 'Basic',
      price: 19.99,
      description: 'Ideal para pequeñas empresas y proyectos departamentales',
      features: [
        'CoreBrain completo',
        'ChatConnect básico',
        'Hasta 5 proyectos',
        'Exportación múltiple',
        'Soporte por chat',
        '500K tokens/mes (GPT-3.5)',
        '100 API calls/día',
        '500 consultas/mes',
        '2GB almacenamiento'
      ]
    },
    {
      type: SubscriptionType.PRO,
      name: 'Pro',
      price: 49.99,
      description: 'Para empresas medianas y proyectos críticos',
      features: [
        'CoreBrain con GPT-4-Turbo',
        'Todos los productos',
        'Verticales básicas',
        'Soporte telefónico',
        '1M tokens/mes (GPT-4-Turbo)',
        '10K API calls/día',
        '5K consultas/mes',
        '10GB almacenamiento'
      ]
    },
    {
      type: SubscriptionType.ENTERPRISE,
      name: 'Enterprise',
      price: 199.99,
      description: 'Solución completa para grandes empresas y aplicaciones críticas',
      features: [
        'CoreBrain con GPT-4',
        'Verticales avanzadas',
        'API dedicada',
        'Onboarding personalizado',
        '2M tokens/mes (GPT-4)',
        '100K API calls/día',
        '50K consultas/mes',
        '50GB almacenamiento'
      ]
    }
  ];

  const handleSelectPlan = (planType: SubscriptionType) => {
    setBillingState(prev => ({
      ...prev,
      subscriptionType: planType
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Planes de Suscripción</h1>
        <p className="text-xl text-gray-600">
          Elige el plan que mejor se adapte a tus necesidades
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.type}
            className={`relative ${
              billingState.subscriptionType === plan.type
                ? 'border-2 border-primary shadow-lg'
                : ''
            }`}
          >
            {billingState.subscriptionType === plan.type && (
              <Badge className="absolute -top-2 -right-2 bg-primary">
                Seleccionado
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">€{plan.price}</span>
                <span className="text-gray-500">/mes</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={billingState.subscriptionType === plan.type ? "default" : "outline"}
                onClick={() => handleSelectPlan(plan.type)}
              >
                {billingState.subscriptionType === plan.type ? 'Seleccionado' : 'Seleccionar'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button size="lg" className="px-8">
          Continuar con la selección de productos
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionPlans; 