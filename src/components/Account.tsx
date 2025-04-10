
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Bell, 
  Upload, 
  Save,
  LogOut, 
  Trash2
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export const Account = () => {
  const [user, setUser] = useState({
    name: 'Usuario Demo',
    email: 'usuario@empresa.com',
    company: 'Empresa Demo, S.L.',
    phone: '+34 600 123 456',
    avatar: ''
  });
  
  const saveProfileChanges = () => {
    toast.success('Perfil actualizado correctamente');
  };
  
  const savePasswordChanges = () => {
    toast.success('Contraseña actualizada correctamente');
  };
  
  const handleDeleteAccount = () => {
    toast.error('Esta acción es irreversible. Contacta con soporte para eliminar tu cuenta.');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Mi cuenta</h1>
        <p className="text-muted-foreground text-lg">
          Gestiona la información de tu cuenta y preferencias
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4 space-y-6">
          <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
            <CardHeader>
              <CardTitle>Mi perfil</CardTitle>
              <CardDescription>
                Actualiza tu información personal
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
              <div className="w-full">
                <Button variant="outline" className="w-full mb-2">
                  <Upload className="mr-2 h-4 w-4" />
                  Cambiar foto
                </Button>
                <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md animate-slide-up" style={{animationDelay: '0.1s'}}>
            <CardHeader>
              <CardTitle className="text-destructive">Zona peligrosa</CardTitle>
              <CardDescription>
                Acciones irreversibles para tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleDeleteAccount}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar cuenta
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-8">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="security">Seguridad</TabsTrigger>
              <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6 pt-6">
              <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
                <CardHeader>
                  <CardTitle>Información personal</CardTitle>
                  <CardDescription>
                    Actualiza tu información de perfil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input 
                        id="name" 
                        value={user.name}
                        onChange={(e) => setUser({...user, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({...user, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input 
                        id="company" 
                        value={user.company}
                        onChange={(e) => setUser({...user, company: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input 
                        id="phone" 
                        value={user.phone}
                        onChange={(e) => setUser({...user, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={saveProfileChanges} className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      Guardar cambios
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6 pt-6">
              <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
                <CardHeader>
                  <CardTitle>Cambiar contraseña</CardTitle>
                  <CardDescription>
                    Actualiza tu contraseña de acceso
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Contraseña actual</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nueva contraseña</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={savePasswordChanges} className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      Actualizar contraseña
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="transition-all duration-300 hover:shadow-md animate-slide-up" style={{animationDelay: '0.1s'}}>
                <CardHeader>
                  <CardTitle>Seguridad de la cuenta</CardTitle>
                  <CardDescription>
                    Configura opciones adicionales de seguridad
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">Autenticación de dos factores</h4>
                      <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad</p>
                    </div>
                    <Switch id="2fa" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">Sesiones activas</h4>
                      <p className="text-sm text-muted-foreground">Gestionar dispositivos conectados</p>
                    </div>
                    <Button variant="outline" size="sm">Gestionar</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">Historial de actividad</h4>
                      <p className="text-sm text-muted-foreground">Ver historial de accesos</p>
                    </div>
                    <Button variant="outline" size="sm">Ver</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6 pt-6">
              <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
                <CardHeader>
                  <CardTitle>Preferencias de notificaciones</CardTitle>
                  <CardDescription>
                    Configura cómo y cuándo quieres recibir notificaciones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notificaciones por email</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">Informes semanales</h4>
                        <p className="text-sm text-muted-foreground">Resumen semanal de actividad</p>
                      </div>
                      <Switch id="weekly-reports" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">Alertas de seguridad</h4>
                        <p className="text-sm text-muted-foreground">Actividad sospechosa en tu cuenta</p>
                      </div>
                      <Switch id="security-alerts" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">Actualizaciones de producto</h4>
                        <p className="text-sm text-muted-foreground">Nuevas características y mejoras</p>
                      </div>
                      <Switch id="product-updates" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">Noticias y promociones</h4>
                        <p className="text-sm text-muted-foreground">Ofertas y novedades del servicio</p>
                      </div>
                      <Switch id="marketing" />
                    </div>
                  </div>
                  
                  <div className="pt-6 space-y-4">
                    <h3 className="text-sm font-medium">Notificaciones push</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">Mensajes nuevos</h4>
                        <p className="text-sm text-muted-foreground">Cuando recibes un nuevo mensaje</p>
                      </div>
                      <Switch id="push-messages" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">Errores del sistema</h4>
                        <p className="text-sm text-muted-foreground">Problemas que requieren atención</p>
                      </div>
                      <Switch id="push-errors" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Account;
