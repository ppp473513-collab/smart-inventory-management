import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

const RefreshContext = createContext(null);

export function RefreshProvider({ children }) {
  const handlerRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

  const registerRefresh = useCallback((handler) => {
    handlerRef.current = handler;
    return () => {
      if (handlerRef.current === handler) {
        handlerRef.current = null;
      }
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!handlerRef.current) return;

    setRefreshing(true);
    try {
      await handlerRef.current();
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <RefreshContext.Provider
      value={{ registerRefresh, refresh, refreshing }}
    >
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefresh() {
  const context = useContext(RefreshContext);

  if (!context) {
    throw new Error(
      "useRefresh must be used within RefreshProvider"
    );
  }

  return context;
}
