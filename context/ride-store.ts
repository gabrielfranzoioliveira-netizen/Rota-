"use client";

import { create } from "zustand";
import { favoriteLocations, nearbyVehicles, serviceTypes } from "@/data/mock";
import { chooseDriver, createRideRequest } from "@/services/ride-service";
import type { LocationPoint, PaymentMethod, Ride, RideFlowStep, RideRating, ServiceTypeId, User } from "@/types";

interface RideState {
  flowStep: RideFlowStep;
  destination: LocationPoint;
  selectedServiceId: ServiceTypeId;
  currentRide: Ride | null;
  routeProgress: number;
  statusMessage: string;
  loading: boolean;
  error: string;
  sosTriggered: boolean;
  shared: boolean;
  setFlowStep: (flowStep: RideFlowStep) => void;
  setDestination: (destination: LocationPoint) => void;
  selectService: (serviceId: ServiceTypeId) => void;
  requestRide: (user: User) => Promise<boolean>;
  tickRide: () => void;
  completePayment: (method: PaymentMethod) => void;
  submitRating: (rating: RideRating) => void;
  triggerSos: () => void;
  shareRide: () => void;
  cancelRide: () => void;
  resetRide: () => void;
}

export const useRideStore = create<RideState>((set, get) => ({
  flowStep: "choosing_destination",
  destination: favoriteLocations[0],
  selectedServiceId: "assist",
  currentRide: null,
  routeProgress: 0,
  statusMessage: "Escolha seu destino.",
  loading: false,
  error: "",
  sosTriggered: false,
  shared: false,
  setFlowStep: (flowStep) => set({ flowStep }),
  setDestination: (destination) =>
    set({
      destination,
      flowStep: "choosing_service",
      statusMessage: "Destino definido. Escolha uma categoria acessivel."
    }),
  selectService: (selectedServiceId) =>
    set({
      selectedServiceId,
      flowStep: "choosing_service",
      statusMessage: "Categoria selecionada. Pronto para solicitar."
    }),
  requestRide: async (user) => {
    set({
      loading: true,
      error: "",
      sosTriggered: false,
      shared: false,
      routeProgress: 0,
      flowStep: "searching_driver",
      statusMessage: "Buscando motorista treinado proximo."
    });
    try {
      const ride = await createRideRequest(user, get().destination, get().selectedServiceId);
      set({
        currentRide: ride,
        loading: false,
        flowStep: "searching_driver",
        statusMessage: "Validando veiculo acessivel e motorista certificado."
      });
      return true;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Nao foi possivel solicitar a corrida."
      });
      return false;
    }
  },
  tickRide: () => {
    const ride = get().currentRide;
    if (!ride || ride.status === "completed" || ride.status === "cancelled") {
      return;
    }

    if (ride.status === "searching") {
      const driver = chooseDriver(ride.serviceId);
      set({
        currentRide: {
          ...ride,
          status: "accepted",
          driver,
          etaMinutes: Math.max(ride.etaMinutes, 5)
        },
        flowStep: "driver_found",
        statusMessage: "Motorista encontrado. Confirmando checklist acessivel."
      });
      return;
    }

    if (ride.status === "accepted") {
      set({
        currentRide: { ...ride, status: "arriving" },
        flowStep: "arriving",
        statusMessage: "Motorista a caminho do ponto de embarque."
      });
      return;
    }

    if (ride.status === "arriving") {
      const nextProgress = Math.min(get().routeProgress + 10, 48);
      set({
        routeProgress: nextProgress,
        currentRide: {
          ...ride,
          etaMinutes: Math.max(1, ride.etaMinutes - 1),
          status: nextProgress >= 48 ? "boarding" : "arriving"
        },
        flowStep: nextProgress >= 48 ? "boarding" : "arriving",
        statusMessage:
          nextProgress >= 48
            ? "Motorista chegou. Embarque assistido em andamento."
            : "Veiculo se aproximando com rota acessivel."
      });
      return;
    }

    if (ride.status === "boarding") {
      set({
        routeProgress: 55,
        currentRide: {
          ...ride,
          status: "in_progress",
          etaMinutes: Math.max(1, ride.etaMinutes - 1)
        },
        flowStep: "in_progress",
        statusMessage: "Embarque confirmado. Viagem em andamento."
      });
      return;
    }

    if (ride.status === "in_progress") {
      const nextProgress = Math.min(get().routeProgress + 10, 100);
      set({
        routeProgress: nextProgress,
        currentRide: {
          ...ride,
          etaMinutes: Math.max(0, ride.etaMinutes - 1),
          status: nextProgress >= 100 ? "completed" : "in_progress",
          completedAt: nextProgress >= 100 ? new Date().toISOString() : undefined
        },
        flowStep: nextProgress >= 100 ? "finalization" : "in_progress",
        statusMessage:
          nextProgress >= 100
            ? "Corrida encerrada. Escolha o pagamento e avalie a experiencia."
            : "Trajeto atualizando em tempo real."
      });
    }
  },
  completePayment: (method) =>
    set((state) => {
      if (!state.currentRide) {
        return state;
      }
      return {
        currentRide: {
          ...state.currentRide,
          paymentMethod: method
        },
        flowStep: "finalization",
        statusMessage: "Pagamento mock confirmado."
      };
    }),
  submitRating: (rating) =>
    set((state) => {
      if (!state.currentRide) {
        return state;
      }
      return {
        currentRide: {
          ...state.currentRide,
          rating
        },
        flowStep: "finalization",
        statusMessage: "Obrigado. Sua avaliacao melhora a rede Rota+."
      };
    }),
  triggerSos: () =>
    set({
      sosTriggered: true,
      statusMessage: "SOS acionado na simulacao. Contato de emergencia notificado."
    }),
  shareRide: () =>
    set({
      shared: true,
      statusMessage: "Link seguro da viagem copiado na simulacao."
    }),
  cancelRide: () =>
    set((state) => ({
      currentRide: state.currentRide ? { ...state.currentRide, status: "cancelled" } : null,
      flowStep: "choosing_destination",
      statusMessage: "Corrida cancelada.",
      loading: false
    })),
  resetRide: () =>
    set({
      flowStep: "choosing_destination",
      currentRide: null,
      routeProgress: 0,
      statusMessage: "Escolha seu destino.",
      loading: false,
      error: "",
      sosTriggered: false,
      shared: false,
      selectedServiceId: serviceTypes[2].id
    })
}));

export { nearbyVehicles, serviceTypes };
