"use client";

import { ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  Accessibility,
  BadgeCheck,
  Eye,
  Footprints,
  HandHeart,
  ShieldCheck,
  Upload,
  UserRoundPlus,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { accessibilityOptions } from "@/data/mock";
import { useAuthStore } from "@/context/auth-store";
import { cn } from "@/lib/utils";
import type { AccessibilityNeed } from "@/types";

const iconMap = {
  wheelchair: Accessibility,
  wide_space: UserRoundPlus,
  ramp: Footprints,
  boarding_help: HandHeart,
  companion: Users,
  visual_impairment: Eye,
  reduced_mobility: ShieldCheck
};

export function AccessibilityProfilePanel() {
  const user = useAuthStore((state) => state.user);
  const setAccessibilityNeeds = useAuthStore((state) => state.setAccessibilityNeeds);
  const verifyPcd = useAuthStore((state) => state.verifyPcd);
  const needs = user?.accessibility.needs ?? [];

  const toggleNeed = (need: AccessibilityNeed) => {
    const nextNeeds = needs.includes(need) ? needs.filter((item) => item !== need) : [...needs, need];
    setAccessibilityNeeds(nextNeeds);
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      verifyPcd(file.name);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Perfil de acessibilidade</CardTitle>
            <CardDescription>Selecione recursos para combinar sua viagem com o veiculo ideal.</CardDescription>
          </div>
          {user?.accessibility.verifiedPcd ? (
            <Badge variant="success" className="gap-1">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              PCD verificado
            </Badge>
          ) : (
            <Badge variant="warning">Verificacao pendente</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {accessibilityOptions.map((option) => {
            const Icon = iconMap[option.id];
            const active = needs.includes(option.id);
            return (
              <motion.button
                key={option.id}
                type="button"
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "focus-ring rounded-lg border p-4 text-left transition-all",
                  active
                    ? "border-brand-primary bg-brand-soft/55 shadow-soft"
                    : "bg-white/70 hover:border-brand-support hover:bg-brand-soft/20 dark:bg-white/5"
                )}
                onClick={() => toggleNeed(option.id)}
                aria-pressed={active}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-lg",
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-brand-primary"
                    )}
                  >
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold">{option.label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="grid gap-4 rounded-lg border bg-muted/40 p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="font-semibold">Verificacao PCD</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload mock libera prioridade, motoristas especializados e suporte premium.
            </p>
            {user?.accessibility.verificationDocument && (
              <p className="mt-2 text-xs font-semibold text-brand-primary">
                Documento: {user.accessibility.verificationDocument}
              </p>
            )}
          </div>
          <div>
            <input id="pcd-document" type="file" className="sr-only" onChange={handleUpload} />
            <Button asChild variant={user?.accessibility.verifiedPcd ? "outline" : "default"}>
              <label htmlFor="pcd-document" className="cursor-pointer">
                <Upload className="size-4" aria-hidden="true" />
                Enviar documento
              </label>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
