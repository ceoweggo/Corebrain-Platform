import React, { useState, useEffect } from 'react';
import { useBilling } from '@/auth/BillingContext';
import { useAuth } from '@/lib/sso/AuthContext';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Users, 
  Activity, 
  TrendingUp, 
  BarChart2, 
  PieChart as PieChartIcon 
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Billing = () => {
  const { billingState, calculateTotalBill, billingHistory, usageLogs } = useBilling();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Prepare data for charts
  const prepareUsageData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    return last30Days.map(date => {
      const dayUsage = usageLogs.filter(log => 
        log.timestamp.startsWith(date)
      ).reduce((acc, log) => {
        acc[log.metric] = (acc[log.metric] || 0) + log.usage;
        return acc;
      }, {});

      return {
        date,
        ...dayUsage
      };
    });
  };

  const prepareProductBreakdown = () => {
    const productUsage = usageLogs.reduce((acc, log) => {
      if (!acc[log.product]) {
        acc[log.product] = {
          usage: 0,
          cost: 0
        };
      }
      acc[log.product].usage += log.usage;
      acc[log.product].cost += log.cost;
      return acc;
    }, {});

    return Object.entries(productUsage).map(([product, data]) => ({
      name: product,
      value: data.cost
    }));
  };

  const prepareUserBreakdown = () => {
    // This would come from your user management system
    return [
      { name: 'Usuarios Base', value: billingState.subscriptionType === 'pro' ? 5 : 3 },
      { name: 'Usuarios Adicionales', value: billingState.addOns?.additionalUsers || 0 }
    ];
  };

  const usageData = prepareUsageData();
  const productBreakdown = prepareProductBreakdown();
  const userBreakdown = prepareUserBreakdown();

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coste Total Mensual</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{calculateTotalBill().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +10% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userBreakdown.reduce((acc, curr) => acc + curr.value, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {userBreakdown[1].value} usuarios adicionales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consumo Total</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(billingState.consumption || {}).reduce((acc, curr) => acc + curr.usage, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +5% desde ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {billingState.selectedProducts?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              de 4 productos disponibles
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <TrendingUp className="h-4 w-4 mr-2" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="usage">
            <Activity className="h-4 w-4 mr-2" />
            Consumo
          </TabsTrigger>
          <TabsTrigger value="products">
            <BarChart2 className="h-4 w-4 mr-2" />
            Productos
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Usuarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Consumo por Producto</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {productBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Usuarios</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#0088FE' : '#00C49F'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} usuarios`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consumo por Día (Últimos 30 días)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {Object.keys(billingState.consumption || {}).map((metric, index) => (
                    <Line
                      key={metric}
                      type="monotone"
                      dataKey={metric}
                      stroke={COLORS[index % COLORS.length]}
                      name={metric}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consumo por Producto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {billingState.selectedProducts?.map((product, index) => (
                  <Card key={product} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{product}</h3>
                      <Badge variant="secondary">
                        {billingState.consumption?.[product]?.usage.toLocaleString() || 0}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Coste: €{billingState.consumption?.[product]?.cost.toFixed(2) || 0}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usuarios y Costes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Usuarios Base</h3>
                  <div className="text-2xl font-bold">
                    {userBreakdown[0].value}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Incluidos en el plan base
                  </p>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Usuarios Adicionales</h3>
                  <div className="text-2xl font-bold">
                    {userBreakdown[1].value}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Coste adicional: €{(userBreakdown[1].value * (billingState.subscriptionType === 'pro' ? 14.99 : 12.99)).toFixed(2)}/mes
                  </p>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Billing; 