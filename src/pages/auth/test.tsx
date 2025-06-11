// src/pages/AuthTest.tsx
import React from 'react';
import { useAuth } from '../../lib/sso/AuthContext';

const AuthTest = () => {
  const { isAuthenticated, user, loading, login, logout } = useAuth();

  const handleLogin = () => {
    login();
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Estado de Autenticación</h1>
        
        <div className="mb-4">
          <p className="font-semibold">
            Estado: 
            <span className={`ml-2 ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
              {isAuthenticated ? 'Autenticado' : 'No autenticado'}
            </span>
          </p>
        </div>
        
        {isAuthenticated && user && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="font-bold mb-2">Información del Usuario:</h2>
            <p><span className="font-semibold">ID:</span> {user.id}</p>
            <p><span className="font-semibold">Nombre:</span> {user.name}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <details className="mt-2">
              <summary className="cursor-pointer text-blue-600">Ver datos completos</summary>
              <pre className="mt-2 p-2 bg-gray-200 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(user, null, 2)}
              </pre>
            </details>
          </div>
        )}
        
        <div className="flex justify-center">
          {!isAuthenticated ? (
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Iniciar Sesión con SSO
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthTest;