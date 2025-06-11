import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SDK() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">SDK</h1>
          <p className="text-muted-foreground">
            Recursos y documentación del SDK de CoreBrain
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Versión actual</CardTitle>
              <CardDescription>
                Versión estable del SDK
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.0.0</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 