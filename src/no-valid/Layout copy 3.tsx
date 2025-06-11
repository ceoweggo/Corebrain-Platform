import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { cn } from '../lib/utils';
import { useBilling } from '@/auth/BillingContext';
import { CreditCard, Package, History, User, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/sso/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { billingState, calculateTotalBill } = useBilling();
  const { user, logout } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobileScreen = window.innerWidth < 768;
      setIsMobile(isMobileScreen);
      setIsSidebarCollapsed(!isMobileScreen && window.innerWidth < 1280);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const billingNavItems = [
    {
      title: 'Planes',
      href: '/billing/plans',
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      title: 'Productos',
      href: '/billing/products',
      icon: <Package className="h-5 w-5" />
    },
    {
      title: 'Historial',
      href: '/billing/history',
      icon: <History className="h-5 w-5" />
    }
  ];

  const UserDropdown = () => {
    const totalBill = calculateTotalBill();
    const userConsumption = billingState.consumption || {};

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-md">
          <User className="h-5 w-5" />
          <span>{user?.name || 'Usuario'}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80">
          <div className="p-4">
            <h3 className="font-semibold mb-2">Consumo Actual</h3>
            <div className="space-y-2">
              {Object.entries(userConsumption).map(([metric, data]) => (
                <div key={metric} className="flex justify-between">
                  <span className="text-sm text-gray-500">{metric}</span>
                  <span className="text-sm font-medium">{data.usage}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-semibold">
                <span>Total Mensual</span>
                <span>€{totalBill.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <DropdownMenuItem onClick={logout} className="text-red-500">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">DataPulse</h1>
        </div>

        <nav className="space-y-2">
          {/* ... existing navigation items ... */}

          {/* Billing section */}
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Facturación
            </h2>
            <Card className="bg-gray-800 border-gray-700 mb-4">
              <CardHeader className="p-4">
                <CardTitle className="text-sm">Consumo Global</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  {Object.entries(billingState.consumption || {}).map(([metric, data]) => (
                    <div key={metric} className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{metric}</span>
                      <Badge variant="secondary" className="bg-gray-700">
                        {data.usage}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Total</span>
                    <span className="text-lg font-semibold">
                      €{calculateTotalBill().toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {billingNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                  location.pathname === item.href
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="h-16 bg-white border-b flex items-center justify-end px-4">
          <UserDropdown />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
