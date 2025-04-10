
import React, { useState } from 'react';
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
  AlertCircle 
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

// Datos de ejemplo
const tokens = [
  { 
    id: '1', 
    name: 'API Principal Admin', 
    token: 'sk_Azgjr11HRgKI0O3OTFjuOSsi', 
    created: '2025-03-23', 
    lastUsed: '2025-03-23', 
    status: 'active' 
  }
];

export const TokenManager = () => {
  const [newTokenName, setNewTokenName] = useState('');
  const [showNewToken, setShowNewToken] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  
  const handleCreateToken = () => {
    // Generar un token aleatorio
    const newToken = 'sk_live_' + Array.from({length: 24}, () => 
      '0123456789abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 36)]
    ).join('');
    
    setGeneratedToken(newToken);
    setShowNewToken(true);
    
    toast.success('Token creado correctamente', {
      description: 'Asegúrate de copiar y guardar tu token en un lugar seguro.',
    });
  };
  
  const handleCopyToken = () => {
    navigator.clipboard.writeText(generatedToken);
    toast.success('Token copiado al portapapeles');
  };
  
  const handleRevokeToken = (tokenId: string) => {
    toast.success('Token revocado correctamente');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Tokens API</h1>
        <p className="text-muted-foreground text-lg">
          Administra los tokens de acceso para conectar tu aplicación
        </p>
      </div>
      
      <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tokens de API</CardTitle>
              <CardDescription>Gestiona tus tokens para acceder a la API de ChatUI SDK</CardDescription>
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
                  <DialogTitle>Crear nuevo token</DialogTitle>
                  <DialogDescription>
                    Genera un nuevo token para acceder a la API de ChatUI SDK
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
                        placeholder="Ej: App Web"
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
                        <Button variant="outline" size="icon" onClick={handleCopyToken}>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead>Último uso</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.map((token) => (
                <TableRow key={token.id}>
                  <TableCell className="font-medium">{token.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono">••••••••{token.token.substring(token.token.length - 8)}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                        navigator.clipboard.writeText(token.token);
                        toast.success('Token copiado al portapapeles');
                      }}>
                        <Copy size={14} />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{token.created}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{token.lastUsed}</TableCell>
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
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <RefreshCw size={16} />
                      </Button>
                      {token.status === 'active' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive/80"
                          onClick={() => handleRevokeToken(token.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenManager;
