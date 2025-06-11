import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/sso/AuthContext';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used?: string;
  status: 'active' | 'inactive';
  active: boolean;
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiToken } = useAuth();

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await fetch('http://localhost:5000/v1/corebrain/api-keys', {
          headers: {
            'Authorization': `Bearer ${apiToken?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las API Keys');
        }

        const data = await response.json();
        setApiKeys(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    if (apiToken) {
      fetchApiKeys();
    }
  }, [apiToken]);

  return { apiKeys, isLoading, error };
} 