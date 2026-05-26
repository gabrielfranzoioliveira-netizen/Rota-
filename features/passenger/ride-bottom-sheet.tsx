"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Banknote,
  CarFront,
  CheckCircle2,
  Clock3,
  CreditCard,
  Heart,
  Landmark,
  Loader2,
  MapPin,
  Navigation,
  PhoneCall,
  Route,
  Search,
  Share2,
  ShieldCheck,
  Star,
  UsersRound,
  WalletCards
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useAppDataStore } from "@/context/app-data-store";
import { serviceTypes, useRideStore } from "@/context/ride-store";
import { calculateFare, estimateDistance } from "@/services/ride-service";
import { cn, formatCurrency } from "@/lib/utils";
import type { LocationPoint, PaymentMethod, RideFlowStep, RideRating, User } from "@/types";

interface RideBottomSheetProps {
  user: User;
}

const paymentOptions: Array<{ id: PaymentMethod; label: string; icon: typeof CreditCard }> = [
  { id: "pix", label: "PIX", icon: Landmark },
  { id: "card", label: "Cartao", icon: CreditCard },
  { id: "cash", label: "Dinheiro", icon: Banknote }
];

const rideSteps: Array<{ id: RideFlowStep; label: string }> = [
  { id: "choosing_destination", label: "Destino" },
  { id: "choosing_service", label: "Carro" },
  { id: "driver_found", label: "Motorista" },
  { id: "in_progress", label: "Viagem" }
];

const stepOrder: Partial<Record<RideFlowStep, number>> = {
  choosing_destination: 0,
  choosing_service: 1,
  searching_driver: 1,
  driver_found: 2,
  arriving: 2,
  boarding: 2,
  in_progress: 3,
  finalization: 3
};

function serviceSavingCopy(serviceId: string) {
  if (serviceId === "economy") return "Tarifa social";
  if (serviceId === "comfort") return "Mais espaco";
  if (serviceId === "assist") return "Ajuda inclusa";
  return "Grupo";
}

function getTitle(flowStep: RideFlowStep) {
  if (flowStep === "choosing_destination") return "Para onde?";
  if (flowStep === "choosing_service") return "Escolha sua viagem";
  if (flowStep === "searching_driver") return "Buscando motorista";
  if (flowStep === "driver_found") return "Motorista confirmado";
  if (flowStep === "arriving") return "Motorista chegando";
  if (flowStep === "boarding") return "Embarque assistido";
  if (flowStep === "in_progress") return "Viagem em andamento";
  return "Finalize sua corrida";
}

