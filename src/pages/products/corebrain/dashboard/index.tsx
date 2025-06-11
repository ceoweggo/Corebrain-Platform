import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Database, Users, ArrowUpRight, ArrowDownRight, Clock, Shield } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '@/lib/sso/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSubscription, SUBSCRIPTION_TYPES } from '@/auth/SubscriptionProvider';

const subscriptionColors = {
  [SUBSCRIPTION_TYPES.FREE]: {
    primary: '#6E6E6E',
    secondary: '#A5A5A5',
    badge: 'bg-gray-200 text-gray-800'
  },
  [SUBSCRIPTION_TYPES.BASIC]: {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    badge: 'bg-blue-100 text-blue-800'
  },
  [SUBSCRIPTION_TYPES.PRO]: {
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    badge: 'bg-purple-100 text-purple-800'
  },
  [SUBSCRIPTION_TYPES.ENTERPRISE]: {
    primary: '#4F46E5',
    secondary: '#6366F1',
    badge: 'bg-indigo-100 text-indigo-800'
  }
};

// Datos de ejemplo para las gráficas
const connectionData = [
  { name: 'Ene', value: 12 },
  { name: 'Feb', value: 19 },
  { name: 'Mar', value: 15 },
  { name: 'Abr', value: 25 },
  { name: 'May', value: 22 },
  { name: 'Jun', value: 30 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { subscription, getCurrentPlan } = useSubscription();
  const currentPlan = getCurrentPlan();
  const planType = subscription?.type || SUBSCRIPTION_TYPES.FREE;
  const colors = subscriptionColors[planType];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Vista general de CoreBrain
            </p>
          </div>
          <Badge 
            className={`${colors.badge} px-3 py-1`}
          >
            {currentPlan.name}
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conexiones Activas
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscription?.usage?.connections || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <ArrowUpRight className="h-4 w-4" />
                  +2.1%
                </span>{" "}
                desde el último mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Usuarios Conectados
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscription?.usage?.users || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <ArrowUpRight className="h-4 w-4" />
                  +12.5%
                </span>{" "}
                desde el último mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tiempo de Actividad
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.9%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <ArrowUpRight className="h-4 w-4" />
                  +0.2%
                </span>{" "}
                desde ayer
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Seguridad
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Protegido</div>
              <p className="text-xs text-muted-foreground">
                Sin incidentes detectados
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Tendencia de Conexiones</CardTitle>
              <CardDescription>
                Últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={connectionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                    <XAxis dataKey="name" stroke="#a0aec0" />
                    <YAxis stroke="#a0aec0" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a2439', borderColor: '#2d3748' }}
                      itemStyle={{ color: '#e2e8f0' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={colors.primary} 
                      fill={colors.primary} 
                      fillOpacity={0.3} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Uso del Sistema</CardTitle>
              <CardDescription>
                Monitoreo en tiempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">CPU</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Memoria</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Almacenamiento</span>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Red</span>
                    <span className="text-sm font-medium">89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Últimas conexiones y eventos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    status: 'success',
                    message: 'Nueva conexión establecida',
                    time: '2 minutos',
                  },
                  {
                    status: 'warning',
                    message: 'Actualización de configuración',
                    time: '15 minutos',
                  },
                  {
                    status: 'info',
                    message: 'Backup automático completado',
                    time: '1 hora',
                  },
                ].map((event, i) => (
                  <div key={i} className="flex items-center">
                    <div 
                      className={`mr-4 h-2 w-2 rounded-full ${
                        event.status === 'success' ? 'bg-green-500' :
                        event.status === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`} 
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.message}</p>
                      <p className="text-xs text-muted-foreground">Hace {event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Límites de Uso</CardTitle>
              <CardDescription>
                Plan {currentPlan.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Conexiones</span>
                    <span className="text-sm font-medium">8/10</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Almacenamiento</span>
                    <span className="text-sm font-medium">2.1/5 GB</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Usuarios</span>
                    <span className="text-sm font-medium">15/20</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 