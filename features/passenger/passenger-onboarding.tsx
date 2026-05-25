"use client";

import { ChangeEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, FileBadge, Heart, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { accessibilityOptions, favoriteLocations } from "@/data/mock";
import { useAppDataStore } from "@/context/app-data-store";
import { useAuthStore } from "@/context/auth-store";
import { useRideStore } from "@/context/ride-store";
import { cn } from "@/lib/utils";
import type { AccessibilityNeed } from "@/types";

export function PassengerOnboarding() {
  const onboardingComplete = useAppDataStore((state) => state.onboardingComplete);
  const completeOnboarding = useAppDataStore((state) => state.completeOnboarding);
  const addFavorite = useAppDataStore((state) => state.addFavorite);
  const user = useAuthStore((state) => state.user);
  const setAccessibilityNeeds = useAuthStore((state) => state.setAccessibilityNeeds);
  const verifyPcd = useAuthStore((state) => state.verifyPcd);
  const setDestination = useRideStore((state) => state.setDestination);
  const [step, setStep] = useState(0);

  if (!user || onboardingComplete) {
    return null;
  }

  const needs = user.accessibility.needs;
  const selectedFavorite = favoriteLocations[0];

  const toggleNeed = (need: AccessibilityNeed) => {
    setAccessibilityNeeds(needs.includes(need) ? needs.filter((item) => item !== need) : [...needs, need]);
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    verifyPcd(file?.name ?? "documento-pcd-rota-plus.pdf");
  };

  const finish = () => {
    addFavorite(selectedFavorite);
    setDestination(selectedFavorite);
    completeOnboarding();
  };

  const slides = [
    {
      icon: ShieldCheck,
      title: "Perfil acessivel",
      body: "Escolha o que o motorista precisa saber antes de chegar.",
      content: (
        <div className="grid grid-cols-2 gap-2">
          {accessibilityOptions.slice(0, 6).map((option) => (
            <button
              key={option.id}
              type="button"
              className={cn(
                "focus-ring rounded-2xl border p-3 text-left text-xs font-bold",
                needs.includes(option.id) ? "border-primary bg-brand-soft/65 text-brand-primary" : "bg-white/80"
              )}
              onClick={() => toggleNeed(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )
    },
    {
      icon: FileBadge,
      title: "Selo PCD",
      body: "Envie um documento mock para liberar prioridade e suporte.",
      content: (
        <div className="rounded-2xl border bg-muted/40 p-4">
          <p className="text-sm font-bold">
            {user.accessibility.verifiedPcd ? "Documento validado" : "Documento pendente"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            O upload e local e serve para demonstracao.
          </p>
          <input id="onboarding-pcd" type="file" className="sr-only" onChange={handleFile} />
          <Button asChild variant="outline" className="mt-3 w-full">
            <label htmlFor="onboarding-pcd" className="cursor-pointer">
              Enviar documento
            </label>
          </Button>
        </div>
      )
    },
    {
      icon: Heart,
      title: "Destino favorito",
      body: "Salvamos seu primeiro destino para solicitar corridas mais rapido.",
      content: (
        <div className="rounded-2xl border bg-white/80 p-4">
          <Badge variant="soft">Sugestao</Badge>
          <p className="mt-3 font-bold">{selectedFavorite.label}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{selectedFavorite.address}</p>
        </div>
      )
    }
  ];

  const SlideIcon = slides[step].icon;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[70] flex items-end bg-black/35 p-3 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.section
          className="w-full rounded-[1.6rem] bg-card p-5 shadow-premium"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <SlideIcon className="size-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
                  Onboarding Rota+
                </p>
                <h2 className="text-xl font-bold">{slides[step].title}</h2>
              </div>
            </div>
            <button type="button" className="focus-ring rounded-full p-2" onClick={finish} aria-label="Fechar onboarding">
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <p className="mb-4 text-sm leading-6 text-muted-foreground">{slides[step].body}</p>
          {slides[step].content}
          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex gap-1.5">
              {slides.map((slide, index) => (
                <span
                  key={slide.title}
                  className={cn("h-1.5 rounded-full transition-all", index === step ? "w-8 bg-primary" : "w-2 bg-muted")}
                />
              ))}
            </div>
            <Button type="button" onClick={step === slides.length - 1 ? finish : () => setStep((value) => value + 1)}>
              {step === slides.length - 1 ? (
                <>
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  Concluir
                </>
              ) : (
                <>
                  <SlidersHorizontal className="size-4" aria-hidden="true" />
                  Continuar
                </>
              )}
            </Button>
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}
