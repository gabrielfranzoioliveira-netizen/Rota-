"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AccessibilityPreferences } from "@/types";

export const defaultAccessibilityPreferences: AccessibilityPreferences = {
  fontScale: "normal",
  highContrast: false,
  lowVisionMode: false,
  largeControls: false,
  voiceGuidance: true
};

interface UiState {
  darkMode: boolean;
  offlineMode: boolean;
  voiceEnabled: boolean;
  lastVoiceCommand: string;
  accessibilityPreferences: AccessibilityPreferences;
  toggleDarkMode: () => void;
  toggleOfflineMode: () => void;
  toggleVoice: () => void;
  setVoiceCommand: (command: string) => void;
  setFontScale: (fontScale: AccessibilityPreferences["fontScale"]) => void;
  toggleHighContrast: () => void;
  toggleLowVisionMode: () => void;
  toggleLargeControls: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      darkMode: false,
      offlineMode: false,
      voiceEnabled: false,
      lastVoiceCommand: "",
      accessibilityPreferences: defaultAccessibilityPreferences,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleOfflineMode: () => set((state) => ({ offlineMode: !state.offlineMode })),
      toggleVoice: () =>
        set((state) => ({
          voiceEnabled: !state.voiceEnabled,
          lastVoiceCommand: !state.voiceEnabled ? "Modo voz ativado" : "Modo voz pausado"
        })),
      setVoiceCommand: (command) => set({ lastVoiceCommand: command }),
      setFontScale: (fontScale) =>
        set((state) => ({
          accessibilityPreferences: { ...state.accessibilityPreferences, fontScale }
        })),
      toggleHighContrast: () =>
        set((state) => ({
          accessibilityPreferences: {
            ...state.accessibilityPreferences,
            highContrast: !state.accessibilityPreferences.highContrast
          }
        })),
      toggleLowVisionMode: () =>
        set((state) => ({
          accessibilityPreferences: {
            ...state.accessibilityPreferences,
            lowVisionMode: !state.accessibilityPreferences.lowVisionMode
          }
        })),
      toggleLargeControls: () =>
        set((state) => ({
          accessibilityPreferences: {
            ...state.accessibilityPreferences,
            largeControls: !state.accessibilityPreferences.largeControls
          }
        }))
    }),
    {
      name: "rota-plus-ui",
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => {
        const state = persisted as Partial<UiState> | undefined;

        return {
          ...current,
          ...state,
          accessibilityPreferences: {
            ...defaultAccessibilityPreferences,
            ...(state?.accessibilityPreferences ?? {})
          }
        };
      }
    }
  )
);
