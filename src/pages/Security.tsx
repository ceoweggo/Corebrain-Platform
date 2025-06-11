import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Key } from 'lucide-react';

export const Security = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Seguridad</h1>
        <p className="text-muted-foreground">
          Gestiona la seguridad de tu cuenta
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>Autenticación</CardTitle>
            </div>
            <CardDescription>
              Configura la autenticación de dos factores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Configurar 2FA
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Sesiones activas</CardTitle>
            </div>
            <CardDescription>
              Revisa y gestiona tus sesiones activas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Ver sesiones
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 