"use client";

import { useEffect } from "react";
import {
  AlertTriangle,
  CarFront,
  CheckCircle2,
  Loader2,
  MessageSquare,
  PhoneCall,
  Share2,
  Star
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRideStore, serviceTypes } from "@/context/ride-store";
import { formatCurrency } from "@/lib/utils";
import type { User } from "@/types";

interface RideSimulatorProps {
  user: User;
}

const statusLabel = {
  idle: "Pronto",
  searching: "Buscando",
  accepted: "Aceita",
  arriving: "Chegando",
  boarding: "Embarque",
  in_progress: "Em viagem",
  completed: "Encerrada",
  cancelled: "Cancelada"
};

export function RideSimulator({ user }: RideSimulatorProps) {
  const currentRide = useRideStore((state) => state.currentRide);
  const loading = useRideStore((state) => state.loading);
  const error = useRideStore((state) => state.error);
  const routeProgress = useRideStore((state) => state.routeProgress);
  const selectedServiceId = useRideStore((state) => state.selectedServiceId);
  const requestRide = useRideStore((state) => state.requestRide);
  const tickRide = useRideStore((state) => state.tickRide);
  const cancelRide = useRideStore((state) => state.cancelRide);
  const triggerSos = useRideStore((state) => state.triggerSos);
  const shareRide = useRideStore((state) => state.shareRide);
  const shared = useRideStore((state) => state.shared);
  const sosTriggered = useRideStore((state) => state.sosTriggered);
  const resetRide = useRideStore((state) => state.resetRide);
  const service = serviceTypes.find((item) => item.id === selectedServiceId);
  const active = currentRide && !["completed", "cancelled"].includes(currentRide.status);

  useEffect(() => {
    if (!active) {
      return;
    }

    const interval = window.setInterval(() => {
      tickRide();
    }, 1300);

    return () => window.clearInterval(interval);
  }, [active, tickRide]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Simulacao de corrida</CardTitle>
            <CardDescription>Solicite, acompanhe o aceite, a chegada e o trajeto final.</CardDescription>
          </div>
          <Badge variant={currentRide?.status === "completed" ? "success" : "soft"}>
            {currentRide ? statusLabel[currentRide.status] : "Aguardando"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {!currentRide && (
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="font-semibold">Servico selecionado: {service?.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ao solicitar, o app simula aceite do motorista, ETA, movimento no mapa, SOS e compartilhamento.
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">
            <AlertTriangle className="size-4" aria-hidden="true" />
            {error}
          </div>
        )}

        {currentRide?.driver && (
          <div className="rounded-lg border bg-white/72 p-4 dark:bg-white/5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar initials={currentRide.driver.photo} className="size-14" />
                <div>
                  <p className="font-bold">{currentRide.driver.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {currentRide.driver.vehicle.model} • {currentRide.driver.vehicle.plate}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-brand-primary dark:text-brand-soft">
                    <Star className="size-4 fill-current" aria-hidden="true" />
                    {currentRide.driver.rating} • Motorista treinado em acessibilidade
                  </p>
                </div>
              </div>
              <div className="grid gap-1 text-sm sm:text-right">
                <span className="font-bold">{currentRide.etaMinutes} min</span>
                <span className="text-muted-foreground">{formatCurrency(currentRide.price)}</span>
              </div>
            </div>
          </div>
        )}

        {currentRide && (
          <div className="grid gap-3">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>{currentRide.pickup.label}</span>
              <span>{currentRide.destination.label}</span>
            </div>
            <Progress value={currentRide.status === "completed" ? 100 : routeProgress} />
          </div>
        )}

        {sosTriggered && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            SOS simulado: suporte e contato de emergencia receberam os dados da viagem.
          </div>
        )}

        {shared && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            Compartilhamento simulado ativo para familiares e cuidadores.
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          {!currentRide && (
            <Button type="button" size="lg" onClick={() => requestRide(user)} disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <CarFront className="size-4" aria-hidden="true" />}
              Solicitar corrida
            </Button>
          )}
          {active && (
            <>
              <Button type="button" variant="destructive" onClick={triggerSos}>
                <PhoneCall className="size-4" aria-hidden="true" />
                SOS
              </Button>
              <Button type="button" variant="outline" onClick={shareRide}>
                <Share2 className="size-4" aria-hidden="true" />
                Compartilhar viagem
              </Button>
              <Button type="button" variant="ghost" onClick={cancelRide}>
                Cancelar
              </Button>
            </>
          )}
          {currentRide?.status === "completed" && currentRide.rating && (
            <Button type="button" variant="outline" onClick={resetRide}>
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Nova corrida
            </Button>
          )}
          {currentRide?.status === "completed" && !currentRide.rating && (
            <Button type="button" variant="soft">
              <MessageSquare className="size-4" aria-hidden="true" />
              Avaliacao pendente
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
