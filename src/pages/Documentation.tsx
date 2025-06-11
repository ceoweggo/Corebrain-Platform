import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const Documentation = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Documentación</h1>
          <p className="text-muted-foreground">
            Encuentra toda la documentación sobre nuestros productos
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>CoreBrain SDK</CardTitle>
            <CardDescription>
              Documentación técnica y guías de uso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Contenido de la documentación en construcción...</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}; 