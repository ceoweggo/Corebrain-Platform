import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Copy, 
  Key, 
  Plus, 
  RefreshCw, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Shield,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/sso/AuthContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// API Endpoint
const API_ENDPOINT = import.meta.env?.VITE_API_ENDPOINT || 'https://api.etedata.ai';

export const ApiKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyLevel, setNewKeyLevel] = useState('read');
  const [showNewKey, setShowNewKey] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState({});
  
  // Obtener el contexto de autenticación
  const { isAuthenticated, user, apiToken, loading: authLoading } = useAuth();
  
  // Cargar API Keys cuando se tiene el token API
  useEffect(() => {
    if (isAuthenticated && apiToken && !authLoading) {
      console.log("apiToken: ", apiToken);

      fetchApiKeys();
    }
  }, [isAuthenticated, apiToken, authLoading]);
  
  // Función para obtener API Keys desde la API
  const fetchApiKeys = async () => {
    if (!apiToken) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}/v1/corebrain/api-keys/`, {
        headers: {
          'Authorization': `Bearer ${apiToken.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("data: ", data);
        // Si no hay API Keys pero tenemos apiToken, generamos un key virtual para el SSO
        
        setApiKeys(data);
          
        
      } else {
        console.error('Error al cargar API Keys:', response.status);
        toast.error('Error al cargar API Keys');
      }
    } catch (error) {
      console.error("Error cargando API Keys:", error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };
  
  // Función para crear una nueva API Key
  const handleCreateApiKey = async () => {
    if (!apiToken) {
      toast.error('No se puede crear una API Key sin autenticación');
      return;
    }
    
    try {
      const response = await fetch(`${API_ENDPOINT}/v1/corebrain/api-keys/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken.token}`
        },
        body: JSON.stringify({ 
          name: newKeyName,
          level: newKeyLevel
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setGeneratedKey(data.key);
        setShowNewKey(true);
        
        // Actualizar lista de API Keys
        fetchApiKeys();
        
        toast.success('API Key creada correctamente', {
          description: 'Asegúrate de copiar y guardar tu API Key en un lugar seguro.',
        });
      } else {
        toast.error('Error al crear API Key');
      }
    } catch (error) {
      console.error("Error creando API Key:", error);
      toast.error('Error de conexión');
    }
  };
  
  // Función para copiar API Key al portapapeles
  const handleCopyKey = (keyString) => {
    navigator.clipboard.writeText(keyString);
    toast.success('API Key copiada al portapapeles');
  };
  
  // Función para revocar una API Key
  const handleRevokeApiKey = async (keyId) => {
    if (!apiToken) {
      toast.error('No se puede revocar una API Key sin autenticación');
      return;
    }
    
    try {
      const response = await fetch(`${API_ENDPOINT}/v1/corebrain/api-keys/${keyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiToken.token}`
        }
      });
      
      if (response.ok) {
        // Actualizar lista de API Keys
        fetchApiKeys();
        toast.success('API Key revocada correctamente');
      } else {
        toast.error('Error al revocar API Key');
      }
    } catch (error) {
      console.error("Error revocando API Key:", error);
      toast.error('Error de conexión');
    }
  };
  
  // Función para renovar una API Key
  const handleRefreshApiKey = async (keyId) => {
    if (!apiToken) {
      toast.error('No se puede renovar una API Key sin autenticación');
      return;
    }
    
    try {
      const response = await fetch(`${API_ENDPOINT}/v1/corebrain/api-keys/${keyId}/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Mostrar la nueva API Key
        setGeneratedKey(data.key);
        setShowNewKey(true);
        
        // Actualizar lista de API Keys
        fetchApiKeys();
        
        toast.success('API Key renovada correctamente', {
          description: 'Asegúrate de actualizar esta API Key en tus aplicaciones.',
        });
      } else {
        toast.error('Error al renovar API Key');
      }
    } catch (error) {
      console.error("Error renovando API Key:", error);
      toast.error('Error de conexión');
    }
  };

  // Función para alternar la visibilidad de la API Key
  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  // Obtener la fecha formateada
  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Si hay error de carga de autenticación
  if (authLoading) {
    return (
      <Card className="p-8">
        <CardContent className="pt-6 text-center">
          <p>Verificando autenticación...</p>
        </CardContent>
      </Card>
    );
  }

  // Si no hay usuario autenticado
  if (!isAuthenticated) {
    return (
      <Card className="p-8 text-center">
        <CardHeader>
          <CardTitle>Acceso no autorizado</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Debes iniciar sesión con Globodain SSO para administrar API Keys.</p>
          <Button className="mt-4" onClick={() => window.location.href = '/auth/login'}>
            Iniciar sesión
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground text-lg">
          Administra tus claves de API para conectar servicios externos
        </p>
        
        {/* Mostrar información de usuario SSO */}
        <Card className="bg-secondary/30">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Lock className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium">Seguridad de API Keys</h3>
                <p className="text-sm text-muted-foreground">
                  Las API Keys te permiten autenticar solicitudes a la API. Mantenlas seguras y no las compartas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Gestiona tus claves para acceder a los servicios de CoreBrain</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus size={16} />
                  <span>Crear API Key</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear nueva API Key</DialogTitle>
                  <DialogDescription>
                    Genera una nueva clave para acceder a la API de CoreBrain
                  </DialogDescription>
                </DialogHeader>
                
                {!showNewKey ? (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nombre
                      </Label>
                      <Input
                        id="name"
                        placeholder="Ej: Integración Web"
                        className="col-span-3"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="level" className="text-right">
                        Nivel de acceso
                      </Label>
                      <Select value={newKeyLevel} onValueChange={setNewKeyLevel}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecciona nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="read">Solo lectura</SelectItem>
                          <SelectItem value="write">Lectura y escritura</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    <div className="rounded-md bg-secondary p-3">
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono">{generatedKey}</code>
                        <Button variant="outline" size="icon" onClick={() => handleCopyKey(generatedKey)}>
                          <Copy size={16} />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-amber-600 flex items-center">
                      <AlertCircle size={16} className="mr-2" />
                      Esta API Key solo se mostrará una vez. Guárdala en un lugar seguro.
                    </p>
                  </div>
                )}
                
                <DialogFooter>
                  {!showNewKey ? (
                    <Button onClick={handleCreateApiKey} disabled={!newKeyName.trim()}>
                      Generar API Key
                    </Button>
                  ) : (
                    <Button onClick={() => {
                      setShowNewKey(false);
                      setNewKeyName('');
                      setNewKeyLevel('read');
                    }}>
                      Aceptar
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-4 text-center text-muted-foreground">Cargando API Keys...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead>Último uso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      No hay API Keys disponibles. Crea una nueva para comenzar.
                    </TableCell>
                  </TableRow>
                ) : (
                  apiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id} className="relative">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {apiKey.type === 'sso' && <Shield size={14} className="text-primary" />}
                          <span>{apiKey.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono">
                            {visibleKeys[apiKey.id] ? 
                              (apiKey.key || "sk_mWhmeN4R5LV7gq0MTpIkIvtr") : 
                              `••••••••${(apiKey.key || "sk_mWhmeN4R5LV7gq0MTpIkIvtr").substring((apiKey.key || "sk_mWhmeN4R5LV7gq0MTpIkIvtr").length - 8)}`
                            }
                          </span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleKeyVisibility(apiKey.id)}>
                            {visibleKeys[apiKey.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopyKey(apiKey.key || "sk_mWhmeN4R5LV7gq0MTpIkIvtr")}>
                            <Copy size={14} />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          apiKey.level === 'admin' ? 'destructive' : 
                          apiKey.level === 'write' ? 'default' : 'outline'
                        }>
                          {apiKey.level === 'read' ? 'Lectura' : 
                           apiKey.level === 'write' ? 'Escritura' : 'Admin'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{formatDate(apiKey.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(apiKey.last_used_at)}
                      </TableCell>
                      <TableCell>
                        {apiKey.active ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle size={12} className="mr-1" />
                            Activo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Revocado
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {apiKey.type !== 'sso' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleRefreshApiKey(apiKey.id)}
                            >
                              <RefreshCw size={16} />
                            </Button>
                          )}
                          
                          {/* Solo permitir eliminar si hay más de una API Key o si no es una API Key SSO */}
                          {(apiKeys.length > 1 || apiKey.type !== 'sso') && apiKey.active && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:text-destructive/80"
                              onClick={() => handleRevokeApiKey(apiKey.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                          
                          {apiKey.type === 'sso' && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              SSO
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Card className="transition-all duration-300 hover:shadow-md animate-slide-up" style={{animationDelay: '0.2s'}}>
        <CardHeader>
          <CardTitle>Configuración de seguridad</CardTitle>
          <CardDescription>Configura opciones adicionales de seguridad para tus API Keys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Limitación por dominio</h4>
              <p className="text-sm text-muted-foreground">Restringe el uso de API Keys a dominios específicos</p>
            </div>
            <Switch id="domain-restriction" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Verificación IP</h4>
              <p className="text-sm text-muted-foreground">Restringe el acceso a IPs específicas</p>
            </div>
            <Switch id="ip-restrict" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Expiración automática</h4>
              <p className="text-sm text-muted-foreground">Define un tiempo de vida para las API Keys</p>
            </div>
            <Switch id="auto-expiration" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Notificaciones de uso</h4>
              <p className="text-sm text-muted-foreground">Recibe alertas cuando se usen tus API Keys</p>
            </div>
            <Switch id="usage-alerts" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};