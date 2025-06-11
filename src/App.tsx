import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Páginas y componentes principales
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { TokenManager } from "./components/TokenManager";
import { Account } from "./components/Account";
import { Billing } from "./components/Billing";
import { Dashboard } from "./pages/Dashboard";

// Páginas y componentes de Corebrain
import CoreBrainDashboard from "./pages/products/corebrain/dashboard";
import CoreBrainConnections from "./pages/products/corebrain/connections";
import ApiKeysPage from "./pages/products/corebrain/api-keys";
import CoreBrainSDK from "./pages/products/corebrain/sdk";
import CoreBrainLogs from "./pages/products/corebrain/logs";
import CoreBrainSettings from "./pages/products/corebrain/settings";
import ChatInterface from "./components/products/corebrain/ChatInterface";
import AppearanceSettings from "./components/products/corebrain/AppearanceSettings";
import CodeGenerator from "./components/products/corebrain/CodeGenerator";

// Componentes de autenticación
import { useAuth, AuthProvider } from './lib/sso/AuthContext';
import ProtectedRoute from './lib/sso/ProtectedRoute';
import { AuthCallback } from './pages/auth/sso/callback';
import { LogoutPage } from './pages/auth/logout';
import LogoutCallback from './pages/auth/sso/logout-callback';

// Componentes de suscripción
import { SubscriptionProvider, SUBSCRIPTION_TYPES, useSubscription } from '@/auth/subscriptionProvider';
import Subscribe from '@/pages/subscription/subscribe';
import PremiumContent from '@/pages/subscription/premiumContent';
import { SubscriptionTester } from '@/components/SubscriptionTester';

// Componentes de soporte
import { Support } from '@/pages/Support';

// Import new billing components
import SubscriptionPlans from './pages/billing/SubscriptionPlans';
import ProductSelection from './pages/billing/ProductSelection';
import BillingHistory from './pages/billing/BillingHistory';
import { BillingProvider } from './auth/BillingContext';

