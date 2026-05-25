"use client";

import { useState } from "react";
import { Banknote, CheckCircle2, CreditCard, Heart, Landmark, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useRideStore } from "@/context/ride-store";
import { formatCurrency } from "@/lib/utils";
import type { PaymentMethod, RideRating } from "@/types";

const paymentOptions: Array<{ id: PaymentMethod; label: string; icon: typeof CreditCard }> = [
  { id: "pix", label: "PIX", icon: Landmark },
  { id: "card", label: "Cartao", icon: CreditCard },
  { id: "cash", label: "Dinheiro", icon: Banknote }
];

const ratingFields: Array<{ id: keyof RideRating; label: string }> = [
  { id: "accessibility", label: "Acessibilidade" },
  { id: "education", label: "Educacao" },
  { id: "comfort", label: "Conforto" },
  { id: "care", label: "Cuidado" }
];

export function PaymentReview() {
  const currentRide = useRideStore((state) => state.currentRide);
  const completePayment = useRideStore((state) => state.completePayment);
  const submitRating = useRideStore((state) => state.submitRating);
  const [comment, setComment] = useState("Embarque cuidadoso e viagem tranquila.");
  const [rating, setRating] = useState<RideRating>({
    accessibility: 5,
    education: 5,
    comfort: 5,
    care: 5
  });

  if (currentRide?.status !== "completed") {
    return null;
  }

  const paid = Boolean(currentRide.paymentMethod);
  const rated = Boolean(currentRide.rating);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Corrida encerrada</CardTitle>
            <CardDescription>Finalize o pagamento mock e avalie a experiencia de acessibilidade.</CardDescription>
          </div>
          <Badge variant="success">{formatCurrency(currentRide.price)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {paymentOptions.map((option) => {
            const Icon = option.icon;
            const active = currentRide.paymentMethod === option.id;
            return (
              <Button
                key={option.id}
                type="button"
                variant={active ? "default" : "outline"}
                onClick={() => completePayment(option.id)}
                className="h-16 justify-start"
              >
                <Icon className="size-5" aria-hidden="true" />
                {option.label}
              </Button>
            );
          })}
        </div>

        {paid && !rated && (
          <div className="grid gap-4 rounded-lg border bg-muted/40 p-4">
            <p className="font-semibold">Avaliar motorista e veiculo</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {ratingFields.map((field) => (
                <div key={field.id} className="rounded-md border bg-card p-3">
                  <p className="text-sm font-semibold">{field.label}</p>
                  <div className="mt-2 flex gap-1">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const value = index + 1;
                      return (
                        <button
                          key={value}
                          type="button"
                          className="focus-ring rounded-sm p-1 text-amber-500"
                          onClick={() => setRating((current) => ({ ...current, [field.id]: value }))}
                          aria-label={`${field.label} ${value}`}
                        >
                          <Star
                            className={value <= Number(rating[field.id]) ? "size-5 fill-current" : "size-5"}
                            aria-hidden="true"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <Textarea value={comment} onChange={(event) => setComment(event.target.value)} />
            <Button type="button" onClick={() => submitRating({ ...rating, comment })}>
              <Heart className="size-4" aria-hidden="true" />
              Enviar avaliacao
            </Button>
          </div>
        )}

        {rated && (
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-semibold">Avaliacao registrada</p>
              <p className="mt-1 text-sm">
                Seus sinais de acessibilidade, educacao, conforto e cuidado foram salvos nesta demo.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
