import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// Los tres tipos de notificación posibles
type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// Lo que expone el contexto al resto de la app
interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

// Creamos el contexto con un valor por defecto vacío
const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

// Hook personalizado para consumir el contexto fácilmente
// En vez de escribir useContext(ToastContext) en cada sitio,
// escribimos simplemente useToast()
export function useToast() {
  return useContext(ToastContext);
}

// El Provider es el componente que envuelve la app y
// provee el contexto a todos sus hijos
interface Props {
  children: ReactNode;
}

export function ToastProvider({ children }: Props) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();

    // Añadimos el nuevo toast a la lista
    setToasts(prev => [...prev, { id, message, type }]);

    // Lo eliminamos automáticamente después de 3 segundos
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // Colores según el tipo de notificación
  const styles: Record<ToastType, string> = {
    success: 'bg-green-600',
    error:   'bg-red-600',
    info:    'bg-blue-600',
  };

  const icons: Record<ToastType, string> = {
    success: '✓',
    error:   '✕',
    info:    'i',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Contenedor de toasts — esquina inferior derecha */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              ${styles[toast.type]}
              text-white px-4 py-3 rounded-lg shadow-lg
              flex items-center gap-3 text-sm font-medium
              animate-fade-in min-w-64
            `}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs flex-shrink-0">
              {icons[toast.type]}
            </span>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}