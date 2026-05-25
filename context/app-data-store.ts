"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { favoriteLocations, rideHistory } from "@/data/mock";
import type { LocationPoint, Ride } from "@/types";

interface AppDataState {
  onboardingComplete: boolean;
  favorites: LocationPoint[];
  rideHistory: Ride[];
  lastToast: string;
  completeOnboarding: () => void;
  addFavorite: (location: LocationPoint) => void;
  recordRide: (ride: Ride) => void;
  setToast: (message: string) => void;
  clearToast: () => void;
}

export const useAppDataStore = create<AppDataState>()(
  persist(
    (set) => ({
      onboardingComplete: false,
      favorites: favoriteLocations,
      rideHistory,
      lastToast: "",
      completeOnboarding: () =>
        set({
          onboardingComplete: true,
          lastToast: "Onboarding concluido. Seu Rota+ esta personalizado."
        }),
      addFavorite: (location) =>
        set((state) => {
          const exists = state.favorites.some((item) => item.address === location.address);
          return {
            favorites: exists ? state.favorites : [location, ...state.favorites],
            lastToast: exists ? "Destino ja estava nos favoritos." : "Destino salvo nos favoritos."
          };
        }),
      recordRide: (ride) =>
        set((state) => {
          const exists = state.rideHistory.some((item) => item.id === ride.id);
          return {
            rideHistory: exists ? state.rideHistory : [ride, ...state.rideHistory],
            lastToast: "Corrida salva no historico local."
          };
        }),
      setToast: (message) => set({ lastToast: message }),
      clearToast: () => set({ lastToast: "" })
    }),
    {
      name: "rota-plus-data",
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => {
        const state = persisted as Partial<AppDataState> | undefined;

        return {
          ...current,
          ...state,
          favorites: Array.isArray(state?.favorites) ? state.favorites : current.favorites,
          rideHistory: Array.isArray(state?.rideHistory) ? state.rideHistory : current.rideHistory,
          lastToast: state?.lastToast ?? current.lastToast,
          onboardingComplete: state?.onboardingComplete ?? current.onboardingComplete
        };
      }
    }
  )
);