export function RideBottomSheet({ user }: RideBottomSheetProps) {
  const flowStep = useRideStore((state) => state.flowStep);
  const destination = useRideStore((state) => state.destination);
  const setDestination = useRideStore((state) => state.setDestination);
  const selectedServiceId = useRideStore((state) => state.selectedServiceId);
  const selectService = useRideStore((state) => state.selectService);
  const currentRide = useRideStore((state) => state.currentRide);
  const routeProgress = useRideStore((state) => state.routeProgress);
  const statusMessage = useRideStore((state) => state.statusMessage);
  const loading = useRideStore((state) => state.loading);
  const error = useRideStore((state) => state.error);
  const requestRide = useRideStore((state) => state.requestRide);
  const tickRide = useRideStore((state) => state.tickRide);
  const completePayment = useRideStore((state) => state.completePayment);
  const submitRating = useRideStore((state) => state.submitRating);
  const triggerSos = useRideStore((state) => state.triggerSos);
  const shareRide = useRideStore((state) => state.shareRide);
  const resetRide = useRideStore((state) => state.resetRide);
  const favorites = useAppDataStore((state) => state.favorites);
  const addFavorite = useAppDataStore((state) => state.addFavorite);
  const recordRide = useAppDataStore((state) => state.recordRide);
  const [destinationText, setDestinationText] = useState(destination.address);
  const [comment, setComment] = useState("Viagem acessivel, cuidadosa e com preco justo.");
  const [rating, setRating] = useState<RideRating>({
    accessibility: 5,
    education: 5,
    comfort: 5,
    care: 5
  });

  const selectedService = serviceTypes.find((service) => service.id === selectedServiceId) ?? serviceTypes[0];
  const distance = estimateDistance(destination);
  const fare = calculateFare(selectedService.id, distance);
  const activeRide = Boolean(currentRide && !["completed", "cancelled"].includes(currentRide.status));
  const currentStepIndex = stepOrder[flowStep] ?? 0;
  const needsDestination = flowStep === "choosing_destination";
  const completedRide = currentRide?.status === "completed";

  useEffect(() => {
    if (!activeRide) return;
    const interval = window.setInterval(tickRide, 1250);
    return () => window.clearInterval(interval);
  }, [activeRide, tickRide]);

  const confirmDestination = () => {
    const trimmedDestination = destinationText.trim();
    if (!trimmedDestination) {
      return;
    }

    const next: LocationPoint = {
      label: trimmedDestination.split(",")[0] || "Destino",
      address: trimmedDestination,
      lat: -23.562,
      lng: -46.655
    };
    setDestination(next);
    addFavorite(next);
  };

  const submitDestination = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    confirmDestination();
  };

  const handlePrimaryAction = () => {
    if (needsDestination) {
      confirmDestination();
      return;
    }

    requestRide(user);
  };

  const finishRating = () => {
    submitRating({ ...rating, comment });
    const ride = useRideStore.getState().currentRide;
    if (ride) recordRide({ ...ride, rating: { ...rating, comment } });
  };

  return (
    <motion.section
      className="absolute inset-x-0 bottom-0 z-[55] flex max-h-[82dvh] min-h-[23rem] flex-col overflow-hidden rounded-t-[1.75rem] border border-white/70 bg-white shadow-[0_-22px_70px_rgba(15,23,42,0.22)] dark:border-white/10 dark:bg-card"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 150, damping: 22 }}
      aria-label="Painel de corrida"
    >
      <div className="shrink-0 px-4 pt-3">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300" />

        <div className="mb-4 grid grid-cols-4 gap-2">
          {rideSteps.map((step, index) => (
            <div key={step.id} className="grid gap-1">
              <div
                className={cn(
                  "h-1 rounded-full",
                  index <= currentStepIndex ? "bg-foreground" : "bg-muted"
                )}
              />
              <span
                className={cn(
                  "truncate text-[10px] font-bold",
                  index <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Rota+ ride
            </p>
            <h2 className="mt-1 truncate text-2xl font-bold tracking-normal">{getTitle(flowStep)}</h2>
            <p className="mt-1 line-clamp-2 text-sm font-medium text-muted-foreground">{statusMessage}</p>
          </div>
          <div className="shrink-0 rounded-full bg-[#f1f5f4] px-3 py-2 text-sm font-bold text-[#0f766e] dark:bg-white/10">
            {formatCurrency(currentRide?.price ?? fare)}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-4">
        <div className="grid gap-4">
          {!currentRide && (
            <form onSubmit={submitDestination} className="grid gap-3">
              <div className="rounded-2xl border bg-[#f8faf9] p-3 dark:bg-white/5">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <span className="size-2.5 rounded-full bg-[#0f766e]" />
                    <span className="my-1 h-8 w-px bg-border" />
                    <MapPin className="size-4 text-[#ef4444]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">Casa</p>
                    <p className="truncate text-xs text-muted-foreground">{user.location.address}</p>
                    <div className="mt-3 relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={destinationText}
                        onChange={(event) => setDestinationText(event.target.value)}
                        className="h-12 rounded-xl border-0 bg-white pl-10 shadow-sm dark:bg-card"
                        placeholder="Digite um destino"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {favorites.slice(0, 5).map((favorite) => (
                  <button
                    key={favorite.address}
                    type="button"
                    className="focus-ring min-w-[9.25rem] rounded-2xl border bg-white p-3 text-left shadow-sm dark:bg-white/5"
                    onClick={() => {
                      setDestination(favorite);
                      setDestinationText(favorite.address);
                    }}
                  >
                    <p className="truncate text-sm font-bold">{favorite.label}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{favorite.address}</p>
                  </button>
                ))}
              </div>
            </form>
          )}

          {flowStep === "choosing_service" && !currentRide && (
            <div className="grid gap-2">
              {serviceTypes.map((service) => {
                const activeService = selectedServiceId === service.id;
                return (
                  <button
                    key={service.id}
                    type="button"
                    className={cn(
                      "focus-ring rounded-2xl border p-3 text-left transition-all",
                      activeService
                        ? "border-foreground bg-[#f8faf9] shadow-soft dark:bg-white/10"
                        : "bg-white hover:bg-muted/35 dark:bg-white/5"
                    )}
                    onClick={() => selectService(service.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl", activeService ? "bg-foreground text-background" : "bg-muted text-foreground")}>
                        <CarFront className="size-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-bold">{service.name}</p>
                          <Badge variant={activeService ? "default" : "outline"}>{service.etaMinutes} min</Badge>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{service.description}</p>
                        <p className="mt-2 text-xs font-bold text-[#0f766e]">{serviceSavingCopy(service.id)} - {service.capacity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold">{formatCurrency(calculateFare(service.id, distance))}</p>
                        <p className="text-[10px] font-semibold text-muted-foreground">{distance.toFixed(1)} km</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}

          {currentRide?.driver && (
            <div className="rounded-2xl border bg-[#f8faf9] p-3 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <Avatar initials={currentRide.driver.photo} className="size-12" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{currentRide.driver.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {currentRide.driver.vehicle.model} - {currentRide.driver.vehicle.plate}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-bold text-[#0f766e]">
                    <Star className="size-3.5 fill-current" aria-hidden="true" />
                    {currentRide.driver.rating} - Motorista treinado
                  </p>
                </div>
                <Badge variant="success">{currentRide.etaMinutes}m</Badge>
              </div>
            </div>
          )}

          {currentRide && (
            <div className="grid gap-3 rounded-2xl border bg-white p-3 dark:bg-white/5">
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                <span className="truncate">{destination.label}</span>
                <span>{Math.round(currentRide.status === "completed" ? 100 : routeProgress)}%</span>
              </div>
              <Progress value={currentRide.status === "completed" ? 100 : routeProgress} />
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-muted/45 p-3">
                  <Clock3 className="mb-2 size-4 text-[#0f766e]" aria-hidden="true" />
                  <p className="text-xs font-bold">{currentRide.etaMinutes} min</p>
                </div>
                <div className="rounded-xl bg-muted/45 p-3">
                  <Route className="mb-2 size-4 text-[#0f766e]" aria-hidden="true" />
                  <p className="text-xs font-bold">{currentRide.distanceKm.toFixed(1)} km</p>
                </div>
                <div className="rounded-xl bg-muted/45 p-3">
                  <UsersRound className="mb-2 size-4 text-[#0f766e]" aria-hidden="true" />
                  <p className="text-xs font-bold">Acomp.</p>
                </div>
              </div>
            </div>
          )}

          {completedRide && (
            <div className="grid gap-3">
              <div className="grid grid-cols-3 gap-2">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.id}
                      type="button"
                      variant={currentRide.paymentMethod === option.id ? "default" : "outline"}
                      onClick={() => completePayment(option.id)}
                      className="px-2"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {option.label}
                    </Button>
                  );
                })}
              </div>

              {currentRide.paymentMethod && !currentRide.rating && (
                <div className="grid gap-3 rounded-2xl border bg-[#f8faf9] p-3 dark:bg-white/5">
                  <p className="text-sm font-bold">Como foi sua viagem?</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        className="focus-ring rounded-md p-1 text-amber-500"
                        onClick={() =>
                          setRating({
                            accessibility: index + 1,
                            education: index + 1,
                            comfort: index + 1,
                            care: index + 1
                          })
                        }
                      >
                        <Star className={cn("size-6", index < rating.accessibility && "fill-current")} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                  <Textarea value={comment} onChange={(event) => setComment(event.target.value)} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t bg-white/96 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 dark:bg-card/96">
        {!currentRide && (
          <Button
            type="button"
            size="lg"
            onClick={handlePrimaryAction}
            disabled={loading || !destinationText.trim()}
            className="h-12 w-full rounded-2xl bg-[#111827] text-white hover:bg-[#0f172a]"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : needsDestination ? (
              <Navigation className="size-4" aria-hidden="true" />
            ) : (
              <CarFront className="size-4" aria-hidden="true" />
            )}
            {needsDestination ? "Confirmar destino" : `Solicitar ${selectedService.name}`}
          </Button>
        )}

        {activeRide && (
          <div className="grid grid-cols-3 gap-2">
            <Button type="button" variant="destructive" onClick={triggerSos}>
              <PhoneCall className="size-4" aria-hidden="true" />
              SOS
            </Button>
            <Button type="button" variant="outline" onClick={shareRide}>
              <Share2 className="size-4" aria-hidden="true" />
              Compart.
            </Button>
            <Button type="button" variant="soft">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Seguro
            </Button>
          </div>
        )}

        {completedRide && currentRide.paymentMethod && !currentRide.rating && (
          <Button type="button" onClick={finishRating} className="h-12 w-full rounded-2xl">
            <Heart className="size-4" aria-hidden="true" />
            Enviar avaliacao
          </Button>
        )}

        {currentRide?.rating && (
          <Button type="button" variant="outline" onClick={resetRide} className="h-12 w-full rounded-2xl">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Nova corrida
          </Button>
        )}

        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center justify-center gap-1 rounded-xl bg-muted/50 px-2 py-2 font-bold">
            <Clock3 className="size-3.5 text-[#0f766e]" aria-hidden="true" />
            {currentRide?.etaMinutes ?? selectedService.etaMinutes} min
          </div>
          <div className="flex items-center justify-center gap-1 rounded-xl bg-muted/50 px-2 py-2 font-bold">
            <WalletCards className="size-3.5 text-[#0f766e]" aria-hidden="true" />
            {formatCurrency(currentRide?.price ?? fare)}
          </div>
          <div className="flex items-center justify-center gap-1 rounded-xl bg-muted/50 px-2 py-2 font-bold">
            <ShieldCheck className="size-3.5 text-[#0f766e]" aria-hidden="true" />
            PCD
          </div>
        </div>
      </div>
    </motion.section>
  );
}
