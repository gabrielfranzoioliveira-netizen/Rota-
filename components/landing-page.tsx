"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  CheckCircle2,
  Clock,
  HeartHandshake,
  MapPinned,
  MessageCircleQuestion,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { brandStats } from "@/lib/constants";

const resources = [
  {
    icon: Route,
    title: "Rotas acessiveis",
    text: "Trajetos simulados consideram rampas, pontos amplos e locais de embarque mais seguros."
  },
  {
    icon: ShieldCheck,
    title: "Seguranca ativa",
    text: "SOS, compartilhamento de viagem, contato de emergencia e motorista verificado."
  },
  {
    icon: HeartHandshake,
    title: "Motoristas treinados",
    text: "Aulas de inclusao, embarque assistido, primeiros socorros e cuidado no atendimento."
  }
];

const benefits = [
  "Prioridade para PCD verificado",
  "Veiculos com rampa, elevador e porta ampla",
  "Modo cuidador para acompanhar viagens",
  "Hospitais podem agendar transportes acessiveis",
  "Comandos por voz simulados",
  "Modo escuro e experiencia responsiva"
];

const steps = [
  "Crie seu perfil de acessibilidade",
  "Escolha destino e tipo de servico",
  "Acompanhe motorista e rota em tempo real",
  "Pague e avalie cuidado, conforto e acessibilidade"
];

const testimonials = [
  {
    name: "Ana Beatriz",
    role: "Passageira",
    quote: "Pela primeira vez a corrida ja comeca sabendo que meu embarque sera respeitado."
  },
  {
    name: "Dr. Fabio Martins",
    role: "Coordenador hospitalar",
    quote: "A gestao de altas ficou mais previsivel, humana e segura para pacientes com mobilidade reduzida."
  },
  {
    name: "Carlos Henrique",
    role: "Motorista parceiro",
    quote: "O treinamento deixa claro como ajudar sem tirar autonomia de quem esta viajando."
  }
];

const faqs = [
  {
    question: "Rota+ depende de Google Maps?",
    answer: "Nesta demo, nao. O mapa e proprio, simulado e funcional para mostrar rotas, veiculos e movimento."
  },
  {
    question: "A verificacao PCD e real?",
    answer: "O upload e mockado para demonstracao, exibindo selo, beneficios e estados de confirmacao."
  },
  {
    question: "Existem perfis diferentes?",
    answer: "Sim. Passageiro, motorista, responsavel e hospital possuem fluxos navegaveis."
  }
];

