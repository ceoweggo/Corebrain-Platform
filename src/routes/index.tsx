import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { CoreBrainDashboard } from '@/pages/corebrain/Dashboard';
import { CoreBrainProjects } from '@/pages/corebrain/Projects';
import { CoreBrainApiKeys } from '@/pages/corebrain/ApiKeys';
import { CoreBrainCode } from '@/pages/corebrain/Code';
import { CoreBrainMonitoring } from '@/pages/corebrain/Monitoring';
import { ProductsDataFlow } from '@/pages/products/DataFlow';
import { ProductsAIEngine } from '@/pages/products/AIEngine';
import { Documentation } from '@/pages/Documentation';
import { Support } from '@/pages/Support';
import { Security } from '@/pages/Security';
import { Settings } from '@/pages/Settings';
import { SubscriptionPlans } from '@/pages/subscription/Plans';
import { useAuth } from '@/lib/sso/AuthContext';
import { useSubscription } from '@/lib/subscription/SubscriptionContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredProduct?: string;
  requiredFeature?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredProduct, 
  requiredFeature 
}) => {
  const { user, isAuthenticated } = useAuth();
  const { subscription } = useSubscription();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredProduct && !subscription?.products?.[requiredProduct]?.active) {
    return <Navigate to={`/subscription/plans/${requiredProduct}`} replace />;
  }

  if (requiredFeature && !subscription?.products?.[requiredProduct]?.features?.[requiredFeature]) {
    return <Navigate to={`/subscription/plans/${requiredProduct}`} replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      // CoreBrain Routes
      {
        path: 'corebrain',
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute requiredProduct="corebrain">
                <CoreBrainDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: 'projects',
            element: (
              <ProtectedRoute requiredProduct="corebrain" requiredFeature="projects">
                <CoreBrainProjects />
              </ProtectedRoute>
            ),
          },
          {
            path: 'api-keys',
            element: (
              <ProtectedRoute requiredProduct="corebrain" requiredFeature="api_keys">
                <CoreBrainApiKeys />
              </ProtectedRoute>
            ),
          },
          {
            path: 'code-generator',
            element: (
              <ProtectedRoute requiredProduct="corebrain" requiredFeature="code_generator">
                <CoreBrainCode />
              </ProtectedRoute>
            ),
          },
          {
            path: 'monitoring',
            element: (
              <ProtectedRoute requiredProduct="corebrain" requiredFeature="monitoring">
                <CoreBrainMonitoring />
              </ProtectedRoute>
            ),
          },
        ],
      },
      // Product Routes
      {
        path: 'products',
        children: [
          {
            path: 'dataflow',
            element: <ProductsDataFlow />,
          },
          {
            path: 'ai-engine',
            element: <ProductsAIEngine />,
          },
        ],
      },
      // Support Routes
      {
        path: 'docs',
        element: <Documentation />,
      },
      {
        path: 'support',
        element: <Support />,
      },
      // Settings Routes
      {
        path: 'security',
        element: (
          <ProtectedRoute>
            <Security />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      // Subscription Routes
      {
        path: 'subscription/plans/:productId?',
        element: <SubscriptionPlans />,
      },
    ],
  },
]); 