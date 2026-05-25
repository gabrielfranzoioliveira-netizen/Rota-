"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Accessibility, ArrowRight, KeyRound, Loader2, Mail, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { useAuthStore } from "@/context/auth-store";
import { demoCredentials } from "@/lib/constants";
import { roleRoute } from "@/lib/utils";
import type { AccessibilityRequirement, UserRole } from "@/types";

interface AuthPanelProps {
  mode: "login" | "register" | "recover";
}

export function AuthPanel({ mode }: AuthPanelProps) {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const recover = useAuthStore((state) => state.recover);
  const status = useAuthStore((state) => state.status);
  const message = useAuthStore((state) => state.message);
  const user = useAuthStore((state) => state.user);
  const [form, setForm] = useState({
    name: "",
    email: "ana@rota.plus.demo",
    phone: "",
    password: "demo1234",
    role: "passenger" as UserRole,
    location: "Rua Harmonia, 248 - Vila Madalena",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    accessibilityRequired: "yes" as AccessibilityRequirement
  });

  const loading = status === "loading";

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "login") {
      const ok = await login(form.email, form.password);
      if (ok) {
        const targetRole = useAuthStore.getState().user?.role ?? "passenger";
        router.push(roleRoute(targetRole));
      }
      return;
    }

    if (mode === "recover") {
      await recover(form.email);
      return;
    }

    const ok = await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: form.role,
      location: form.location,
      accessibilityRequired: form.accessibilityRequired,
      emergencyContact: form.emergencyName
        ? {
            name: form.emergencyName,
            phone: form.emergencyPhone,
            relation: form.emergencyRelation || "Contato de emergencia"
          }
        : undefined
    });

    if (ok) {
      router.push(roleRoute(form.role));
    }
  };

  const title = {
    login: "Entrar no Rota+",
    register: "Criar conta acessivel",
    recover: "Recuperar senha"
  }[mode];

  const description = {
    login: "Use uma conta demo ou seu cadastro local para acessar a experiencia.",
    register: "Crie um perfil com preferencias reais de acessibilidade.",
    recover: "Simule o envio de instrucoes para recuperar sua senha."
  }[mode];

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[0.92fr_1.08fr]">
      <section className="relative hidden overflow-hidden bg-brand-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 map-grid opacity-20" aria-hidden="true" />
        <div className="relative z-10">
          <Logo className="text-primary-foreground" />
          <h1 className="mt-16 max-w-xl text-5xl font-bold leading-tight tracking-normal">
            Autonomia, seguranca e acessibilidade no mesmo app.
          </h1>
          <p className="mt-5 max-w-lg text-primary-foreground/72">
            A demo ja inclui passageiro, motorista, cuidador e hospital com dados persistidos no navegador.
          </p>
        </div>
        <div className="relative z-10 grid gap-3">
          <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm font-semibold">Contas demo</p>
            <div className="mt-3 grid gap-2">
              {demoCredentials.map((credential) => (
                <button
                  key={credential.email}
                  type="button"
                  className="focus-ring flex items-center justify-between rounded-md bg-white/10 px-3 py-2 text-left text-sm font-semibold hover:bg-white/15"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      email: credential.email,
                      password: credential.password
                    }))
                  }
                >
                  <span>{credential.label}</span>
                  <span className="text-xs opacity-70">{credential.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center p-5">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <Logo />
              <Badge variant="soft" className="gap-1">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Mock seguro
              </Badge>
            </div>
            <CardTitle className="mt-7 flex items-center gap-2 text-2xl">
              {mode === "register" ? <UserPlus className="size-6 text-brand-secondary" /> : <KeyRound className="size-6 text-brand-secondary" />}
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              {mode === "register" && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" value={form.name} onChange={(event) => handleChange("name", event.target.value)} required />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" value={form.phone} onChange={(event) => handleChange("phone", event.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Perfil</Label>
                      <Select id="role" value={form.role} onChange={(event) => handleChange("role", event.target.value)}>
                        <option value="passenger">Passageiro</option>
                        <option value="driver">Motorista</option>
                        <option value="guardian">Responsavel</option>
                        <option value="hospital">Hospital</option>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Localizacao</Label>
                    <Input id="location" value={form.location} onChange={(event) => handleChange("location", event.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="accessibility">Voce precisa de acessibilidade?</Label>
                    <Select
                      id="accessibility"
                      value={form.accessibilityRequired}
                      onChange={(event) => handleChange("accessibilityRequired", event.target.value)}
                    >
                      <option value="yes">Sim</option>
                      <option value="no">Nao</option>
                      <option value="temporary">Temporariamente</option>
                    </Select>
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-4">
                    <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <Accessibility className="size-4 text-brand-secondary" aria-hidden="true" />
                      Contato de emergencia
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Input placeholder="Nome" value={form.emergencyName} onChange={(event) => handleChange("emergencyName", event.target.value)} />
                      <Input placeholder="Telefone" value={form.emergencyPhone} onChange={(event) => handleChange("emergencyPhone", event.target.value)} />
                      <Input placeholder="Relacao" value={form.emergencyRelation} onChange={(event) => handleChange("emergencyRelation", event.target.value)} />
                    </div>
                  </div>
                </>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => handleChange("email", event.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {mode !== "recover" && (
                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(event) => handleChange("password", event.target.value)}
                    required
                  />
                </div>
              )}

              {message && (
                <div className="rounded-md border bg-muted px-3 py-2 text-sm font-medium text-muted-foreground">
                  {message}
                </div>
              )}

              <Button type="submit" size="lg" disabled={loading || (mode === "register" && !form.name)}>
                {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                {mode === "login" && "Entrar"}
                {mode === "register" && "Criar conta"}
                {mode === "recover" && "Enviar recuperacao"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold">
              {mode !== "login" ? <Link href="/login" className="text-brand-primary hover:underline">Ja tenho conta</Link> : <Link href="/recuperar-senha" className="text-brand-primary hover:underline">Esqueci senha</Link>}
              {mode !== "register" && <Link href="/cadastro" className="text-brand-primary hover:underline">Criar conta</Link>}
            </div>

            {user && (
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href={roleRoute(user.role)}>Voltar para meu painel</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
