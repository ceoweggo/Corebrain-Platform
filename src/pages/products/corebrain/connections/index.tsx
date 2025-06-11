import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Database, Key, Activity } from 'lucide-react';
import { CreateConnectionForm } from './CreateConnectionForm';
import { useAuth } from '@/lib/sso/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface Connection {
  id: string;
  name: string;
  description?: string;
  apiKeyId: string;
  databaseType: string;
  status: 'active' | 'inactive' | 'error';
  created_at: string;
  last_used?: string;
}

export default function Connections() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { apiToken } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await fetch('http://localhost:5000/v1/corebrain/connections', {
          headers: {
            'Authorization': `Bearer ${apiToken?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las conexiones');
        }

        const data = await response.json();
        setConnections(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar las conexiones",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (apiToken) {
      fetchConnections();
    }
  }, [apiToken, toast]);

  const activeConnections = connections.filter(c => c.status === 'active').length;
  const databases = new Set(connections.map(c => c.databaseType)).size;
  const status = connections.length > 0 ? 
    (connections.every(c => c.status === 'active') ? 'Estable' : 'Inestable') : 
    'Sin conexiones';

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Conexiones</h1>
            <p className="text-muted-foreground">
              Gestiona tus conexiones a bases de datos
            </p>
          </div>
          <CreateConnectionForm />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Conexiones activas</CardTitle>
              <CardDescription>
                Total de conexiones configuradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeConnections}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bases de datos</CardTitle>
              <CardDescription>
                Bases de datos conectadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{databases}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
              <CardDescription>
                Estado general de las conexiones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                status === 'Estable' ? 'text-green-500' : 
                status === 'Inestable' ? 'text-yellow-500' : 
                'text-gray-500'
              }`}>
                {status}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de conexiones */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {connections.map((connection) => (
            <Card key={connection.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{connection.name}</CardTitle>
                  <div className={`w-2 h-2 rounded-full ${
                    connection.status === 'active' ? 'bg-green-500' :
                    connection.status === 'error' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`} />
                </div>
                <CardDescription>{connection.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Database className="mr-2 h-4 w-4" />
                    <span>{connection.databaseType}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Key className="mr-2 h-4 w-4" />
                    <span>API Key: {connection.apiKeyId}</span>
                  </div>
                  {connection.last_used && (
                    <div className="flex items-center text-sm">
                      <Activity className="mr-2 h-4 w-4" />
                      <span>Último uso: {new Date(connection.last_used).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Gestionar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
} 