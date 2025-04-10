
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { BarChart2, MessageCircle, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

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

export const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Bienvenido al panel de control de Corebrain
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up" style={{animationDelay: '0.1s'}}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mensajes totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">2,432</div>
              <div className="flex items-center text-green-500 text-sm font-medium">
                <ArrowUpRight size={14} className="mr-1" />
                <span>+12.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up" style={{animationDelay: '0.2s'}}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Usuarios activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">186</div>
              <div className="flex items-center text-green-500 text-sm font-medium">
                <ArrowUpRight size={14} className="mr-1" />
                <span>+8.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up" style={{animationDelay: '0.3s'}}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tokens activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">24</div>
              <div className="flex items-center text-green-500 text-sm font-medium">
                <ArrowUpRight size={14} className="mr-1" />
                <span>+4.0%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up" style={{animationDelay: '0.4s'}}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasa de respuesta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">98.3%</div>
              <div className="flex items-center text-red-500 text-sm font-medium">
                <ArrowDownRight size={14} className="mr-1" />
                <span>-0.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 transition-all duration-300 hover:shadow-md animate-slide-up" style={{animationDelay: '0.5s'}}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mensajes por día</CardTitle>
                <CardDescription>Última semana</CardDescription>
              </div>
              <MessageCircle className="text-muted-foreground" size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={messageData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#888' }}
                    axisLine={{ stroke: '#f1f1f1' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#888' }}
                    axisLine={{ stroke: '#f1f1f1' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #f3f4f6',
                      borderRadius: '8px',
                      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0284c7" 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 transition-all duration-300 hover:shadow-md animate-slide-up" style={{animationDelay: '0.6s'}}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Usuarios nuevos</CardTitle>
                <CardDescription>Última semana</CardDescription>
              </div>
              <Users className="text-muted-foreground" size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={usersData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#888' }}
                    axisLine={{ stroke: '#f1f1f1' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#888' }}
                    axisLine={{ stroke: '#f1f1f1' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #f3f4f6',
                      borderRadius: '8px',
                      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#0284c7" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
