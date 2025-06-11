import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/lib/subscription/SubscriptionContext';
import {
  Database,
  Boxes,
  KeyRound,
  FileCode,
  Gauge,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const CoreBrainDashboard = () => {
  const { subscription } = useSubscription();
  const coreBrainSub = subscription?.products?.corebrain;

  const features = [
    {
      title: 'Proyectos',
      description: 'Gestiona tus proyectos y conexiones a bases de datos',
      icon: Boxes,
      path: '/corebrain/projects',
      feature: 'projects',
    },
    {
      title: 'API Keys',
      description: 'Genera y administra tus claves de API',
      icon: KeyRound,
      path: '/corebrain/api-keys',
      feature: 'api_keys',
    },
    {
      title: 'Generador de código',
      description: 'Genera código automáticamente para tus proyectos',
      icon: FileCode,
      path: '/corebrain/code-generator',
      feature: 'code_generator',
    },
    {
      title: 'Monitorización',
      description: 'Supervisa el rendimiento y uso de tus conexiones',
      icon: Gauge,
      path: '/corebrain/monitoring',
      feature: 'monitoring',
    },
  ];

  if (!coreBrainSub?.active) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="warning" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Suscripción requerida</AlertTitle>
          <AlertDescription>
            Necesitas una suscripción activa para acceder a CoreBrain SDK.
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>CoreBrain SDK</CardTitle>
            <CardDescription>
              Conecta tus bases de datos con tus aplicaciones de forma segura y eficiente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/subscription/plans/corebrain">
                Ver planes disponibles
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">CoreBrain SDK</h1>
        <p className="text-muted-foreground">
          Bienvenido al panel de control de CoreBrain SDK. Aquí podrás gestionar todos los aspectos de tu integración.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => {
          const isFeatureAvailable = coreBrainSub.features?.[feature.feature]?.active;

          return (
            <Card key={feature.path} className={!isFeatureAvailable ? 'opacity-60' : undefined}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <feature.icon className="h-5 w-5 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                  disabled={!isFeatureAvailable}
                >
                  <Link to={feature.path}>
                    <span>Acceder</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {!isFeatureAvailable && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Esta característica no está disponible en tu plan actual.{' '}
                    <Link to="/subscription/plans/corebrain" className="text-primary hover:underline">
                      Actualizar plan
                    </Link>
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}; 