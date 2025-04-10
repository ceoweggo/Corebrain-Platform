
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter
} from '@/components/ui/sidebar';
import { 
  BarChart2, 
  Code, 
  PaintBucket, 
  User, 
  CreditCard, 
  Key, 
  LogOut, 
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: 'Dashboard',
      icon: BarChart2,
      path: '/',
    },
    {
      title: 'Tokens',
      icon: Key,
      path: '/tokens',
    },
    {
      title: 'Apariencia',
      icon: PaintBucket,
      path: '/appearance',
    },
    {
      title: 'Código',
      icon: Code,
      path: '/code-generator',
    },
    {
      title: 'Cuenta',
      icon: User,
      path: '/account',
    },
    {
      title: 'Facturación',
      icon: CreditCard,
      path: '/billing',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <SidebarComponent>
      <SidebarHeader className="flex items-center px-4 py-6">
        <div className="flex items-center space-x-2">
          <div className="rounded-md bg-primary w-8 h-8 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">C</span>
          </div>
          <span className="font-semibold text-xl">Corebrain</span>
        </div>
        <SidebarTrigger className="ml-auto lg:hidden" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ${
                        isActive(item.path) 
                          ? 'bg-secondary text-primary font-medium' 
                          : 'text-muted-foreground hover:bg-secondary/50 hover:text-primary'
                      }`}
                    >
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
              <User size={16} className="text-muted-foreground" />
            </div>
            <div className="text-sm">
              <p className="font-medium">Rubén Ayuso</p>
              <p className="text-xs text-muted-foreground">ruben@globodain.com</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Settings size={18} />
          </Button>
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
