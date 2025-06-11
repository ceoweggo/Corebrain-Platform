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
  Timer
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../lib/sso/AuthContext';

// API Endpoint
const API_ENDPOINT = import.meta.env?.VITE_API_ENDPOINT || 'https://api.corebrain.ai';

export const TokenManager = () => {
  const [tokens, setTokens] = useState([]);
  const [newTokenName, setNewTokenName] = useState('');
  const [showNewToken, setShowNewToken] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [visibleTokens, setVisibleTokens] = useState({});
  
  // Obtener el contexto de autenticación
  const { isAuthenticated, user, apiToken, loading: authLoading } = useAuth();
  
  // Cargar tokens cuando se tiene el token API
  useEffect(() => {
    if (isAuthenticated && apiToken && !authLoading) {
      fetchTokens();
    }
  }, [isAuthenticated, apiToken, authLoading]);
  
  // Función para obtener tokens desde la API
  const fetchTokens = async () => {
    if (!apiToken) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}/api/auth/tokens`, {
        headers: {
          'Authorization': `Bearer ${apiToken.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Si no hay tokens pero tenemos apiToken, generamos un token virtual para el SSO
        if (data.length === 0) {
          setTokens([{
            id: 'sso-token',
            name: 'Token Globodain SSO',
            token: apiToken.token,
            created: new Date().toISOString().split('T')[0],
            lastUsed: new Date().toISOString().split('T')[0],
            status: 'active',
            type: 'sso'
          }]);
        } else {
          // Asegurarse de que el token SSO siempre esté al principio
          const ssoTokenExists = data.some(token => token.type === 'sso');
          
          if (!ssoTokenExists) {
            setTokens([
              {
                id: 'sso-token',
                name: 'Token Globodain SSO',
                token: apiToken.token,
                created: new Date().toISOString().split('T')[0],
                lastUsed: new Date().toISOString().split('T')[0],
                status: 'active',
                type: 'sso'
              },
              ...data
            ]);
          } else {
            setTokens(data);
          }
        }
      } else {
        console.error('Error al cargar tokens:', response.status);
        toast.error('Error al cargar tokens');
      }
    } catch (error) {
      console.error("Error cargando tokens:", error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };
  
  // Función para crear un nuevo token
  const handleCreateToken = async () => {
    if (!apiToken) {
      toast.error('No se puede crear un token sin autenticación');
      return;
    }
    
    try {
      const response = await fetch(`${API_ENDPOINT}/api/auth/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken.token}`
        },
        body: JSON.stringify({ name: newTokenName })
      });
      
      if (response.ok) {
        const data = await response.json();
        setGeneratedToken(data.token);
        setShowNewToken(true);
        
        // Actualizar lista de tokens
        fetchTokens();
        
        toast.success('Token creado correctamente', {
          description: 'Asegúrate de copiar y guardar tu token en un lugar seguro.',
        });
      } else {
        toast.error('Error al crear token');
      }
    } catch (error) {
      console.error("Error creando token:", error);
      toast.error('Error de conexión');
    }
  };
  
  // Función para copiar token al portapapeles
  const handleCopyToken = (tokenString) => {
    navigator.clipboard.writeText(tokenString);
    toast.success('Token copiado al portapapeles');
  };
  
  // Función para revocar un token
  const handleRevokeToken = async (tokenId) => {
    if (!apiToken) {
      toast.error('No se puede revocar un token sin autenticación');
      return;
    }
    
    try {
      const response = await fetch(`${API_ENDPOINT}/api/auth/tokens/${tokenId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiToken.token}`
        }
      });
      
      if (response.ok) {
        // Actualizar lista de tokens
        fetchTokens();
        toast.success('Token revocado correctamente');
      } else {
        toast.error('Error al revocar token');
      }
    } catch (error) {
      console.error("Error revocando token:", error);
      toast.error('Error de conexión');
    }
  };
  
  // Función para renovar un token
  const handleRefreshToken = async (tokenId) => {
    if (!apiToken) {
      toast.error('No se puede renovar un token sin autenticación');
      return;
    }
    
    try {
      const response = await fetch(`${API_ENDPOINT}/api/auth/tokens/${tokenId}/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Mostrar el nuevo token
        setGeneratedToken(data.token);
        setShowNewToken(true);
        
        // Actualizar lista de tokens
        fetchTokens();
        
        toast.success('Token renovado correctamente', {
          description: 'Asegúrate de actualizar este token en tus aplicaciones.',
        });
      } else {
        toast.error('Error al renovar token');
      }
    } catch (error) {
      console.error("Error renovando token:", error);
      toast.error('Error de conexión');
    }
  };

  // Función para alternar la visibilidad del token
  const toggleTokenVisibility = (tokenId) => {
    setVisibleTokens(prev => ({
      ...prev,
      [tokenId]: !prev[tokenId]
    }));
  };

  // Obtener la fecha formateada
  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Calcular la fecha de expiración desde created + 1 año
  const getExpirationDate = (createdDate) => {
    if (!createdDate) return 'No expira';
    const date = new Date(createdDate);
    date.setFullYear(date.getFullYear() + 1);
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
          <p>Debes iniciar sesión con Globodain SSO para administrar tokens.</p>
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
        <h1 className="text-3xl font-bold tracking-tight">Tokens de Acceso</h1>
        <p className="text-muted-foreground text-lg">
          Administra los tokens de acceso para aplicaciones y CLI
        </p>
        
        {/* Mostrar información de usuario SSO */}
        <Card className="bg-secondary/30">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Timer className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium">Tokens de acceso temporal</h3>
                <p className="text-sm text-muted-foreground">
                  Los tokens de acceso proporcionan autenticación temporal para aplicaciones cliente. A diferencia de las API Keys, caducan y tienen un alcance más limitado.
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
              <CardTitle>Tokens de Acceso</CardTitle>
              <CardDescription>Gestiona tus tokens para herramientas CLI y aplicaciones cliente</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus size={16} />
                  <span>Crear token</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear nuevo token de acceso</DialogTitle>
                  <DialogDescription>
                    Genera un nuevo token para acceder a la CLI o aplicaciones cliente
                  </DialogDescription>
                </DialogHeader>
                
                {!showNewToken ? (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nombre
                      </Label>
                      <Input
                        id="name"
                        placeholder="Ej: CLI Local"
                        className="col-span-3"
                        value={newTokenName}
                        onChange={(e) => setNewTokenName(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    <div className="rounded-md bg-secondary p-3">
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono">{generatedToken}</code>
                        <Button variant="outline" size="icon" onClick={() => handleCopyToken(generatedToken)}>
                          <Copy size={16} />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-amber-600 flex items-center">
                      <AlertCircle size={16} className="mr-2" />
                      Este token solo se mostrará una vez. Guárdalo en un lugar seguro.
                    </p>
                  </div>
                )}
                
                <DialogFooter>
                  {!showNewToken ? (
                    <Button onClick={handleCreateToken} disabled={!newTokenName.trim()}>
                      Generar token
                    </Button>
                  ) : (
                    <Button onClick={() => {
                      setShowNewToken(false);
                      setNewTokenName('');
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
            <div className="py-4 text-center text-muted-foreground">Cargando tokens...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead>Expira</TableHead>
                  <TableHead>Último uso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      No hay tokens disponibles. Crea uno nuevo para comenzar.
                    </TableCell>
                  </TableRow>
                ) : (
                  tokens.map((token) => (
                    <TableRow key={token.id} className="relative">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {token.type === 'sso' && <Shield size={14} className="text-primary" />}
                          <span>{token.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono">
                            {visibleTokens[token.id] ? 
                              token.token : 
                              `••••••••${token.token.substring(token.token.length - 8)}`
                            }
                          </span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleTokenVisibility(token.id)}>
                            {visibleTokens[token.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopyToken(token.token)}>
                            <Copy size={14} />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{formatDate(token.created)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {getExpirationDate(token.created)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(token.lastUsed)}
                      </TableCell>
                      <TableCell>
                        {token.status === 'active' ? (
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
                          {token.type !== 'sso' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleRefreshToken(token.id)}
                            >
                              <RefreshCw size={16} />
                            </Button>
                          )}
                          
                          {/* Solo permitir eliminar si hay más de un token o si no es un token SSO */}
                          {(tokens.length > 1 || token.type !== 'sso') && token.status === 'active' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:text-destructive/80"
                              onClick={() => handleRevokeToken(token.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                          
                          {token.type === 'sso' && (
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
          <CardDescription>Configura opciones adicionales de seguridad para tus tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Rotación automática de tokens</h4>
              <p className="text-sm text-muted-foreground">Genera nuevos tokens cada 30 días</p>
            </div>
            <Switch id="auto-rotation" />
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
              <h4 className="font-medium">Notificaciones de uso</h4>
              <p className="text-sm text-muted-foreground">Recibe alertas cuando se use tu token</p>
            </div>
            <Switch id="usage-alerts" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Autenticación SSO</h4>
              <p className="text-sm text-muted-foreground">Vincula tokens a tu cuenta Globodain SSO</p>
            </div>
            <Switch id="sso-link" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};