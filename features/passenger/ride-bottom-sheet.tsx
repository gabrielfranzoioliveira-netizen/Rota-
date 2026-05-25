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
  PhoneCall,
  Route,
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

const flowLabels: Record<RideFlowStep, string> = {
  choosing_destination: "Destino",
  choosing_service: "Categoria",
  searching_driver: "Buscando",
  driver_found: "Motorista",
  arriving: "Chegando",
  boarding: "Embarque",
  in_progress: "Viagem",
  finalization: "Finalizar"
};

const paymentOptions: Array<{ id: PaymentMethod; label: string; icon: typeof CreditCard }> = [
  { id: "pix", label: "PIX", icon: Landmark },
  { id: "card", label: "Cartao", icon: CreditCard },
  { id: "cash", label: "Dinheiro", icon: Banknote }
];

function serviceSavingCopy(serviceId: string) {
  if (serviceId === "economy") return "Tarifa social";
  if (serviceId === "comfort") return "Subsidio PCD";
  if (serviceId === "assist") return "Acompanhante incluso";
  return "Dividir van";
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
  const active = currentRide && !["completed", "cancelled"].includes(currentRide.status);

  useEffect(() => {
    if (!active) return;
    const interval = window.setInterval(tickRide, 1250);
    return () => window.clearInterval(interval);
  }, [active, tickRide]);

  const submitDestination = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: LocationPoint = {
      label: destinationText.split(",")[0] || "Destino",
      address: destinationText,
      lat: -23.562,
      lng: -46.655
    };
    setDestination(next);
    addFavorite(next);
  };

  const finishRating = () => {
    submitRating({ ...rating, comment });
    const ride = useRideStore.getState().currentRide;
    if (ride) recordRide({ ...ride, rating: { ...rating, comment } });
  };

  return (
    <motion.section
      className="absolute inset-x-0 bottom-0 z-[55] rounded-t-[1.75rem] border border-white/70 bg-white/96 p-4 pb-5 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-card/96"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 140, damping: 20 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 48 }}
      dragElastic={0.08}
    >
      <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#dadce0]" />

      <div className="mb-4 grid grid-cols-4 gap-1">
        {(Object.keys(flowLabels) as RideFlowStep[]).map((step) => {
          const activeStep = flowStep === step;
          return (
            <div key={step} className="grid gap-1">
              <div className={cn("h-1 rounded-full", activeStep ? "bg-[#1a73e8]" : "bg-muted")} />
              <span className={cn("truncate text-[9px] font-bold", activeStep ? "text-[#1a73e8]" : "text-muted-foreground")}>
                {flowLabels[step]}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">Rota+ ride</p>
            <h2 className="text-xl font-bold">
              {flowStep === "choosing_destination" && "Para onde vamos?"}
              {flowStep === "choosing_service" && "Escolha sua categoria"}
              {flowStep === "searching_driver" && "Buscando motorista"}
              {flowStep === "driver_found" && "Motorista encontrado"}
              {flowStep === "arriving" && "Motorista chegando"}
              {flowStep === "boarding" && "Embarque assistido"}
              {flowStep === "in_progress" && "Viagem em andamento"}
              {flowStep === "finalization" && "Finalizar corrida"}
            </h2>
            <p className="mt-1 max-w-56 text-xs font-medium text-muted-foreground">{statusMessage}</p>
          </div>
          <Badge variant="soft">{formatCurrency(currentRide?.price ?? fare)}</Badge>
        </div>

        {(flowStep === "choosing_destination" || flowStep === "choosing_service") && (
          <>
            <form onSubmit={submitDestination} className="grid gap-3">
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#ea4335]" />
                <Input
                  value={destinationText}
                  onChange={(event) => setDestinationText(event.target.value)}
                  className="h-12 rounded-2xl pl-10"
                  placeholder="Digite um destino"
                />
              </div>
              <Button type="submit" variant="outline">
                <Route className="size-4" />
                Definir destino
              </Button>
            </form>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {favorites.slice(0, 5).map((favorite) => (
                <button
                  key={favorite.address}
                  type="button"
                  className="focus-ring min-w-36 rounded-2xl border bg-muted/40 p-3 text-left"
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
          </>
        )}

        {flowStep === "choosing_service" && (
          <div className="grid gap-2">
            {serviceTypes.map((service) => {
              const activeService = selectedServiceId === service.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  className={cn(
                    "focus-ring rounded-2xl border p-3 text-left transition-all",
                    activeService ? "border-[#1a73e8] bg-[#e8f0fe] shadow-soft" : "bg-white"
                  )}
                  onClick={() => selectService(service.id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold">{service.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{service.description}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Badge variant="soft">{serviceSavingCopy(service.id)}</Badge>
                        <Badge variant="outline">{service.etaMinutes} min</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-brand-primary">{formatCurrency(calculateFare(service.id, distance))}</p>
                      <p className="text-[10px] font-semibold text-muted-foreground">preco final</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}

        {currentRide?.driver && (
          <div className="rounded-2xl border bg-muted/35 p-3">
            <div className="flex items-center gap-3">
              <Avatar initials={currentRide.driver.photo} className="size-12" />
              <div className="min-w-0 flex-1">
                <p className="font-bold">{currentRide.driver.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {currentRide.driver.vehicle.model} - {currentRide.driver.vehicle.plate}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs font-bold text-brand-primary">
                  <Star className="size-3.5 fill-current" />
                  {currentRide.driver.rating} - Motorista treinado
                </p>
              </div>
              <Badge variant="success">{currentRide.etaMinutes}m</Badge>
            </div>
          </div>
        )}

        {currentRide && (
          <div className="grid gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span>{destination.label}</span>
              <span>{Math.round(routeProgress)}%</span>
            </div>
            <Progress value={currentRide.status === "completed" ? 100 : routeProgress} />
          </div>
        )}

        {flowStep === "finalization" && currentRide?.status === "completed" && (
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
                    <Icon className="size-4" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
            {currentRide.paymentMethod && !currentRide.rating && (
              <>
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
                      <Star className={cn("size-6", index < rating.accessibility && "fill-current")} />
                    </button>
                  ))}
                </div>
                <Textarea value={comment} onChange={(event) => setComment(event.target.value)} />
              </>
            )}
          </div>
        )}

        <div className="grid gap-2">
          {!currentRide && (
            <Button type="button" size="lg" onClick={() => requestRide(user)} disabled={loading || flowStep === "choosing_destination"}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <CarFront className="size-4" />}
              Solicitar {selectedService.name}
            </Button>
          )}
          {active && (
            <div className="grid grid-cols-3 gap-2">
              <Button type="button" variant="destructive" onClick={triggerSos}>
                <PhoneCall className="size-4" />
                SOS
              </Button>
              <Button type="button" variant="outline" onClick={shareRide}>
                <Share2 className="size-4" />
                Compart.
              </Button>
              <Button type="button" variant="soft">
                <ShieldCheck className="size-4" />
                Seguro
              </Button>
            </div>
          )}
          {flowStep === "finalization" && currentRide?.paymentMethod && !currentRide.rating && (
            <Button type="button" onClick={finishRating}>
              <Heart className="size-4" />
              Enviar avaliacao
            </Button>
          )}
          {currentRide?.rating && (
            <Button type="button" variant="outline" onClick={resetRide}>
              <CheckCircle2 className="size-4" />
              Nova corrida
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-muted/45 p-3">
            <Clock3 className="mb-2 size-4 text-brand-secondary" />
            <p className="text-xs font-bold">{currentRide?.etaMinutes ?? selectedService.etaMinutes} min</p>
          </div>
          <div className="rounded-2xl bg-muted/45 p-3">
            <WalletCards className="mb-2 size-4 text-brand-secondary" />
            <p className="text-xs font-bold">{formatCurrency(currentRide?.price ?? fare)}</p>
          </div>
          <div className="rounded-2xl bg-muted/45 p-3">
            <UsersRound className="mb-2 size-4 text-brand-secondary" />
            <p className="text-xs font-bold">Acomp.</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
