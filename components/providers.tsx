"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { WifiOff } from "lucide-react";
import { useHydrated } from "@/hooks/use-hydrated";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { defaultAccessibilityPreferences, useUiStore } from "@/context/ui-store";
import { VoiceCommandDock } from "@/components/voice-command-dock";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const darkMode = useUiStore((state) => state.darkMode);
  const accessibilityPreferences = useUiStore((state) => state.accessibilityPreferences);
  const { online, simulatedOffline } = useNetworkStatus();
  const immersiveRideHome = pathname === "/passageiro";

  useEffect(() => {
    const preferences = {
      ...defaultAccessibilityPreferences,
      ...(accessibilityPreferences ?? {})
    };

    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.classList.toggle("a11y-large-text", preferences.fontScale === "large");
    document.documentElement.classList.toggle("a11y-extra-text", preferences.fontScale === "extra");
    document.documentElement.classList.toggle("a11y-high-contrast", preferences.highContrast);
    document.documentElement.classList.toggle("a11y-low-vision", preferences.lowVisionMode);
    document.documentElement.classList.toggle("a11y-large-controls", preferences.largeControls);
  }, [darkMode, accessibilityPreferences]);

  return (
    <>
      {hydrated && !online && (
        <div className="fixed left-1/2 top-3 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-soft">
          <WifiOff className="size-4 text-amber-600" aria-hidden="true" />
          {simulatedOffline ? "Modo offline simulado ativo" : "Conexao indisponivel"}
        </div>
      )}
      {children}
      {hydrated && !immersiveRideHome && <VoiceCommandDock />}
    </>
  );
}
