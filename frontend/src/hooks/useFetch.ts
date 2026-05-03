import { useState, useEffect, useCallback, useRef } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useFetch<T>(fetchFn: () => Promise<T>): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useRef nos permite saber si el componente sigue montado
  // sin que el cambio de valor cause un re-render
  const isMounted = useRef(true);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      if (isMounted.current) setData(result);
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    isMounted.current = true;
    execute();

    // Función de limpieza: se ejecuta cuando el componente se desmonta
    return () => {
      isMounted.current = false;
    };
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

export default useFetch;