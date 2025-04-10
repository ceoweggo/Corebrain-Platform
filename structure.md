/* Por modificar aún

/dashboard.corebrain.ai/
  ├── src/
  │   ├── components/               # Componentes React reutilizables
  │   │   ├── common/               # Componentes comunes (botones, inputs, etc.)
  │   │   ├── layout/               # Componentes de layout
  │   │   │   ├── Sidebar.tsx
  │   │   │   ├── Header.tsx
  │   │   │   └── MainLayout.tsx
  │   │   ├── auth/                 # Componentes de autenticación
  │   │   ├── dashboard/            # Componentes del dashboard
  │   │   ├── conversations/        # Componentes de conversaciones
  │   │   ├── analytics/            # Componentes de analíticas
  │   │   └── settings/             # Componentes de configuración
  │   ├── pages/                    # Páginas de la aplicación
  │   │   ├── Login.tsx             # Página de login
  │   │   ├── Register.tsx          # Página de registro
  │   │   ├── Dashboard.tsx         # Página principal
  │   │   ├── Conversations.tsx     # Página de conversaciones
  │   │   ├── Analytics.tsx         # Página de analíticas
  │   │   ├── ApiKeys.tsx           # Gestión de API keys
  │   │   ├── Integrations.tsx      # Página de integraciones
  │   │   └── Settings.tsx          # Página de configuración
  │   ├── services/                 # Servicios para API
  │   │   ├── api.ts                # Cliente API base
  │   │   ├── auth.ts               # Servicio de autenticación
  │   │   ├── conversations.ts      # Servicio de conversaciones
  │   │   └── analytics.ts          # Servicio de analíticas
  │   ├── store/                    # Estado global (Redux/Zustand)
  │   │   ├── auth/                 # Estado de autenticación
  │   │   ├── conversations/        # Estado de conversaciones
  │   │   └── analytics/            # Estado de analíticas
  │   ├── hooks/                    # Hooks personalizados
  │   │   ├── useAuth.ts            # Hook de autenticación
  │   │   ├── useConversations.ts   # Hook de conversaciones
  │   │   └── useAnalytics.ts       # Hook de analíticas
  │   ├── utils/                    # Utilidades
  │   │   ├── formatters.ts         # Formateadores (fechas, números, etc.)
  │   │   ├── validators.ts         # Validadores
  │   │   └── helpers.ts            # Funciones auxiliares
  │   ├── types/                    # Definiciones de tipos TypeScript
  │   │   ├── user.ts               # Tipos de usuario
  │   │   ├── conversation.ts       # Tipos de conversación
  │   │   └── analytics.ts          # Tipos de analíticas
  │   ├── config/                   # Configuración
  │   │   ├── routes.ts             # Configuración de rutas
  │   │   └── api.ts                # Configuración de API
  │   ├── assets/                   # Recursos estáticos
  │   │   ├── images/               # Imágenes
  │   │   ├── icons/                # Iconos
  │   │   └── styles/               # Estilos globales
  │   ├── App.tsx                   # Componente principal
  │   ├── index.tsx                 # Punto de entrada
  │   └── router.tsx                # Configuración de enrutamiento
  ├── public/                       # Archivos públicos
  │   ├── index.html                # HTML principal
  │   ├── favicon.ico               # Favicon
  │   └── assets/                   # Activos estáticos
  ├── package.json                  # Dependencias npm
  ├── tsconfig.json                 # Configuración TypeScript
  ├── vite.config.ts                # Configuración de Vite
  ├── .eslintrc.js                  # Configuración ESLint
  ├── .prettierrc                   # Configuración Prettier
  ├── Dockerfile                    # Configuración Docker
  ├── nginx.conf                    # Configuración Nginx para producción
  └── README.md                     # Documentación