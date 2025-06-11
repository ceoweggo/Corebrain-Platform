import React from 'react';
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
  CreditCard,
  Package,
  Gauge,
  History,
  Lightbulb
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
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { useSubscription, SUBSCRIPTION_TYPES } from '../auth/SubscriptionProvider';
import { useAuth } from '../lib/sso/AuthContext';

// Datos de ejemplo para las gráficas
const messageData = [
  { name: 'Lun', value: 400 },
  { name: 'Mar', value: 300 },
  { name: 'Mié', value: 500 },
  { name: 'Jue', value: 280 },
  { name: 'Vie', value: 590 },
  { name: 'Sáb', value: 350 },
  { name: 'Dom', value: 200 },
];

const usersData = [
  { name: 'Lun', value: 24 },
  { name: 'Mar', value: 13 },
  { name: 'Mié', value: 42 },
  { name: 'Jue', value: 30 },
  { name: 'Vie', value: 55 },
  { name: 'Sáb', value: 12 },
  { name: 'Dom', value: 10 },
];

const usageData = [
  { name: 'Projects', used: 3, total: 10 },
  { name: 'Storage', used: 1.2, total: 10 },
  { name: 'API Calls', used: 345, total: 1000 }
];

// Colores para los planes
const planColors = {
  [SUBSCRIPTION_TYPES.FREE]: {
    primary: '#6E6E6E',
    secondary: '#A5A5A5',
    accent: '#D4D4D4',
    badge: 'bg-gray-200 text-gray-800'
  },
  [SUBSCRIPTION_TYPES.BASIC]: {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#93C5FD',
    badge: 'bg-blue-100 text-blue-800'
  },
  [SUBSCRIPTION_TYPES.PRO]: {
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    accent: '#C4B5FD',
    badge: 'bg-purple-100 text-purple-800'
  },
  [SUBSCRIPTION_TYPES.ENTERPRISE]: {
    primary: '#4F46E5',
    secondary: '#6366F1',
    accent: '#A5B4FC',
    badge: 'bg-indigo-100 text-indigo-800'
  }
};

