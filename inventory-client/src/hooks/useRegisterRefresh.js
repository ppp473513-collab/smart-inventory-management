import { useEffect } from "react";

import { useRefresh } from "../context/RefreshContext";

export function useRegisterRefresh(handler, deps = []) {
  const { registerRefresh } = useRefresh();

  useEffect(() => {
    const unregister = registerRefresh(handler);
    return unregister;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerRefresh, ...deps]);
}
