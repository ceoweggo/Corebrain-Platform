import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  BarChart2, 
  Database,
  Boxes,
  Cpu,
  Settings,
  User,
  KeyRound,
  FileCode,
  Wrench,
  Gauge,
  BookOpen,
  MessageSquare,
  Shield,
  Menu,
  LayoutDashboard,
  Code2,
  Braces,
  Brain,
  Workflow,
  Bot,
  HelpCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Building2,
  CreditCard,
  PanelLeftClose,
  PanelLeftOpen,
  Activity,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import { useAuth } from '../lib/sso/AuthContext';
import { useTheme } from '../utils/ThemeContext';
import { UserDropdown } from './custom/user/sidebarDropdown';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface MenuItemProps {
  item: any;
  level?: number;
  isCollapsed: boolean;
  isMobile: boolean;
  isActive: (path: string) => boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, level = 0, isCollapsed, isMobile, isActive }) => {
  const [isOpen, setIsOpen] = useState(isActive(item.path));

  useEffect(() => {
    if (isActive(item.path)) {
      setIsOpen(true);
    }
  }, [item.path, isActive]);

  const menuContent = (
    <>
      <span className={cn(
        "flex items-center justify-center",
        (!isCollapsed || isMobile || level > 0) && "mr-3"
      )}>
        {item.icon}
      </span>
      {(!isCollapsed || isMobile) && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.comingSoon && (
            <span className="text-xs text-muted-foreground">Próximamente</span>
          )}
          {item.children && (
            <span 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="cursor-pointer"
            >
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          )}
        </>
      )}
    </>
  );

  const linkElement = (
    <>
      <Link
        to={item.path}
        onClick={(e) => {
          if (item.children) {
            e.preventDefault();
          }
        }}
        className={cn(
          "group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          {
            "bg-accent text-accent-foreground": isActive(item.path),
            "opacity-60": item.comingSoon,
            "pl-9": level > 0 && !isCollapsed,
            "justify-center": isCollapsed && !isMobile && level === 0,
          }
        )}
      >
        {menuContent}
      </Link>
      {item.children && isOpen && !isCollapsed && (
        <div className="mt-1 ml-4">
          {item.children.map((child: any, index: number) => (
            <MenuItem
              key={index}
              item={child}
              level={level + 1}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              isActive={isActive}
            />
          ))}
        </div>
      )}
    </>
  );

  if (isCollapsed && !isMobile && level === 0) {
    if (item.children) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>{linkElement}</div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="min-w-[200px]">
            <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {item.children.map((child: any, index: number) => (
              <DropdownMenuItem key={index} asChild>
                <Link
                  to={child.path}
                  className={cn(
                    "flex items-center w-full",
                    isActive(child.path) && "bg-accent text-accent-foreground"
                  )}
                >
                  {child.icon && <span className="mr-2">{child.icon}</span>}
                  {child.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>{linkElement}</div>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center">
            {item.label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return linkElement;
};

interface SidebarProps {
  className?: string;
  onCollapsedChange?: (collapsed: boolean) => void;
  isOpenMobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, onCollapsedChange, isOpenMobile }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = sessionStorage.getItem('sidebar-collapsed');
    return stored === null ? true : stored === 'true';
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobileScreen = window.innerWidth < 768;
      setIsMobile(isMobileScreen);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const mainMenuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/",
    },
  ];

  const installedProducts = [
    {
      icon: <Brain size={20} />,
      label: "Corebrain",
      path: "/products/corebrain",
      children: [
        {
          icon: <Database size={20} />,
          label: "Conexiones",
          path: "/products/corebrain/connections",
        },
        {
          icon: <Code2 size={20} />,
          label: "API Keys",
          path: "/products/corebrain/api-keys",
        },
        {
          icon: <Braces size={20} />,
          label: "SDK",
          path: "/products/corebrain/sdk",
        },
        {
          icon: <Activity size={20} />,
          label: "Logs",
          path: "/products/corebrain/logs",
        },
        {
          icon: <MessageSquare size={20} />,
          label: "Chat",
          path: "/products/corebrain/chat",
        },
        {
          icon: <FileCode size={20} />,
          label: "Generador de código",
          path: "/products/corebrain/code-generator",
        },
        {
          icon: <Settings size={20} />,
          label: "Configuración",
          path: "/products/corebrain/settings",
        },
        {
          icon: <FileText size={20} />,
          label: "Documentación",
          path: "/products/corebrain/docs",
        },
      ],
    },
  ];

  const availableProducts = [
    {
      icon: <Workflow size={20} />,
      label: "DataFlow",
      path: "/products/dataflow",
      comingSoon: true,
      description: "Automatización de flujos de datos",
    },
    {
      icon: <Bot size={20} />,
      label: "AI Engine",
      path: "/products/ai-engine",
      comingSoon: true,
      description: "Motor de inteligencia artificial",
    },
  ];

  const accountItems = [
    {
      icon: <Building2 size={20} />,
      label: "Organización",
      path: "/organization",
    },
    {
      icon: <User size={20} />,
      label: "Equipo",
      path: "/team",
    },
    {
      icon: <CreditCard size={20} />,
      label: "Facturación",
      path: "/billing",
    },
  ];

  const supportItems = [
    {
      icon: <HelpCircle size={20} />,
      label: "Centro de ayuda",
      path: "/help",
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Soporte",
      path: "/support",
    },
  ];

  const renderMenuItems = (items: any[]) => {
    return items.map((item, index) => (
      <MenuItem
        key={index}
        item={item}
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        isActive={isActive}
      />
    ));
  };

  const handleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  const sidebarContent = (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out",
        isCollapsed && !isMobile ? "w-16" : "w-64",
        isMobile && !isOpenMobile && "hidden",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {(!isCollapsed || isMobile) ? (
          <img
            src={theme === "dark" ? "/logo-dark.svg" : "/logo.svg"}
            alt="Logo"
            className="h-8 w-auto"
          />
        ) : (
          <div className="flex items-center justify-center w-full">
            <img
              src={theme === "dark" ? "/icon-dark.svg" : "/icon-light.svg"}
              alt="Icon"
              className="h-8 w-8"
            />
          </div>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCollapse}
            className="h-8 w-8"
          >
            {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <nav className="flex flex-col gap-1">
          {renderMenuItems(mainMenuItems)}
        </nav>

        <div className="mt-4">
          <div className="flex items-center gap-2 px-3 py-2">
            <Boxes size={16} className="text-muted-foreground" />
            {(!isCollapsed || isMobile) && (
              <span className="text-xs font-medium text-muted-foreground">
                Productos instalados
              </span>
            )}
          </div>
          <nav className="flex flex-col gap-1">
            {renderMenuItems(installedProducts)}
          </nav>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 px-3 py-2">
            <Boxes size={16} className="text-muted-foreground" />
            {(!isCollapsed || isMobile) && (
              <span className="text-xs font-medium text-muted-foreground">
                Productos disponibles
              </span>
            )}
          </div>
          <nav className="flex flex-col gap-1">
            {renderMenuItems(availableProducts)}
          </nav>
        </div>

        <Separator className="my-4" />

        <div>
          <div className="flex items-center gap-2 px-3 py-2">
            <Building2 size={16} className="text-muted-foreground" />
            {(!isCollapsed || isMobile) && (
              <span className="text-xs font-medium text-muted-foreground">
                Cuenta
              </span>
            )}
          </div>
          <nav className="flex flex-col gap-1">
            {renderMenuItems(accountItems)}
          </nav>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 px-3 py-2">
            <HelpCircle size={16} className="text-muted-foreground" />
            {(!isCollapsed || isMobile) && (
              <span className="text-xs font-medium text-muted-foreground">
                Soporte
              </span>
            )}
          </div>
          <nav className="flex flex-col gap-1">
            {renderMenuItems(supportItems)}
          </nav>
        </div>
      </div>

      <div className="border-t p-4">
        {(!isCollapsed || isMobile) ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                <User size={16} className="text-muted-foreground" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  {user?.name?.split(' ')[0] || user?.username?.split(' ')[0]}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <UserDropdown />
          </div>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-center">
                  <UserDropdown />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                {user?.name || user?.username}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {sidebarContent}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="fixed left-4 top-4 z-50 md:hidden"
        >
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </Button>
      )}
    </>
  );
}

export default Sidebar;