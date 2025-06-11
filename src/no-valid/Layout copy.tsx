import React, { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/sso/AuthContext';
import TokenManager from '../lib/sso/js-no-valid/TokenManager';
import Sidebar from './Sidebar-asda';
import { SidebarProvider } from '@/components/ui/sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  //const navigate = useNavigate(); --> No se usa
  
  // Lista de rutas públicas que no requieren autenticación
  const publicPaths = ['/', '/login', '/testimonials'];
  const isPublicPath = publicPaths.includes(location.pathname);
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Si el usuario está autenticado, mostrar TokenManager para gestión de tokens */}
        {user && <TokenManager />}
        
        {/* Sidebar solo visible si el usuario está autenticado */}
        {user && <Sidebar />}
        
        {/* Contenido principal */}
        <main className={`flex-1 overflow-x-hidden ${user ? 'ml-64' : ''}`}>
          {/* Barra superior con información del usuario si está autenticado */}
          {user && (
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
              <h1 className="text-xl font-semibold">CoreBrain.AI</h1>
              <div className="flex items-center space-x-4">
                <span>{user.name || user.username}</span>
                <button 
                  onClick={() => logout()}
                  className="px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                >
                  Cerrar sesión
                </button>
              </div>
            </header>
          )}
          
          {/* Contenido de la página */}
          <div className="container py-6 transition-all duration-300 ease-in-out animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;