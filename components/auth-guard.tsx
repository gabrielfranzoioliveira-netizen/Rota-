"use client";

import Link from "next/link";
import { LockKeyhole, UserRoundCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { useAuthStore } from "@/context/auth-store";
import { ROLE_LABELS } from "@/data/mock";
import type { UserRole } from "@/types";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const user = useAuthStore((state) => state.user);
  const switchRole = useAuthStore((state) => state.switchRole);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Logo />
            <CardTitle className="mt-6 flex items-center gap-2">
              <LockKeyhole className="size-5 text-brand-secondary" aria-hidden="true" />
              Acesso protegido
            </CardTitle>
            <CardDescription>
              Entre com uma conta demo ou crie seu perfil para acessar os fluxos funcionais.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/cadastro">Criar conta</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <Logo />
            <CardTitle className="mt-6 flex items-center gap-2">
              <UserRoundCog className="size-5 text-brand-secondary" aria-hidden="true" />
              Perfil diferente ativo
            </CardTitle>
            <CardDescription>
              Seu perfil atual e {ROLE_LABELS[user.role]}. Esta area usa o perfil{" "}
              {allowedRoles.map((role) => ROLE_LABELS[role]).join(" ou ")}.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={() => switchRole(allowedRoles[0])}>
              Usar perfil {ROLE_LABELS[allowedRoles[0]]}
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Voltar ao inicio</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return <>{children}</>;
}
