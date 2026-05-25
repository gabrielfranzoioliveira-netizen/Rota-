"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCircle2, Heart, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FakeMap } from "@/components/fake-map";
import { PassengerOnboarding } from "@/features/passenger/passenger-onboarding";
import { RideBottomSheet } from "@/features/passenger/ride-bottom-sheet";
import { useAppDataStore } from "@/context/app-data-store";
import { useAuthStore } from "@/context/auth-store";
import { useNotificationStore } from "@/context/notification-store";
import { useRideStore } from "@/context/ride-store";

export function PassengerDashboard() {
  const user = useAuthStore((state) => state.user);
  const unreadCount = useNotificationStore((state) => state.notifications.filter((item) => !item.read).length);
  const destination = useRideStore((state) => state.destination);
  const currentRide = useRideStore((state) => state.currentRide);
  const flowStep = useRideStore((state) => state.flowStep);
  const lastToast = useAppDataStore((state) => state.lastToast);
  const clearToast = useAppDataStore((state) => state.clearToast);

  useEffect(() => {
    if (!lastToast) return;
    const timeout = window.setTimeout(clearToast, 2600);
    return () => window.clearTimeout(timeout);
  }, [clearToast, lastToast]);

  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-[calc(100dvh-9.5rem)] overflow-hidden bg-[#f8fafd]">
      <FakeMap className="min-h-[calc(100dvh-9.5rem)] rounded-none shadow-none" showStatusSheet={false} />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 p-4">
        <motion.div
          className="pointer-events-auto rounded-[1.4rem] border border-white/75 bg-white/94 p-3 shadow-premium backdrop-blur-xl"
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar initials={user.avatar} className="size-11" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">Ola, {user.name.split(" ")[0]}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {flowStep === "choosing_destination" ? "Escolha um destino" : destination.address}
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="icon" className="relative shrink-0 rounded-2xl">
              <Link href="/notificacoes" aria-label="Notificacoes">
                <Bell className="size-4" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-[#ea4335] text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="absolute left-4 top-24 z-40 grid gap-2">
        <Badge className="w-fit border-white/70 bg-white/92 text-[#188038] shadow-soft">
          <ShieldCheck className="mr-1 size-3.5" aria-hidden="true" />
          PCD verificado
        </Badge>
        <Badge className="w-fit border-white/70 bg-white/92 text-[#1a73e8] shadow-soft">
          <Sparkles className="mr-1 size-3.5" aria-hidden="true" />
          Tarifa social ativa
        </Badge>
      </div>

      <div className="absolute right-4 top-24 z-40 grid gap-2">
        <Button asChild variant="outline" size="icon" className="rounded-2xl bg-white/92 shadow-soft">
          <Link href="/locais" aria-label="Locais acessiveis">
            <MapPin className="size-4 text-[#ea4335]" aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="icon" className="rounded-2xl bg-white/92 shadow-soft">
          <Link href="/favoritos" aria-label="Favoritos">
            <Heart className="size-4 text-brand-primary" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      {currentRide?.status === "completed" && (
        <div className="absolute inset-x-4 top-36 z-40">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-700 shadow-soft">
            <CheckCircle2 className="mr-2 inline size-4" aria-hidden="true" />
            Corrida encerrada. Finalize pagamento e avaliacao.
          </div>
        </div>
      )}

      <RideBottomSheet user={user} />
      <PassengerOnboarding />

      <AnimatePresence>
        {lastToast && (
          <motion.div
            className="absolute inset-x-4 top-4 z-[80] rounded-2xl border bg-card px-4 py-3 text-sm font-bold shadow-premium"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            {lastToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
