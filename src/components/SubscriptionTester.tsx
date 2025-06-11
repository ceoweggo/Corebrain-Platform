import React from 'react';
import { useSubscription, SUBSCRIPTION_TYPES } from '../auth/subscriptionProvider';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

export const SubscriptionTester = () => {
  const { subscription, changePlan, getCurrentPlan } = useSubscription();

  const handleChangePlan = async (planType: string) => {
    try {
      const success = await changePlan(planType);
      if (success) {
        toast.success(`Plan cambiado a ${planType}`);
      } else {
        toast.error('Error al cambiar el plan');
      }
    } catch (error) {
      toast.error('Error al cambiar el plan');
    }
  };

  const currentPlan = getCurrentPlan();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Probador de Suscripciones</CardTitle>
        <CardDescription>
          Cambia entre diferentes tipos de suscripción para probar funcionalidades
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Plan Actual:</h3>
          <p className="text-sm text-muted-foreground">
            {currentPlan?.name || 'No hay plan activo'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            variant={subscription?.type === SUBSCRIPTION_TYPES.FREE ? "default" : "outline"}
            onClick={() => handleChangePlan(SUBSCRIPTION_TYPES.FREE)}
          >
            Plan Gratuito
          </Button>
          <Button 
            variant={subscription?.type === SUBSCRIPTION_TYPES.BASIC ? "default" : "outline"}
            onClick={() => handleChangePlan(SUBSCRIPTION_TYPES.BASIC)}
          >
            Plan Básico
          </Button>
          <Button 
            variant={subscription?.type === SUBSCRIPTION_TYPES.ENTERPRISE ? "default" : "outline"}
            onClick={() => handleChangePlan(SUBSCRIPTION_TYPES.ENTERPRISE)}
          >
            Plan Enterprise
          </Button>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Detalles del Plan Actual:</h4>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(currentPlan, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}; 