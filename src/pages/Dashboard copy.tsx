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
  const isAccessible = hasAccess('dashboard');

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

// Componente para mostrar productos
const ProductCard = ({ 
  title, 
  description, 
  icon: Icon, 
  link,
  isAvailable
}) => {
  if (!isAvailable) return null;

  return (
    <Card className="border-2 border-gray-800 hover:border-blue-500 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <div className="p-2 rounded-md bg-gray-800 text-blue-400">
            <Icon size={20} />
          </div>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="outline"
          className="w-full"
          asChild
        >
          <Link to={link}>
            Acceder
          </Link>
        </Button>
      </CardFooter>
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
    return null;
  }

  // Obtener el plan actual y sus colores
  const currentPlan = getCurrentPlan();
  const planType = subscription?.type || SUBSCRIPTION_TYPES.FREE;
  const colors = planColors[planType];
  
  // Verificar qué productos están disponibles en la suscripción
  const availableProducts = subscription?.products || [];
  const hasCoreBrain = availableProducts.includes('corebrain');
  
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
              {subscription?.features?.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle2 className="text-green-500" size={16} />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductCard
          title="CoreBrain"
          description="Plataforma de inteligencia artificial y análisis de datos"
          icon={Database}
          link="/products/corebrain"
          isAvailable={hasCoreBrain}
        />
        
        <ProductCard
          title="API Keys"
          description="Gestiona tus claves de API y accesos"
          icon={Key}
          link="/products/corebrain/api-keys"
          isAvailable={hasCoreBrain}
        />
      </div>

      {/* Sección de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          title="Llamadas API"
          icon={BarChart2}
          count={apiKeysCount}
          total={apiKeysLimit}
          actionLink="/products/corebrain/api-keys"
        />
        
        <FeatureCard
          title="Conexiones"
          icon={Users}
          count={connectionsCount}
          total={connectionsLimit}
          actionLink="/products/corebrain/connections"
        />
        
        <FeatureCard
          title="Almacenamiento"
          icon={Database}
          count={storageUsed}
          total={storageLimit}
          actionLink="/account"
        />
      </div>
    </div>
  );
};

export default Dashboard;