import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Establecer el valor inicial
    setMatches(media.matches);

    // Crear el listener
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Añadir el listener
    media.addEventListener('change', listener);

    // Limpiar
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}; 