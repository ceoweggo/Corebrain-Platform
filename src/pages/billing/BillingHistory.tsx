import React from 'react';
import { useBilling } from '@/auth/BillingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const BillingHistory = () => {
  const { billingHistory, usageLogs, isLoading, error } = useBilling();

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'bg-green-500',
      pending: 'bg-yellow-500',
      failed: 'bg-red-500'
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status === 'paid' ? 'Pagado' : status === 'pending' ? 'Pendiente' : 'Fallido'}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Historial de facturación */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Facturación</CardTitle>
            <CardDescription>
              Registro de todas tus transacciones y facturas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Importe</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell>
                      {format(new Date(bill.date), 'PPP', { locale: es })}
                    </TableCell>
                    <TableCell>{bill.description}</TableCell>
                    <TableCell>€{bill.amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(bill.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Registros de uso */}
        <Card>
          <CardHeader>
            <CardTitle>Registros de Uso</CardTitle>
            <CardDescription>
              Detalle del consumo de recursos y servicios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Métrica</TableHead>
                  <TableHead>Uso</TableHead>
                  <TableHead>Coste</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usageLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.timestamp), 'PPP', { locale: es })}
                    </TableCell>
                    <TableCell>{log.product}</TableCell>
                    <TableCell>{log.metric}</TableCell>
                    <TableCell>{log.usage}</TableCell>
                    <TableCell>€{log.cost.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de consumo actual */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Resumen de Consumo Actual</CardTitle>
          <CardDescription>
            Uso y costes del período actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Tokens</h3>
              <p className="text-2xl font-bold">1,234,567</p>
              <p className="text-sm text-gray-500">de 2,000,000 incluidos</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">API Calls</h3>
              <p className="text-2xl font-bold">45,678</p>
              <p className="text-sm text-gray-500">de 100,000 incluidos</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Almacenamiento</h3>
              <p className="text-2xl font-bold">12.5 GB</p>
              <p className="text-sm text-gray-500">de 50 GB incluidos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingHistory; 