export function LandingPage() {
  return (
    <main className="overflow-hidden bg-background text-foreground">
      <header className="fixed left-0 right-0 top-0 z-40 border-b bg-white/78 backdrop-blur-xl dark:bg-card/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-semibold text-muted-foreground md:flex">
            <a href="#recursos" className="hover:text-foreground">
              Recursos
            </a>
            <a href="#funcionamento" className="hover:text-foreground">
              Funcionamento
            </a>
            <a href="#faq" className="hover:text-foreground">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/cadastro">Criar conta</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-[92vh] items-center overflow-hidden px-5 pb-20 pt-32">
        <div className="absolute inset-0 map-grid bg-[#d5ffff]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,89,84,0.20),transparent_28rem),radial-gradient(circle_at_80%_12%,rgba(93,193,185,0.30),transparent_24rem),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(213,255,255,0.94))]" />
        <motion.div
          className="absolute left-[7%] top-[48%] hidden size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-premium md:flex"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <CarFront className="size-7" aria-hidden="true" />
        </motion.div>
        <motion.div
          className="absolute right-[14%] top-[28%] hidden size-14 items-center justify-center rounded-full bg-white text-brand-primary shadow-premium md:flex"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 4.6, repeat: Infinity }}
        >
          <MapPinned className="size-6" aria-hidden="true" />
        </motion.div>
        <svg className="absolute inset-0 hidden size-full opacity-60 md:block" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 9 52 C 28 18, 52 76, 75 30 S 92 50, 96 24" fill="none" stroke="#005954" strokeLinecap="round" strokeWidth="0.7" />
        </svg>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <Badge variant="soft" className="mb-5 gap-2">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Mobilidade inclusiva sob demanda
            </Badge>
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.03] tracking-normal text-brand-primary sm:text-6xl lg:text-7xl">
              Rota+
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/78">
              Mobilidade acessivel para todos. Transporte desenvolvido para oferecer independencia,
              conforto e seguranca.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/cadastro">
                  Comecar agora
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/motorista">Quero ser motorista</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="grid gap-3 rounded-lg border bg-white/78 p-4 shadow-premium backdrop-blur dark:bg-card/80"
          >
            <div className="flex items-center justify-between rounded-md bg-primary p-4 text-primary-foreground">
              <div>
                <p className="text-sm font-semibold opacity-85">Assist+ chegando</p>
                <p className="mt-1 text-2xl font-bold">5 min</p>
              </div>
              <BadgeCheck className="size-9" aria-hidden="true" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {brandStats.map((stat) => (
                <div key={stat.label} className="rounded-md border bg-white/80 p-3 text-center dark:bg-white/5">
                  <p className="text-xl font-bold text-brand-primary dark:text-brand-soft">{stat.value}</p>
                  <p className="text-xs font-semibold text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="recursos" className="bg-white px-5 py-20 dark:bg-transparent">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <Badge variant="soft">Recursos</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-normal sm:text-4xl">
              Uma plataforma pensada para autonomia real
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {resources.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title}>
                  <CardHeader>
                    <div className="mb-3 flex size-12 items-center justify-center rounded-lg bg-brand-soft/60 text-brand-primary">
                      <Icon className="size-6" aria-hidden="true" />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <Badge variant="soft">Beneficios</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-normal sm:text-4xl">
              Confianca para passageiro, familia, hospital e motorista
            </h2>
            <p className="mt-4 text-muted-foreground">
              Rota+ centraliza cuidado, verificacao e visibilidade operacional em uma experiencia simples.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 rounded-lg border bg-card p-4 shadow-soft">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-secondary" aria-hidden="true" />
                <span className="text-sm font-semibold">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="funcionamento" className="bg-white px-5 py-20 dark:bg-transparent">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <Badge variant="soft">Funcionamento</Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-normal sm:text-4xl">
                Da solicitação à avaliação em poucos toques
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/passageiro">Ver dashboard</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="rounded-lg border bg-card p-5 shadow-soft">
                <div className="mb-5 flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <p className="font-semibold leading-6">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.name}>
                <CardHeader>
                  <div className="flex gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="size-4 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <CardTitle>{item.name}</CardTitle>
                  <p className="text-sm font-semibold text-muted-foreground">{item.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">&ldquo;{item.quote}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white px-5 py-20 dark:bg-transparent">
        <div className="mx-auto max-w-4xl">
          <Badge variant="soft" className="gap-2">
            <MessageCircleQuestion className="size-3.5" aria-hidden="true" />
            FAQ
          </Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-normal">Perguntas frequentes</h2>
          <div className="mt-8 grid gap-3">
            {faqs.map((item) => (
              <details key={item.question} className="rounded-lg border bg-card p-5 shadow-soft">
                <summary className="cursor-pointer font-semibold">{item.question}</summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t bg-brand-primary px-5 py-10 text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Logo className="text-primary-foreground" />
            <p className="mt-4 max-w-xl text-sm leading-6 text-primary-foreground/72">
              Rota+ e uma demonstracao funcional de transporte acessivel com foco em inclusao,
              tecnologia, seguranca e autonomia.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm font-semibold">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-2">
              <Clock className="size-4" aria-hidden="true" />
              Suporte 24/7
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-2">
              <UsersRound className="size-4" aria-hidden="true" />
              Comunidade ativa
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
