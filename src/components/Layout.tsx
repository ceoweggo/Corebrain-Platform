import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  // Estado para el sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const stored = sessionStorage.getItem('sidebar-collapsed');
    return stored === 'true' ? true : false;
  });

  // Estado para el sidebar móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Estado para detectar si es móvil
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Guardar estado en sessionStorage
  useEffect(() => {
    sessionStorage.setItem('sidebar-collapsed', isSidebarCollapsed ? 'true' : 'false');
  }, [isSidebarCollapsed]);

  return (
    <div className="relative flex min-h-screen w-full bg-background">
      {/* Sidebar para desktop */}
      <div className="hidden md:block">
        <Sidebar 
          onCollapsedChange={setIsSidebarCollapsed}
          className="fixed left-0 top-0 z-30 h-full"
        />
      </div>

      {/* Sidebar para móvil */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 block md:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-background">
            <Sidebar onCollapsedChange={setIsSidebarCollapsed} isOpenMobile={isMobileMenuOpen} />
          </div>
        </div>
      )}

      {/* Botón de menú móvil */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Contenido principal */}
      <main
        className={`
          flex-1 w-full px-6 py-16 md:py-6
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}
        `}
      >
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
