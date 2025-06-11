import React from 'react';
import Layout from '@/components/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { 
  BarChart2, 
  MessageCircle, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  Download,
  Lock,
  TrendingUp,
  Crown,
  Key
} from 'lucide-react';
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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { useSubscription, SUBSCRIPTION_TYPES, SUBSCRIPTION_FEATURES } from '../auth/subscriptionProvider';
import { useAuth } from '../lib/sso/AuthContext';

// Datos de ejemplo para las gráficas
const apiUsageData = [
  { name: 'Lun', value: 400 },
  { name: 'Mar', value: 300 },
  { name: 'Mié', value: 500 },
  { name: 'Jue', value: 280 },
  { name: 'Vie', value: 590 },
  { name: 'Sáb', value: 350 },
  { name: 'Dom', value: 200 },
];

// Planes y colores
const planColors = {
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

// Componente para mostrar características premium
const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  count,
  total,
  actionLink
}) => {
  const { hasAccess } = useSubscription();
  const isAccessible = hasAccess('dashboard'); // Todos tienen acceso al dashboard por defecto

  return (
    <Card className="border-2 border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <div className="p-2 rounded-md bg-gray-800 text-blue-400">
            <Icon size={20} />
          </div>
        </div>
        
        <div className="text-2xl font-bold flex items-baseline">
          {count !== undefined && (
            <>
              <span>{count}</span>
              {total && <span className="text-gray-400 text-sm ml-1">/ {total}</span>}
            </>
          )}
        </div>
        
        {count !== undefined && total && (
          <div className="mt-2">
            <Progress 
              value={(count / total) * 100} 
              className="h-2 bg-gray-700"
            />
          </div>
        )}
      </CardContent>
      
      {actionLink && (
        <CardFooter className="pt-0">
          <Button 
            variant="outline"
            className="w-full"
            asChild
          >
            <Link to={actionLink}>
              Administrar
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    subscription, 
    loading, 
    hasAccess, 
    hasPlanAccess, 
    getCurrentPlan, 
    SUBSCRIPTION_FEATURES 
  } = useSubscription();
  
  React.useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null; // O un loader si prefieres
  }

  // Obtener el plan actual y sus colores
  const currentPlan = getCurrentPlan();
  const planType = subscription?.type || SUBSCRIPTION_TYPES.FREE;
  const colors = planColors[planType];
  
  // Datos para uso de APIs con valores por defecto
  const apiKeysCount = subscription?.usage?.apiKeys || 0;
  const apiKeysLimit = currentPlan?.limits?.apiCalls || 0;
  
  // Datos para conexiones con valores por defecto
  const connectionsCount = subscription?.usage?.connections || 0;
  const connectionsLimit = currentPlan?.limits?.projects || 0;
  
  // Datos para uso de almacenamiento con valores por defecto
  const storageUsed = subscription?.usage?.storage || 0;
  const storageLimit = currentPlan?.limits?.storage || 0;
  
  // Gráfico de distribución de uso de almacenamiento
  const storageData = [
    { name: 'Used', value: storageUsed },
    { name: 'Available', value: Math.max(storageLimit - storageUsed, 0) }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido a tu panel de control, {user?.name?.split(' ')[0] || user?.username?.split(' ')[0] || 'Usuario'}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white" 
            asChild
          >
            <Link to="/billing">
              Gestionar Suscripción
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Sección de estado de suscripción */}
      <Card className="border-2 border-gray-800">
        <div className="h-2" style={{ backgroundColor: colors.primary }}></div>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center">
              <CardTitle className="text-xl font-bold mr-3">Tu suscripción</CardTitle>
              <Badge className="capitalize">
                {subscription?.type || 'Free'}
              </Badge>
            </div>
            
            <div className="mt-4 md:mt-0 py-2 px-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400">Precio mensual</p>
              <p className="text-xl font-bold text-white">${subscription?.price || '0'}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Estado</p>
              <p className="font-medium capitalize">{subscription?.status || 'Activo'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400 mb-1">Fecha de inicio</p>
              <p className="font-medium">{subscription?.startDate || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400 mb-1">Próxima renovación</p>
              <p className="font-medium">{subscription?.nextBillingDate || 'N/A'}</p>
            </div>
          </div>
          
          {/* Características del plan */}
          <div className="mt-6 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-medium mb-4">Características del plan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(currentPlan?.features || SUBSCRIPTION_FEATURES[SUBSCRIPTION_TYPES.FREE].features).map((feature, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle2 className="text-blue-400 mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span className="">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tarjetas de características principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="Corebrain"
          description="Conecta tus bases de datos y gestiona tus conexiones"
          icon={Database}
          count={connectionsCount}
          total={connectionsLimit}
          actionLink="/connections"
        />
        
        <FeatureCard
          title="API Keys"
          description="Gestiona tus claves de API"
          icon={Key}
          count={apiKeysCount}
          total={apiKeysLimit}
          actionLink="/api-keys"
        />
        
        <FeatureCard
          title="Almacenamiento"
          description="Espacio disponible para tus datos"
          icon={Database}
          count={Math.round(storageUsed / 1024)} // Convertir a GB
          total={Math.round(storageLimit / 1024)}
          actionLink="/storage"
        />
      </div>
      
      {/* Sección de estadísticas y gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de uso de API */}
        <Card className="border-2 border-gray-800">
          <CardHeader>
            <CardTitle>Uso de API</CardTitle>
            <CardDescription>
              Llamadas a la API durante la última semana
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={apiUsageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="name" stroke="#a0aec0" />
                  <YAxis stroke="#a0aec0" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                    itemStyle={{ color: '#e5e7eb' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={colors.secondary} 
                    fill={colors.primary} 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Gráfico de distribución de almacenamiento */}
        <Card className="border-2 border-gray-800">
          <CardHeader>
            <CardTitle>Almacenamiento</CardTitle>
            <CardDescription>
              Distribución del uso de almacenamiento
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={storageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell key="used" fill={colors.primary} />
                    <Cell key="available" fill="#374151" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                    itemStyle={{ color: '#e5e7eb' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sección de características premium */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Características avanzadas</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="card-blue border-2 border-gray-800 shadow-lg rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-md bg-blue-500/20 text-blue-100">
                  <BarChart2 size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">Analíticas avanzadas</h3>
                  <p className="text-muted-foreground text-sm mt-1">Métricas y análisis profundo de tus datos</p>
                </div>
              </div>
              
              <div className="mt-auto pt-4">
                {(planType === SUBSCRIPTION_TYPES.PRO || planType === SUBSCRIPTION_TYPES.ENTERPRISE) ? (
                  <Button className="w-full" asChild>
                    <Link to="/analytics">
                      Acceder
                    </Link>
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Lock size={14} className="mr-2" />
                      <span>Requiere Plan Pro o superior</span>
                    </div>
                    <Button className="w-full text-gray-500" variant="outline" asChild>
                      <Link to="/subscribe">
                        Mejorar plan
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-blue border-2 border-gray-800 shadow-lg rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-md bg-blue-500/20 text-blue-100">
                  <TrendingUp size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">Monitoreo en tiempo real</h3>
                  <p className="text-muted-foreground text-sm mt-1">Supervisa tus APIs y conexiones en tiempo real</p>
                </div>
              </div>
              
              <div className="mt-auto pt-4">
                {(planType === SUBSCRIPTION_TYPES.PRO || planType === SUBSCRIPTION_TYPES.ENTERPRISE) ? (
                  <Button className="w-full" asChild>
                    <Link to="/monitoring">
                      Acceder
                    </Link>
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Lock size={14} className="mr-2" />
                      <span>Requiere Plan Pro o superior</span>
                    </div>
                    <Button className="w-full text-gray-500" variant="outline" asChild>
                      <Link to="/subscribe">
                        Mejorar plan
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-blue border-2 border-gray-800 shadow-lg rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-md bg-blue-500/20 text-blue-100">
                  <Users size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">Colaboración de equipo</h3>
                  <p className="text-muted-foreground text-sm mt-1">Trabaja con tu equipo en los mismos proyectos</p>
                </div>
              </div>
              
              <div className="mt-auto pt-4">
                {planType === SUBSCRIPTION_TYPES.ENTERPRISE ? (
                  <Button className="w-full" asChild>
                    <Link to="/team">
                      Acceder
                    </Link>
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Lock size={14} className="mr-2" />
                      <span>Requiere Plan Enterprise</span>
                    </div>
                    <Button className="w-full text-gray-500" variant="outline" asChild>
                      <Link to="/subscribe">
                        Mejorar plan
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
              
      {/* Sección promocional */}
      <div className="text-center my-16 py-12 px-6 border-2 border-gray-800 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Desbloquea todo el potencial de tus datos
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
          Transforma datos sin procesar en información accionable. <br></br>Conecta, transforma y visualiza tus datos al instante.
        </p>
        
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg" 
          asChild
        >
          <Link to="/subscribe">
            Mejorar Plan
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;