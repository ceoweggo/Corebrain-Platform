// src/components/TokenManager.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

// Este componente maneja automáticamente la renovación de tokens
const TokenManager: React.FC = () => {
  const { user, refreshSession } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    // Obtener el tiempo de expiración del token (supongamos 30 minutos)
    const tokenExpirationTime = 30 * 60 * 1000; // 30 minutos en milisegundos
    
    // Programar renovación 5 minutos antes de que expire
    const refreshTime = tokenExpirationTime - (5 * 60 * 1000); 
    
    // Configurar el temporizador para renovar el token
    const timer = setTimeout(async () => {
      setRefreshing(true);
      
      try {
        const success = await refreshSession();
        
        if (!success) {
          console.error('Error al renovar sesión');
        }
      } catch (error) {
        console.error('Error inesperado al renovar sesión:', error);
      } finally {
        setRefreshing(false);
      }
    }, refreshTime);
    
    // Limpiar temporizador al desmontar
    return () => clearTimeout(timer);
  }, [user, refreshSession]);
  
  // No renderiza nada visible, solo maneja renovación de tokens
  return null;
};

export default TokenManager;