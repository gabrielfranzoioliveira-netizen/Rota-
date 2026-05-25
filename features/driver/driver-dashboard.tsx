"use client";

import { useEffect, useState } from "react";
import { Award, BadgeDollarSign, CarFront, CheckCircle2, ClipboardCheck, Clock, MapPin, Power, ShieldCheck, Star, TrendingUp, WalletCards } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockDrivers, rideHistory } from "@/data/mock";
import { formatCurrency, formatDateTime } from "@/lib/utils";

const upcomingRides = [
  {
    id: "next_1",
    passenger: "Ana Beatriz",
    pickup: "Rua Harmonia, 248",
    destination: "Hospital das Clinicas",
    distance: "2,9 km",
    fare: 22.9,
    need: "Rampa + ajuda no embarque",
    service: "Assist+"
  },
  {
    id: "next_2",
    passenger: "Roberto M.",
    pickup: "Instituto Vida Plena",
    destination: "Clinica Reabilitar",
    distance: "5,4 km",
    fare: 34.2,
    need: "Van com elevador",
    service: "Van acessivel"
  }
];

const reputation = [
  { label: "Educacao", value: 98 },
  { label: "Paciencia", value: 96 },
  { label: "Acessibilidade", value: 99 },
  { label: "Cuidado", value: 97 }
];

export function DriverDashboard() {
  const driver = mockDrivers[0];
  const [accepted, setAccepted] = useState<string[]>([]);
  const [online, setOnline] = useState(true);
  const [acceptCountdown, setAcceptCountdown] = useState(18);
  const [checklist, setChecklist] = useState({
    ramp: true,
    lock: true,
    cleaning: true,
    belt: false
  });

  useEffect(() => {
    if (!online || accepted.length > 0) return;
    const interval = window.setInterval(() => {
      setAcceptCountdown((value) => (value <= 1 ? 18 : value - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [accepted.length, online]);

  return (
    <div className="grid gap-6">
      <Card className={online ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950" : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950"}>
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <div className={online ? "flex size-11 items-center justify-center rounded-2xl bg-emerald-600 text-white" : "flex size-11 items-center justify-center rounded-2xl bg-amber-600 text-white"}>
              <Power className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-bold">{online ? "Online recebendo chamadas" : "Offline para novas chamadas"}</p>
              <p className="text-sm text-muted-foreground">
                {online ? `Nova chamada expira em ${acceptCountdown}s` : "Ative para receber corridas acessiveis"}
              </p>
            </div>
          </div>
          <Button type="button" variant={online ? "default" : "outline"} onClick={() => setOnline((value) => !value)}>
            {online ? "Ficar offline" : "Ficar online"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Checklist do veiculo</CardTitle>
          <CardDescription>Confirmacao rapida antes de aceitar chamadas com acessibilidade.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          {[
            ["ramp", "Rampa/elevador testado"],
            ["lock", "Travas de seguranca"],
            ["cleaning", "Cabine higienizada"],
            ["belt", "Cinto adaptado revisado"]
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              className="focus-ring flex items-center justify-between rounded-2xl border bg-white/72 p-3 text-left dark:bg-white/5"
              onClick={() => setChecklist((current) => ({ ...current, [key]: !current[key as keyof typeof checklist] }))}
            >
              <span className="flex items-center gap-2 text-sm font-bold">
                <ClipboardCheck className="size-4 text-brand-secondary" aria-hidden="true" />
                {label}
              </span>
              <Badge variant={checklist[key as keyof typeof checklist] ? "success" : "warning"}>
                {checklist[key as keyof typeof checklist] ? "OK" : "Pendente"}
              </Badge>
            </button>
          ))}
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <WalletCards className="size-8 text-brand-secondary" aria-hidden="true" />
            <div>
              <p className="text-sm text-muted-foreground">Ganhos hoje</p>
              <p className="text-xl font-bold">{formatCurrency(driver.earningsToday)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Star className="size-8 fill-current text-amber-500" aria-hidden="true" />
            <div>
              <p className="text-sm text-muted-foreground">Nota</p>
              <p className="text-xl font-bold">{driver.rating}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <ShieldCheck className="size-8 text-brand-secondary" aria-hidden="true" />
            <div>
              <p className="text-sm text-muted-foreground">Score acessivel</p>
              <p className="text-xl font-bold">{driver.accessibilityScore}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Award className="size-8 text-brand-secondary" aria-hidden="true" />
            <div>
              <p className="text-sm text-muted-foreground">Ranking</p>
              <p className="text-xl font-bold">#{driver.ranking}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Corridas proximas</CardTitle>
            <CardDescription>Demandas com nivel de acessibilidade, distancia e ganhos estimados.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {upcomingRides.map((ride) => {
              const isAccepted = accepted.includes(ride.id);
              return (
                <div key={ride.id} className="rounded-lg border bg-white/72 p-4 dark:bg-white/5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-3">
                      <Avatar initials={ride.passenger.split(" ").map((part) => part[0]).join("").slice(0, 2)} />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold">{ride.passenger}</p>
                          <Badge variant="soft">{ride.service}</Badge>
                          {isAccepted && <Badge variant="success">Aceita</Badge>}
                        </div>
                        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="size-4" aria-hidden="true" />
                          {ride.pickup} ate {ride.destination}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-brand-primary dark:text-brand-soft">
                          <ShieldCheck className="size-4" aria-hidden="true" />
                          {ride.need}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-2 sm:text-right">
                      <span className="font-bold">{formatCurrency(ride.fare)}</span>
                      <span className="text-sm text-muted-foreground">{ride.distance}</span>
                      <Button type="button" size="sm" disabled={isAccepted || !online} onClick={() => setAccepted((current) => [...current, ride.id])}>
                        <CarFront className="size-4" aria-hidden="true" />
                        {isAccepted ? "Confirmada" : online ? "Aceitar corrida" : "Offline"}
                      </Button>
                      <Badge variant="outline">Ganho liquido {formatCurrency(ride.fare * 0.82)}</Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reputacao</CardTitle>
            <CardDescription>Ranking, bonus e selo destaque gerados pela qualidade do atendimento.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {reputation.map((item) => (
              <div key={item.label} className="grid gap-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <Progress value={item.value} />
              </div>
            ))}
            <div className="rounded-lg border bg-brand-soft/40 p-4">
              <p className="flex items-center gap-2 font-bold text-brand-primary">
                <BadgeDollarSign className="size-5" aria-hidden="true" />
                Bonus de excelencia: {formatCurrency(32)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Selo destaque ativo por 30 dias para motoristas com score acima de 95%.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Historico e estatisticas</CardTitle>
          <CardDescription>Corridas recentes, desempenho e sinais operacionais.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {rideHistory.map((ride) => (
            <div key={ride.id} className="grid gap-3 rounded-lg border bg-white/72 p-4 dark:bg-white/5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-semibold">
                  {ride.pickup.label} ate {ride.destination.label}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-4" aria-hidden="true" />
                  {formatDateTime(ride.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <Badge variant="success">
                  <CheckCircle2 className="mr-1 size-3.5" aria-hidden="true" />
                  Concluida
                </Badge>
                <Badge variant="soft">{formatCurrency(ride.price)}</Badge>
              </div>
            </div>
          ))}
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="flex items-center gap-2 font-bold">
              <TrendingUp className="size-5 text-brand-secondary" aria-hidden="true" />
              1.284 viagens, 99% sem incidentes e 94% de aceite em chamados Assist+.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
