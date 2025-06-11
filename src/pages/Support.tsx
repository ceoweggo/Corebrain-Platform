import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export const Support = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Soporte</h1>
          <p className="text-muted-foreground">
            ¿Necesitas ayuda? Estamos aquí para ayudarte
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contacta con soporte</CardTitle>
            <CardDescription>
              Nuestro equipo de soporte está disponible 24/7
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              Iniciar chat
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}; 