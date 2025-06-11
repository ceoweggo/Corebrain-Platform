import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, CheckCircle2, XCircle, Info } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useApiKeys } from '@/hooks/useApiKeys';
import { useAuth } from '@/lib/sso/AuthContext';

const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  apiKeyId: z.string().min(1, "Debes seleccionar una API Key"),
  databaseType: z.enum(["postgresql", "mysql", "mongodb", "sqlite"]),
  connectionString: z.string().min(1, "La cadena de conexión es requerida"),
  options: z.object({
    maxConnections: z.number().min(1).max(100).default(10),
    timeout: z.number().min(1).max(300).default(30),
  }).optional(),
});

export function CreateConnectionForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { apiKeys, isLoading } = useApiKeys();
  const { apiToken } = useAuth();

  // Estado para la API Key seleccionada y su configuración
  const [selectedApiKey, setSelectedApiKey] = useState<any>(null);
  const [apiKeyConfig, setApiKeyConfig] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<null | { success: boolean; message: string }>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      apiKeyId: "",
      databaseType: "postgresql",
      connectionString: "",
      options: {
        maxConnections: 10,
        timeout: 30,
      },
    },
  });

  // Cuando cambia la API Key seleccionada, obtener detalles/configuración
  useEffect(() => {
    const apiKeyId = form.watch('apiKeyId');
    if (!apiKeyId) {
      setSelectedApiKey(null);
      setApiKeyConfig(null);
      setCheckResult(null);
      return;
    }
    const key = apiKeys.find(k => k.id === apiKeyId);
    setSelectedApiKey(key);
    setApiKeyConfig(null);
    setCheckResult(null);
    // Consultar detalles/configuración
    const fetchConfig = async () => {
      try {
        const res = await fetch(`http://localhost:5000/v1/corebrain/api-keys/${apiKeyId}`, {
          headers: {
            'Authorization': `Bearer ${apiToken?.token}`,
          },
        });
        if (!res.ok) throw new Error('No se pudo obtener la configuración');
        const data = await res.json();
        setApiKeyConfig(data);
      } catch {
        setApiKeyConfig(null);
      }
    };
    fetchConfig();
  }, [form.watch('apiKeyId'), apiKeys, apiToken]);

  // Comprobar conexión
  const handleCheckConnection = async () => {
    if (!selectedApiKey) return;
    setChecking(true);
    setCheckResult(null);
    try {
      // Aquí puedes ajustar el endpoint si tienes uno específico para comprobar la conexión
      const res = await fetch(`http://localhost:5000/v1/corebrain/api-keys/${selectedApiKey.id}/check`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connectionString: apiKeyConfig?.configuration?.connectionString }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCheckResult({ success: true, message: '¡Conexión válida!' });
      } else {
        setCheckResult({ success: false, message: data.message || 'Conexión no válida' });
      }
    } catch {
      setCheckResult({ success: false, message: 'Error al comprobar la conexión' });
    } finally {
      setChecking(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('http://localhost:5000/v1/corebrain/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken?.token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Error al crear la conexión');
      }

      toast({
        title: "Conexión creada",
        description: "La conexión se ha creado correctamente",
      });

      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al crear la conexión",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva conexión
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear nueva conexión</DialogTitle>
          <DialogDescription>
            Configura una nueva conexión a una base de datos usando una API Key existente
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombre y descripción */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Mi conexión" {...field} />
                    </FormControl>
                    <FormDescription>
                      Un nombre descriptivo para tu conexión
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input placeholder="Descripción de la conexión" {...field} />
                    </FormControl>
                    <FormDescription>
                      Una descripción opcional de la conexión
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* API Key selector y detalles */}
            <FormField
              control={form.control}
              name="apiKeyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una API Key" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value="loading" disabled>
                          Cargando API Keys...
                        </SelectItem>
                      ) : (
                        apiKeys?.map((key) => (
                          <SelectItem key={key.id} value={key.id}>
                            {key.name} {key.active ? '' : '(Inactiva)'}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecciona la API Key que usarás para esta conexión
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Detalles de la API Key seleccionada */}
            {selectedApiKey && (
              <div className="rounded-md border p-4 bg-muted/50 mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold">Detalles de la API Key</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  <div><b>Nombre:</b> {selectedApiKey.name}</div>
                  <div><b>Nivel:</b> {selectedApiKey.level || 'N/A'}</div>
                  <div><b>Estado:</b> {selectedApiKey.active ? 'Activa' : 'Inactiva'}</div>
                  <div><b>ID:</b> {selectedApiKey.id}</div>
                </div>
                {apiKeyConfig?.configuration && (
                  <div className="mt-2 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 font-medium">Configurada</span>
                      <Button size="sm" variant="secondary" onClick={handleCheckConnection} disabled={checking}>
                        {checking ? 'Comprobando...' : 'Comprobar conexión'}
                      </Button>
                      {checkResult && (
                        <span className={`ml-2 font-semibold ${checkResult.success ? 'text-green-600' : 'text-red-600'}`}>
                          {checkResult.success ? <CheckCircle2 className="inline h-4 w-4 mr-1" /> : <XCircle className="inline h-4 w-4 mr-1" />}
                          {checkResult.message}
                        </span>
                      )}
                    </div>
                    {/* Mostrar configuración en modo solo lectura */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Tipo de base de datos</label>
                        <Input value={apiKeyConfig.configuration.databaseType || ''} readOnly disabled />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Cadena de conexión</label>
                        <Input value={apiKeyConfig.configuration.connectionString || ''} readOnly disabled type="password" />
                      </div>
                    </div>
                  </div>
                )}
                {!apiKeyConfig?.configuration && (
                  <div className="mt-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-yellow-600 font-medium">No configurada</span>
                  </div>
                )}
              </div>
            )}

            {/* Tipo de base de datos y cadena de conexión solo si hay configuración */}
            {apiKeyConfig?.configuration && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-xs font-semibold mb-1">Tipo de base de datos</label>
                  <Input value={apiKeyConfig.configuration.databaseType || ''} readOnly disabled />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Cadena de conexión</label>
                  <Input value={apiKeyConfig.configuration.connectionString || ''} readOnly disabled type="password" />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Crear conexión</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 