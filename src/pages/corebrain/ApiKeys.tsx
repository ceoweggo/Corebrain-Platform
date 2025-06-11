import React from 'react';
import { useSubscription } from '@/lib/subscription/SubscriptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Plus, Copy, Key, AlertTriangle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  status: 'active' | 'revoked';
}

export const CoreBrainApiKeys = () => {
  const { subscription } = useSubscription();
  const coreBrainSub = subscription?.products?.corebrain;
  const apiKeysFeature = coreBrainSub?.features?.api_keys;

  const [apiKeys, setApiKeys] = React.useState<ApiKey[]>([]);
  const [showNewKeyDialog, setShowNewKeyDialog] = React.useState(false);
  const [newKeyName, setNewKeyName] = React.useState('');
  const [newKey, setNewKey] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Simular carga de API Keys
  React.useEffect(() => {
    // Aquí iría la llamada a tu API
    setApiKeys([
      {
        id: '1',
        name: 'Producción',
        key: 'sk_live_xxxxxxxxxxxxx',
        createdAt: '2024-03-15T10:00:00Z',
        lastUsed: '2024-03-20T15:30:00Z',
        status: 'active',
      },
      {
        id: '2',
        name: 'Desarrollo',
        key: 'sk_test_xxxxxxxxxxxxx',
        createdAt: '2024-03-10T08:00:00Z',
        lastUsed: '2024-03-19T12:45:00Z',
        status: 'active',
      },
    ]);
  }, []);

  const handleCreateKey = async () => {
    setLoading(true);
    try {
      // Aquí iría la llamada a tu API para crear una nueva key
      const newApiKey = {
        id: Date.now().toString(),
        name: newKeyName,
        key: `sk_${Math.random().toString(36).substring(2)}`,
        createdAt: new Date().toISOString(),
        status: 'active' as const,
      };
      
      setApiKeys([...apiKeys, newApiKey]);
      setNewKey(newApiKey.key);
      setNewKeyName('');
    } catch (error) {
      console.error('Error creating API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    // Aquí podrías mostrar una notificación de éxito
  };

  const handleRevokeKey = async (keyId: string) => {
    // Aquí iría la llamada a tu API para revocar la key
    setApiKeys(apiKeys.map(key => 
      key.id === keyId ? { ...key, status: 'revoked' as const } : key
    ));
  };

  if (!coreBrainSub?.active) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="warning" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Suscripción requerida</AlertTitle>
          <AlertDescription>
            Necesitas una suscripción activa para acceder a CoreBrain SDK.
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>CoreBrain SDK - API Keys</CardTitle>
            <CardDescription>
              Genera y administra tus claves de API para conectar con CoreBrain SDK
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/subscription/plans/corebrain">
                Ver planes disponibles
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!apiKeysFeature?.active) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="warning" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Característica no disponible</AlertTitle>
          <AlertDescription>
            La generación de API Keys no está disponible en tu plan actual.
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Actualiza tu plan</CardTitle>
            <CardDescription>
              Actualiza tu plan para acceder a la generación y gestión de API Keys.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/subscription/plans/corebrain">
                Ver planes disponibles
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">API Keys</h1>
          <p className="text-muted-foreground">
            Genera y administra tus claves de API para conectar con CoreBrain SDK
          </p>
        </div>
        <Button onClick={() => setShowNewKeyDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva API Key
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tus API Keys</CardTitle>
          <CardDescription>
            Lista de todas tus API Keys activas y revocadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Creada</TableHead>
                <TableHead>Último uso</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                      {apiKey.key}
                    </code>
                  </TableCell>
                  <TableCell>{new Date(apiKey.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {apiKey.lastUsed 
                      ? new Date(apiKey.lastUsed).toLocaleDateString()
                      : 'Nunca'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={apiKey.status === 'active' ? 'default' : 'secondary'}
                    >
                      {apiKey.status === 'active' ? 'Activa' : 'Revocada'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyKey(apiKey.key)}
                      disabled={apiKey.status !== 'active'}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRevokeKey(apiKey.id)}
                      disabled={apiKey.status !== 'active'}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nueva API Key</DialogTitle>
            <DialogDescription>
              Introduce un nombre descriptivo para tu nueva API Key
            </DialogDescription>
          </DialogHeader>

          {newKey ? (
            <>
              <div className="space-y-4">
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertTitle>¡API Key creada con éxito!</AlertTitle>
                  <AlertDescription>
                    Guarda esta clave en un lugar seguro. No podrás volver a verla.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Label>Tu nueva API Key</Label>
                  <div className="flex space-x-2">
                    <code className="flex-1 relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                      {newKey}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopyKey(newKey)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => {
                  setShowNewKeyDialog(false);
                  setNewKey(null);
                }}>
                  Cerrar
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la API Key</Label>
                  <Input
                    id="name"
                    placeholder="ej. Producción"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowNewKeyDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateKey}
                  disabled={!newKeyName || loading}
                >
                  Crear API Key
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 