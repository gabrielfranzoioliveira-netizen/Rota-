"use client";

import Link from "next/link";
import { useState } from "react";
import { CarFront, ShieldCheck, UserPlus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { DriverDashboard } from "@/features/driver/driver-dashboard";
import { DriverOnboarding } from "@/features/driver/driver-onboarding";
import { TrainingCenter } from "@/features/driver/training-center";
import { useAuthStore } from "@/context/auth-store";

type DriverTab = "panel" | "onboarding" | "training";

function DriverContent() {
  const user = useAuthStore((state) => state.user);
  const [tab, setTab] = useState<DriverTab>("panel");

  return (
    <div className="mx-auto grid max-w-7xl gap-6 p-4 sm:p-6 lg:p-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Avatar initials={user?.avatar ?? "CS"} className="size-14" />
          <div>
            <Badge variant="success" className="mb-2 gap-1">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Motorista treinado
            </Badge>
            <h1 className="text-3xl font-bold tracking-normal">Painel do motorista</h1>
          </div>
        </div>
        <Tabs
          value={tab}
          onValueChange={setTab}
          items={[
            { value: "panel", label: "Painel" },
            { value: "onboarding", label: "Onboarding" },
            { value: "training", label: "Treinamento" }
          ]}
        />
      </section>

      {tab === "panel" && <DriverDashboard />}
      {tab === "onboarding" && <DriverOnboarding />}
      {tab === "training" && <TrainingCenter />}
    </div>
  );
}

export function DriverPortal() {
  const user = useAuthStore((state) => state.user);

  if (user?.role === "driver") {
    return (
      <AppShell>
        <DriverContent />
      </AppShell>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="grid gap-5 p-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <Badge className="bg-white/15 text-primary-foreground">
                <CarFront className="mr-1 size-3.5" aria-hidden="true" />
                Quero ser motorista
              </Badge>
              <h1 className="mt-4 text-3xl font-bold tracking-normal">Cadastre um veiculo acessivel e libere seu selo.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/72">
                Esta area mostra o onboarding completo mesmo antes do login. Para acessar o painel operacional,
                entre com a conta demo de motorista.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" className="bg-white/10 text-primary-foreground hover:bg-white/15">
                <Link href="/login">
                  <UserPlus className="size-4" aria-hidden="true" />
                  Entrar como motorista
                </Link>
              </Button>
              <Button asChild variant="soft">
                <Link href="/cadastro">Criar conta motorista</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <DriverOnboarding publicMode />
      </div>
    </main>
  );
}