// Constantes de rutas
import { ROUTES } from './utils/constants';
import { ThemeProvider } from "./utils/ThemeContext";
import './styles/theme.css';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <BillingProvider>
            <ThemeProvider>
              <TooltipProvider>
                <AppRoutes />
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </ThemeProvider>
          </BillingProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const AppRoutes = () => {
  const { user, loading: authLoading, error, login, isAuthenticated } = useAuth();
  const { loading: subscriptionLoading } = useSubscription();
  const [authAttempted, setAuthAttempted] = useState(false);
  
  const resetAuthAttempt = () => setAuthAttempted(false);
  
  useEffect(() => {
    const isPublicRoute = [
      '/auth/sso/callback', 
      '/auth/sso/logout-callback',
      '/auth/logout',
      '/plans',
      '/auth/subscribe',
      '/subscribe'
    ].some(route => window.location.pathname.includes(route));
    
    if (!authLoading && !isAuthenticated && !isPublicRoute && !authAttempted) {
      console.log('No authenticated user, redirecting to login...');
      setAuthAttempted(true);
      login();
    }
  }, [authLoading, isAuthenticated, login, authAttempted]);
  
  if (authLoading || subscriptionLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#0b1220] text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
        <p className="text-xl">
          {authLoading ? 'Verificando autenticación...' : 'Cargando información de suscripción...'}
        </p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0b1220] text-white">
        <div className="bg-[#121a2c] p-6 rounded-lg shadow-md max-w-md border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">Error de autenticación</h2>
          <p className="mb-6 text-gray-300">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => {
                resetAuthAttempt();
                login();
              }}
              className="w-full py-3 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors"
            >
              Iniciar sesión nuevamente
            </button>
            <button 
              onClick={resetAuthAttempt}
              className="w-full py-3 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 transition-colors"
            >
              Continuar sin iniciar sesión
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Si continúa experimentando problemas, contacte a soporte técnico.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && authAttempted && !authLoading) {
    const isPublicRoute = [
      '/auth/sso/callback', 
      '/auth/sso/logout-callback',
      '/auth/logout',
      '/plans',
      '/auth/subscribe',
      '/subscribe'
    ].includes(location.pathname);

    if (!isPublicRoute) {
      return <Navigate to="/subscribe" replace />;
    }
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/auth/sso/callback" element={<AuthCallback />} />
      <Route path="/auth/sso/logout-callback" element={<LogoutCallback />} />
      <Route path="/auth/logout" element={<LogoutPage />} />
      <Route path="/subscribe" element={<Subscribe />} />
      
      {/* Rutas protegidas */}
      <Route path="/" element={
        <Layout>
          <ProtectedRoute requiredPlan={SUBSCRIPTION_TYPES.FREE} requiredFeature="dashboard">
            <Dashboard />
          </ProtectedRoute>
        </Layout>
      } />

      <Route path="/tokens" element={
        <Layout>
          <ProtectedRoute>
            <TokenManager />
          </ProtectedRoute>
        </Layout>
      } />

      <Route path="/appearance" element={
        <Layout>
          <ProtectedRoute>
            <AppearanceSettings />
          </ProtectedRoute>
        </Layout>
      } />

      <Route path="/account" element={
        <Layout>
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        </Layout>
      } />

      <Route path="/billing" element={
        <Layout>
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        </Layout>
      } />

      <Route path="/subscription-tester" element={
        <ProtectedRoute>
          <SubscriptionTester />
        </ProtectedRoute>
      } />

      <Route path="/code-generator" element={
        <ProtectedRoute>
          <CodeGenerator />
        </ProtectedRoute>
      } />

      {/* Rutas de CoreBrain */}
      <Route path="/products/corebrain" element={
        <ProtectedRoute>
          <CoreBrainDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/products/corebrain/connections" element={
        <ProtectedRoute>
          <CoreBrainConnections />
        </ProtectedRoute>
      } />

      <Route path="/products/corebrain/api-keys" element={
        <Layout>
          <ProtectedRoute>
            <ApiKeysPage />
          </ProtectedRoute>
        </Layout>
      } />

      <Route path="/products/corebrain/sdk" element={
        <ProtectedRoute>
          <CoreBrainSDK />
        </ProtectedRoute>
      } />

      <Route path="/products/corebrain/logs" element={
        <ProtectedRoute>
          <CoreBrainLogs />
        </ProtectedRoute>
      } />

      <Route path="/products/corebrain/chat" element={
        <ProtectedRoute>
          <ChatInterface />
        </ProtectedRoute>
      } />

      <Route path="/products/corebrain/code-generator" element={
        <ProtectedRoute>
          <CodeGenerator />
        </ProtectedRoute>
      } />

      <Route path="/products/corebrain/settings" element={
        <ProtectedRoute>
          <CoreBrainSettings />
        </ProtectedRoute>
      } />

      {/* Rutas premium */}
      <Route path="/premium/basic" element={
        <ProtectedRoute requiredPlan={SUBSCRIPTION_TYPES.BASIC} requiredFeature="premium-features">
          <PremiumContent />
        </ProtectedRoute>
      } />

      <Route path="/premium/pro" element={
        <ProtectedRoute requiredPlan={SUBSCRIPTION_TYPES.PRO} requiredFeature="analytics">
          <PremiumContent />
        </ProtectedRoute>
      } />

      <Route path="/premium/enterprise" element={
        <ProtectedRoute requiredPlan={SUBSCRIPTION_TYPES.ENTERPRISE} requiredFeature="team-management">
          <PremiumContent />
        </ProtectedRoute>
      } />

      <Route path="/support" element={
        <ProtectedRoute>
          <Support />
        </ProtectedRoute>
      } />

      {/* New billing routes */}
      <Route path="/billing/plans" element={
        <ProtectedRoute>
          <SubscriptionPlans />
        </ProtectedRoute>
      } />
      
      <Route path="/billing/products" element={
        <ProtectedRoute>
          <ProductSelection />
        </ProtectedRoute>
      } />
      
      <Route path="/billing/history" element={
        <ProtectedRoute>
          <BillingHistory />
        </ProtectedRoute>
      } />

      {/* Rutas de error */}
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found" />} />
    </Routes>
  );
};

export default App;

