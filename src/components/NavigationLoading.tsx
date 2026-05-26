'use client';

// Provider + overlay para bloquear la UI mientras una navegacion server-rendered
// esta en curso (cambio de filtro, busqueda, click en tarjeta de indicador, etc).
//
// Patron: el provider mantiene un useTransition. Cualquier componente cliente que
// dispare router.push debe envolverlo en startNavigation(() => router.push(...)).
// Mientras isPending es true, se renderiza un overlay fijo encima de todo que
// captura clicks y muestra un spinner.

import {
  createContext,
  useCallback,
  useContext,
  useTransition,
  type ReactNode,
} from 'react';

type NavigationLoadingContextValue = {
  isPending: boolean;
  startNavigation: (fn: () => void) => void;
};

const NavigationLoadingContext =
  createContext<NavigationLoadingContextValue | null>(null);

export function NavigationLoadingProvider({ children }: { children: ReactNode }) {
  const [isPending, startTransition] = useTransition();

  const startNavigation = useCallback(
    (fn: () => void) => {
      startTransition(() => {
        fn();
      });
    },
    [startTransition],
  );

  return (
    <NavigationLoadingContext.Provider value={{ isPending, startNavigation }}>
      {children}
      {isPending && <LoadingOverlay />}
    </NavigationLoadingContext.Provider>
  );
}

export function useNavigationLoading(): NavigationLoadingContextValue {
  const ctx = useContext(NavigationLoadingContext);
  if (!ctx) {
    // Fallback seguro: si alguien usa el hook fuera del provider, no rompe la app,
    // simplemente la navegacion no muestra overlay.
    return {
      isPending: false,
      startNavigation: (fn) => fn(),
    };
  }
  return ctx;
}

function LoadingOverlay() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'wait',
        // El overlay intercepta TODOS los eventos de puntero porque esta
        // posicionado encima con z-index alto. Esto bloquea clicks por defecto.
        pointerEvents: 'all',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 48,
          height: 48,
          border: '4px solid rgba(0, 0, 0, 0.15)',
          borderTopColor: '#222',
          borderRadius: '50%',
          animation: 'ppi-nav-spin 0.8s linear infinite',
        }}
      />
      <span
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        Loading
      </span>
      <style>{`
        @keyframes ppi-nav-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
