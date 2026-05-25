"use client";

import { CheckCircle2, Clock, ShieldPlus, Sparkles, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRideStore, serviceTypes } from "@/context/ride-store";
import { calculateFare, estimateDistance } from "@/services/ride-service";
import { cn, formatCurrency } from "@/lib/utils";

export function ServiceSelector() {
  const selectedServiceId = useRideStore((state) => state.selectedServiceId);
  const selectService = useRideStore((state) => state.selectService);
  const destination = useRideStore((state) => state.destination);
  const distance = estimateDistance(destination);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipos de servico</CardTitle>
        <CardDescription>Tarifas sociais pensadas para mobilidade acessivel de verdade.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {serviceTypes.map((service) => {
          const active = selectedServiceId === service.id;
          return (
            <button
              key={service.id}
              type="button"
              className={cn(
                "focus-ring rounded-lg border p-4 text-left transition-all",
                active ? "border-brand-primary bg-brand-soft/55 shadow-soft" : "bg-white/70 hover:bg-brand-soft/20 dark:bg-white/5"
              )}
              onClick={() => selectService(service.id)}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3">
                  <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-lg", active ? "bg-primary text-primary-foreground" : "bg-muted text-brand-primary")}>
                    {service.id === "assist" ? <ShieldPlus className="size-6" /> : <Sparkles className="size-6" />}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold">{service.name}</p>
                      {active && <Badge variant="success">Selecionado</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {service.features.map((feature) => (
                        <Badge key={feature} variant="soft">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid min-w-36 gap-2 text-sm">
                  <span className="text-xl font-bold text-brand-primary dark:text-brand-soft">
                    {formatCurrency(calculateFare(service.id, distance))}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="size-4" aria-hidden="true" />
                    {service.etaMinutes} min
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <UsersRound className="size-4" aria-hidden="true" />
                    {service.capacity}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                    Conforto {service.comfort}/5
                  </span>
                </div>
              </div>
            </button>
          );
        })}
        <Button type="button" variant="soft" onClick={() => selectService("assist")}>
          Recomendar melhor opcao acessivel
        </Button>
      </CardContent>
    </Card>
  );
}
