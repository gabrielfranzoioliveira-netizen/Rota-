"use client";

import { useEffect, useState } from "react";
import { useUiStore } from "@/context/ui-store";

export function useNetworkStatus() {
  const offlineMode = useUiStore((state) => state.offlineMode);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return {
    online: online && !offlineMode,
    simulatedOffline: offlineMode
  };
}