// Componente para mostrar características premium
const PremiumFeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  isAccessible, 
  requiredPlan,
  actionLink,
  usageData
}) => {
  const { SUBSCRIPTION_FEATURES } = useSubscription();

  return (
    <Card className="bg-[#121a2c] border-none shadow-lg rounded-2xl overflow-hidden h-full">
      <div className={`h-2 ${isAccessible ? 'bg-cyan-500' : 'bg-gray-600'}`}></div>
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start mb-4">
          <div className={`p-2 rounded-md ${isAccessible ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-700 text-gray-400'}`}>
            <Icon size={24} />
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-gray-400 text-sm mt-1">{description}</p>
          </div>
        </div>
        
        {usageData && isAccessible && (
          <div className="mt-2 mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">
                {usageData.used} / {usageData.total === 999999 ? '∞' : usageData.total}
              </span>
              <span className="text-gray-400">
                {Math.round((usageData.used / usageData.total) * 100)}%
              </span>
            </div>
            <Progress 
              value={(usageData.used / usageData.total) * 100} 
              className="h-2 bg-gray-700"
            />
          </div>
        )}
        
        <div className="mt-auto pt-4">
          {isAccessible ? (
            <Button 
              className="w-full bg-[#1E293B] hover:bg-[#2C3E50] text-white"
              asChild
            >
              <Link to={actionLink}>
                Access Feature
              </Link>
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center text-gray-400 text-sm">
                <Lock size={14} className="mr-2" />
                <span>
                  Requires {SUBSCRIPTION_FEATURES[requiredPlan]?.name} Plan
                </span>
              </div>
              <Button 
                className="w-full bg-cyan-500/30 hover:bg-cyan-500/50 text-cyan-100"
                asChild
              >
                <Link to={ROUTES.SUBSCRIBE}>
                  Upgrade
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const Dashboard = () => {
  const { user } = useAuth();
  const { 
    subscription, 
    loading, 
    hasAccess, 
    hasPlanAccess, 
    getCurrentPlan, 
    SUBSCRIPTION_FEATURES 
  } = useSubscription();
  
  // Obtener el plan actual y sus colores
  const currentPlan = getCurrentPlan();
  const planType = subscription?.type || SUBSCRIPTION_TYPES.FREE;
  const colors = planColors[planType];

  // Datos de facturación y uso
  const billingData = {
    baseCost: currentPlan.price,
    activeProducts: ['CoreBrain', 'DataSync', 'Analytics'],
    currentUsage: {
      apiCalls: subscription?.usage?.apiCalls || 0,
      storage: subscription?.usage?.storage || 0,
      projects: subscription?.usage?.projects || 0
    },
    projectedBilling: calculateProjectedBilling(),
    recommendations: getOptimizationRecommendations(),
    billingHistory: subscription?.billingHistory || []
  };

  // Calcular proyección de facturación
  function calculateProjectedBilling() {
    const baseAmount = currentPlan.price;
    const extraUsage = {
      apiCalls: Math.max(0, (subscription?.usage?.apiCalls || 0) - currentPlan.limits.apiCalls) * 0.001,
      storage: Math.max(0, (subscription?.usage?.storage || 0) - currentPlan.limits.storage) * 0.5,
      projects: Math.max(0, (subscription?.usage?.projects || 0) - currentPlan.limits.projects) * 5
    };
    
    return baseAmount + extraUsage.apiCalls + extraUsage.storage + extraUsage.projects;
  }

  // Obtener recomendaciones de optimización
  function getOptimizationRecommendations() {
    const recommendations = [];
    const usage = subscription?.usage || {};
    
    if (usage.apiCalls > currentPlan.limits.apiCalls * 0.8) {
      recommendations.push({
        type: 'warning',
        message: 'Cerca del límite de llamadas API',
        action: 'Considere actualizar al siguiente plan'
      });
    }
    
    if (usage.storage > currentPlan.limits.storage * 0.9) {
      recommendations.push({
        type: 'warning',
        message: 'Almacenamiento casi lleno',
        action: 'Revise y optimice el uso de almacenamiento'
      });
    }
    
    if (calculateProjectedBilling() > currentPlan.price * 1.5) {
      recommendations.push({
        type: 'info',
        message: 'Podría ahorrar con un plan superior',
        action: 'Compare planes disponibles'
      });
    }
    
    return recommendations;
  }

  // Gráfico de distribución de uso de almacenamiento
  const storageData = [
    { name: 'Used', value: subscription?.usage?.storage || 0 },
    { name: 'Available', value: Math.max(currentPlan.limits.storage - (subscription?.usage?.storage || 0), 0) }
  ];

  // Gráfico de utilización de proyectos por semana
  const projectData = [
    { name: 'W1', projects: 2 },
    { name: 'W2', projects: 5 },
    { name: 'W3', projects: 3 },
    { name: 'W4', projects: 7 }
  ];

  // Si está cargando, mostrar spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b1220]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <main className="min-h-screen text-white px-6 py-10">
      <section className="max-w-6xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'User'}</h1>
            <p className="text-gray-400">Here's what's happening with your account today.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 md:mt-0"
          >
            <Button 
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-xl shadow-md"
              asChild
            >
              <Link to={ROUTES.SUBSCRIBE}>
                Manage Subscription
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Subscription Status Card */}
      <section className="max-w-6xl mx-auto mb-10">
        <Card className="bg-[#121a2c] border-none shadow-lg rounded-2xl overflow-hidden">
          <div className="h-2" style={{ backgroundColor: colors.primary }}></div>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-bold mr-3">Your Subscription</h2>
                  <Badge className={`px-3 py-1 ${colors.badge}`}>
                    {currentPlan.name}
                  </Badge>
                  
                  {subscription?.status === 'active' ? (
                    <Badge className="ml-2 bg-green-100 text-green-800 px-3 py-1">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="ml-2 bg-red-100 text-red-800 px-3 py-1">
                      Inactive
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300 mb-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Current Plan</p>
                    <p className="font-medium">{currentPlan.name}</p>
                  </div>
                  
                  {subscription?.startedAt && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Started On</p>
                      <p className="font-medium">{formatDate(subscription.startedAt)}</p>
                    </div>
                  )}
                  
                  {subscription?.expiresAt && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Renews On</p>
                      <p className="font-medium">{formatDate(subscription.expiresAt)}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center">
                <div className="p-4 bg-[#1a2439] rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">Monthly Fee</p>
                  <p className="text-2xl font-bold text-white">${currentPlan.price}</p>
                </div>
              </div>
            </div>
            
            {/* Plan Features */}
            <div className="mt-6 border-t border-gray-700 pt-6">
              <h3 className="text-lg font-medium mb-4">Plan Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle2 className="text-cyan-400 mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="bg-[#0f1726] py-4 px-6 border-t border-gray-800">
            <div className="w-full flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 mb-3 sm:mb-0">
                {planType === SUBSCRIPTION_TYPES.FREE 
                  ? 'Upgrade to unlock premium features and higher usage limits.' 
                  : 'Manage your subscription or change your plan.'}
              </p>
              
              <Button 
                className={`bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-xl shadow-md`}
                asChild
              >
                <Link to={ROUTES.SUBSCRIBE}>
                  {planType === SUBSCRIPTION_TYPES.FREE ? 'Upgrade Plan' : 'Manage Plan'}
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </section>

      {/* Usage Overview */}
      <section className="max-w-6xl mx-auto mb-10">
        <h2 className="text-2xl font-bold mb-6">Usage Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Projects Usage */}
          <Card className="bg-[#121a2c] border-none shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Projects</h3>
                <div className="p-2 bg-[#1a2439] rounded-md">
                  <FileSpreadsheet size={20} className="text-cyan-400" />
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">
                    {subscription?.usage?.projects || 0} / {currentPlan.limits.projects === 999999 ? '∞' : currentPlan.limits.projects}
                  </span>
                  <span className="text-gray-400">
                    {currentPlan.limits.projects === 999999 ? 0 : Math.round(((subscription?.usage?.projects || 0) / currentPlan.limits.projects) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={currentPlan.limits.projects === 999999 ? 0 : ((subscription?.usage?.projects || 0) / currentPlan.limits.projects) * 100} 
                  className="h-2 bg-gray-700"
                />
              </div>
              
              <div className="h-[180px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                    <XAxis dataKey="name" stroke="#a0aec0" />
                    <YAxis stroke="#a0aec0" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a2439', borderColor: '#2d3748' }}
                      itemStyle={{ color: '#e2e8f0' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Bar dataKey="projects" fill={colors.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Storage Usage */}
          <Card className="bg-[#121a2c] border-none shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Storage</h3>
                <div className="p-2 bg-[#1a2439] rounded-md">
                  <Database size={20} className="text-cyan-400" />
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">
                    {(subscription?.usage?.storage || 0) / 1000} GB / {currentPlan.limits.storage / 1000} GB
                  </span>
                  <span className="text-gray-400">
                    {Math.round(((subscription?.usage?.storage || 0) / currentPlan.limits.storage) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={((subscription?.usage?.storage || 0) / currentPlan.limits.storage) * 100} 
                  className="h-2 bg-gray-700"
                />
              </div>
              
              <div className="h-[180px] mt-6 flex items-center justify-center">
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
                      <Cell key="available" fill="#1a2439" />
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a2439', borderColor: '#2d3748' }}
                      itemStyle={{ color: '#e2e8f0' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* API Usage */}
          <Card className="bg-[#121a2c] border-none shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">API Calls</h3>
                <div className="p-2 bg-[#1a2439] rounded-md">
                  <TrendingUp size={20} className="text-cyan-400" />
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">
                    {subscription?.usage?.apiCalls || 0} / {currentPlan.limits.apiCalls}
                  </span>
                  <span className="text-gray-400">
                    {Math.round(((subscription?.usage?.apiCalls || 0) / currentPlan.limits.apiCalls) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={((subscription?.usage?.apiCalls || 0) / currentPlan.limits.apiCalls) * 100} 
                  className="h-2 bg-gray-700"
                />
              </div>
              
              <div className="h-[180px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={messageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                    <XAxis dataKey="name" stroke="#a0aec0" />
                    <YAxis stroke="#a0aec0" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a2439', borderColor: '#2d3748' }}
                      itemStyle={{ color: '#e2e8f0' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Area type="monotone" dataKey="value" stroke={colors.primary} fill={colors.primary} fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Available Features */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-6">Available Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PremiumFeatureCard
            title="API Access"
            description="Access to our REST API endpoints"
            icon={Database}
            isAccessible={hasAccess('api')}
            requiredPlan={SUBSCRIPTION_TYPES.BASIC}
            actionLink={ROUTES.API_DOCS}
            usageData={{
              used: subscription?.usage?.apiCalls || 0,
              total: currentPlan.limits.apiCalls
            }}
          />
          
          <PremiumFeatureCard
            title="Team Collaboration"
            description="Work together with your team"
            icon={Users}
            isAccessible={hasAccess('team')}
            requiredPlan={SUBSCRIPTION_TYPES.PRO}
            actionLink={ROUTES.TEAM}
            usageData={{
              used: subscription?.usage?.teamMembers || 0,
              total: currentPlan.limits.teamMembers
            }}
          />
          
          <PremiumFeatureCard
            title="Advanced Analytics"
            description="Detailed insights and reports"
            icon={BarChart2}
            isAccessible={hasAccess('analytics')}
            requiredPlan={SUBSCRIPTION_TYPES.PRO}
            actionLink={ROUTES.ANALYTICS}
            usageData={{
              used: subscription?.usage?.reports || 0,
              total: currentPlan.limits.reports
            }}
          />
        </div>
      </section>

      {/* ETEdata Section */}
      <section className="max-w-6xl mx-auto text-center mb-20">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-4"
        >
          Unlock the full potential of <span className="text-cyan-400">etedata</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
        >
          From raw data to actionable insights. Connect, transform, and visualize your data instantly.
        </motion.p>
        
        {planType !== SUBSCRIPTION_TYPES.ENTERPRISE && (
          <Button 
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 text-lg rounded-2xl shadow-lg"
            asChild
          >
            <Link to={ROUTES.SUBSCRIBE}>
              Upgrade Now
            </Link>
          </Button>
        )}
      </section>

      <footer className="mt-32 text-center text-sm text-gray-500">
        © 2025 etedata. All rights reserved.
      </footer>

      {/* Métricas principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-10">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Costo Base de Suscripción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{billingData.baseCost}€/mes</div>
              <CreditCard className="text-muted-foreground" size={20} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Productos Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{billingData.activeProducts.length}</div>
              <Package className="text-muted-foreground" size={20} />
            </div>
            <div className="mt-2">
              {billingData.activeProducts.map((product, index) => (
                <Badge key={index} variant="secondary" className="mr-2">
                  {product}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Proyección de Facturación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{billingData.projectedBilling.toFixed(2)}€</div>
              <Gauge className="text-muted-foreground" size={20} />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Estimado para este mes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Historial de Facturación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {billingData.billingHistory.length} facturas
              </div>
              <History className="text-muted-foreground" size={20} />
            </div>
            <Link 
              to={ROUTES.BILLING}
              className="mt-2 text-sm text-blue-500 hover:text-blue-600 flex items-center"
            >
              Ver historial completo
              <ArrowUpRight size={14} className="ml-1" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Uso y Límites */}
      <Card>
        <CardHeader>
          <CardTitle>Consumo vs. Límites Incluidos</CardTitle>
          <CardDescription>
            Monitoreo del uso de recursos en tu plan actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Llamadas API</span>
                <span>{billingData.currentUsage.apiCalls.toLocaleString()} / {currentPlan.limits.apiCalls.toLocaleString()}</span>
              </div>
              <Progress 
                value={(billingData.currentUsage.apiCalls / currentPlan.limits.apiCalls) * 100}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Almacenamiento (GB)</span>
                <span>{billingData.currentUsage.storage} / {currentPlan.limits.storage}</span>
              </div>
              <Progress 
                value={(billingData.currentUsage.storage / currentPlan.limits.storage) * 100}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Proyectos</span>
                <span>{billingData.currentUsage.projects} / {currentPlan.limits.projects}</span>
              </div>
              <Progress 
                value={(billingData.currentUsage.projects / currentPlan.limits.projects) * 100}
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recomendaciones de Optimización */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones de Optimización</CardTitle>
          <CardDescription>
            Sugerencias para mejorar el uso de tu plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingData.recommendations.map((rec, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  rec.type === 'warning' 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-full ${
                    rec.type === 'warning'
                      ? 'bg-yellow-100'
                      : 'bg-blue-100'
                  }`}>
                    <Lightbulb size={16} className={
                      rec.type === 'warning'
                        ? 'text-yellow-700'
                        : 'text-blue-700'
                    } />
                  </div>
                  <div className="ml-3">
                    <h4 className={`text-sm font-medium ${
                      rec.type === 'warning'
                        ? 'text-yellow-800'
                        : 'text-blue-800'
                    }`}>
                      {rec.message}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      rec.type === 'warning'
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                    }`}>
                      {rec.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full"
            asChild
          >
            <Link to={ROUTES.SUBSCRIBE}>
              Comparar Planes
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Dashboard;