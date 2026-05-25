"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Accessibility,
  Bell,
  Building2,
  CheckCircle2,
  Heart,
  History,
  Map,
  MapPinned,
  MessageSquarePlus,
  Moon,
  Radio,
  Route,
  Save,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  WifiOff
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { FakeMap } from "@/components/fake-map";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  accessiblePlaces,
  accessibleRoutes,
  communityPosts,
  hospitalTransfers
} from "@/data/mock";
import { useAuthStore } from "@/context/auth-store";
import { useAppDataStore } from "@/context/app-data-store";
import { useNotificationStore } from "@/context/notification-store";
import { useUiStore } from "@/context/ui-store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { AccessiblePlace, CommunityPost } from "@/types";

type ExtraKind =
  | "guardian"
  | "hospital"
  | "community"
  | "routes"
  | "places"
  | "favorites"
  | "history"
  | "notifications"
  | "settings";

const pageMeta: Record<ExtraKind, { title: string; description: string; icon: typeof Bell }> = {
  guardian: {
    title: "Modo cuidador",
    description: "Acompanhe viagens, contato de emergencia e compartilhamento seguro.",
    icon: ShieldCheck
  },
  hospital: {
    title: "Modo hospital",
    description: "Agende transportes acessiveis e acompanhe altas com previsibilidade.",
    icon: Building2
  },
  community: {
    title: "Comunidade",
    description: "Relatos, dicas de rotas e informacoes uteis compartilhadas pela rede.",
    icon: Users
  },
  routes: {
    title: "Rotas acessiveis",
    description: "Percursos com guias de calcada, elevadores, alertas e pontos de embarque.",
    icon: Route
  },
  places: {
    title: "Locais acessiveis",
    description: "Hospitais, cultura, alimentacao, servicos e transporte com recursos validados.",
    icon: MapPinned
  },
  favorites: {
    title: "Favoritos",
    description: "Enderecos frequentes e atalhos para solicitar viagens rapidamente.",
    icon: Heart
  },
  history: {
    title: "Historico",
    description: "Viagens concluidas, pagamentos e avaliacoes salvas na demo.",
    icon: History
  },
  notifications: {
    title: "Notificacoes",
    description: "Alertas de viagem, seguranca, sistema e beneficios.",
    icon: Bell
  },
  settings: {
    title: "Configuracoes",
    description: "Tema, offline, voz simulada e preferencias da experiencia.",
    icon: SlidersHorizontal
  }
};

export function ExtraFeaturePage({ kind }: { kind: ExtraKind }) {
  const meta = pageMeta[kind];
  const Icon = meta.icon;
  const user = useAuthStore((state) => state.user);

  return (
    <AppShell>
      <div className="mx-auto grid max-w-7xl gap-6 p-4 sm:p-6 lg:p-8">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft">
              <Icon className="size-7" aria-hidden="true" />
            </div>
            <div>
              <Badge variant="soft" className="mb-2">
                {user ? `${user.name.split(" ")[0]}, perfil ativo` : "Demo acessivel"}
              </Badge>
              <h1 className="text-3xl font-bold tracking-normal">{meta.title}</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{meta.description}</p>
            </div>
          </div>
        </section>
        {kind === "guardian" && <GuardianMode />}
        {kind === "hospital" && <HospitalMode />}
        {kind === "community" && <CommunityMode />}
        {kind === "routes" && <RoutesMode />}
        {kind === "places" && <PlacesMode />}
        {kind === "favorites" && <FavoritesMode />}
        {kind === "history" && <HistoryMode />}
        {kind === "notifications" && <NotificationsMode />}
        {kind === "settings" && <SettingsMode />}
      </div>
    </AppShell>
  );
}

function GuardianMode() {
  const [tracking, setTracking] = useState(true);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <CardHeader>
          <CardTitle>Viagem acompanhada</CardTitle>
          <CardDescription>Visao do responsavel com rota, motorista e contato de emergencia.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-4">
            <Avatar initials="AB" />
            <div>
              <p className="font-bold">Ana Beatriz esta em Assist+</p>
              <p className="text-sm text-muted-foreground">Destino: Hospital das Clinicas • Chegada em 9 min</p>
            </div>
          </div>
          <Progress value={62} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Button type="button" onClick={() => setTracking(!tracking)}>
              <Map className="size-4" aria-hidden="true" />
              {tracking ? "Pausar acompanhamento" : "Acompanhar rota"}
            </Button>
            <Button type="button" variant="destructive">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Acionar suporte
            </Button>
          </div>
          <div className="rounded-lg border bg-brand-soft/35 p-4">
            <p className="font-semibold">Contato de emergencia</p>
            <p className="mt-1 text-sm text-muted-foreground">Marcos Lima • +55 11 97777-4500 • Irmao</p>
          </div>
        </CardContent>
      </Card>
      <FakeMap compact />
    </div>
  );
}

function HospitalMode() {
  const [transfers, setTransfers] = useState(hospitalTransfers);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>Transportes agendados</CardTitle>
          <CardDescription>Fila operacional para altas, consultas e reabilitacao.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {transfers.map((transfer) => (
            <div key={transfer.id} className="rounded-lg border bg-white/72 p-4 dark:bg-white/5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold">{transfer.patient}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {transfer.pickup} ate {transfer.destination}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-brand-primary dark:text-brand-soft">{transfer.need}</p>
                </div>
                <div className="grid gap-2 sm:text-right">
                  <Badge variant="soft">{transfer.time}</Badge>
                  <Badge variant={transfer.status.includes("confirmado") ? "success" : "warning"}>{transfer.status}</Badge>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      setTransfers((current) =>
                        current.map((item) =>
                          item.id === transfer.id ? { ...item, status: "Motorista confirmado" } : item
                        )
                      )
                    }
                  >
                    Confirmar motorista
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Novo agendamento</CardTitle>
          <CardDescription>Formulario mock para demonstrar criacao de transporte hospitalar.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Input defaultValue="Paciente em alta" aria-label="Paciente" />
          <Select defaultValue="assist">
            <option value="assist">Assist+ com acompanhante</option>
            <option value="van">Van acessivel com elevador</option>
            <option value="comfort">Comfort PCD</option>
          </Select>
          <Input defaultValue="17:40" aria-label="Horario" />
          <Button type="button">
            <Save className="size-4" aria-hidden="true" />
            Salvar agendamento
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function CommunityMode() {
  const [posts, setPosts] = useState<CommunityPost[]>(communityPosts);
  const [post, setPost] = useState({
    title: "Elevador funcionando na Estacao Pinheiros",
    body: "Passei agora e o acesso principal esta livre, com equipe de apoio no local."
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPosts((current) => [
      {
        id: `post_${Date.now()}`,
        author: "Voce",
        title: post.title,
        body: post.body,
        likes: 0,
        tag: "Atualizacao"
      },
      ...current
    ]);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
      <Card>
        <CardHeader>
          <CardTitle>Publicar alerta</CardTitle>
          <CardDescription>Compartilhe uma informacao util para outras pessoas.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-3">
            <Input value={post.title} onChange={(event) => setPost((current) => ({ ...current, title: event.target.value }))} />
            <Textarea value={post.body} onChange={(event) => setPost((current) => ({ ...current, body: event.target.value }))} />
            <Button type="submit">
              <MessageSquarePlus className="size-4" aria-hidden="true" />
              Publicar
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-3">
        {posts.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant="soft">{item.tag}</Badge>
                  <h2 className="mt-3 font-bold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                  <p className="mt-3 text-xs font-semibold text-muted-foreground">por {item.author}</p>
                </div>
                <Badge variant="outline">{item.likes} curtidas</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RoutesMode() {
  const [selectedRoute, setSelectedRoute] = useState(accessibleRoutes[0]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <Card>
        <CardHeader>
          <CardTitle>Rotas avaliadas</CardTitle>
          <CardDescription>Escolha uma rota para ver alertas de acessibilidade.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {accessibleRoutes.map((route) => (
            <button
              key={route.id}
              type="button"
              className="focus-ring rounded-lg border bg-white/72 p-4 text-left hover:bg-brand-soft/20 dark:bg-white/5"
              onClick={() => setSelectedRoute(route)}
            >
              <p className="font-bold">{route.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {route.distanceKm} km • {route.curbCuts} guias rebaixadas • {route.elevators} elevadores
              </p>
            </button>
          ))}
        </CardContent>
      </Card>
      <div className="grid gap-4">
        <FakeMap compact />
        <Card>
          <CardContent className="grid gap-3 p-5">
            <Badge variant="success">Piso {selectedRoute.surface}</Badge>
            <h2 className="text-xl font-bold">{selectedRoute.title}</h2>
            {selectedRoute.warnings.map((warning) => (
              <div key={warning} className="rounded-md border bg-muted px-3 py-2 text-sm font-semibold text-muted-foreground">
                {warning}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PlacesMode() {
  const [category, setCategory] = useState<AccessiblePlace["category"] | "all">("all");
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      accessiblePlaces.filter(
        (place) =>
          (category === "all" || place.category === category) &&
          place.name.toLowerCase().includes(query.toLowerCase())
      ),
    [category, query]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa de locais acessiveis</CardTitle>
        <CardDescription>Filtro funcional por categoria e busca local.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 md:grid-cols-[1fr_15rem]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Buscar local acessivel" />
          </div>
          <Select value={category} onChange={(event) => setCategory(event.target.value as AccessiblePlace["category"] | "all")}>
            <option value="all">Todas categorias</option>
            <option value="hospital">Hospital</option>
            <option value="culture">Cultura</option>
            <option value="food">Alimentacao</option>
            <option value="service">Servico</option>
            <option value="transport">Transporte</option>
          </Select>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((place) => (
            <div key={place.id} className="rounded-lg border bg-white/72 p-4 dark:bg-white/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{place.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{place.address}</p>
                </div>
                <Badge variant={place.openNow ? "success" : "warning"}>{place.openNow ? "Aberto" : "Fechado"}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="soft">{place.distanceKm} km</Badge>
                <Badge variant="outline">Nota {place.rating}</Badge>
                {place.features.slice(0, 3).map((feature) => (
                  <Badge key={feature} variant="soft">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FavoritesMode() {
  const favorites = useAppDataStore((state) => state.favorites);
  const addFavorite = useAppDataStore((state) => state.addFavorite);
  const [name, setName] = useState("Centro de Reabilitacao Norte");

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle>Novo favorito</CardTitle>
          <CardDescription>Adicione um endereco frequente para rotas mais rapidas.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Input value={name} onChange={(event) => setName(event.target.value)} />
          <Button
            type="button"
            onClick={() =>
              addFavorite({
                label: name,
                address: `${name}, Sao Paulo`,
                lat: -23.55,
                lng: -46.66
              })
            }
          >
            <Heart className="size-4" aria-hidden="true" />
            Salvar favorito
          </Button>
        </CardContent>
      </Card>
      <div className="grid gap-3">
        {favorites.map((favorite) => (
          <Card key={`${favorite.label}-${favorite.address}`}>
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold">{favorite.label}</p>
                <p className="text-sm text-muted-foreground">{favorite.address}</p>
              </div>
              <Button type="button" variant="outline">
                Solicitar viagem
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function HistoryMode() {
  const persistedRideHistory = useAppDataStore((state) => state.rideHistory);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Viagens anteriores</CardTitle>
        <CardDescription>Pagamentos, motoristas e avaliacoes registradas localmente.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {persistedRideHistory.map((ride) => (
          <div key={ride.id} className="grid gap-3 rounded-lg border bg-white/72 p-4 dark:bg-white/5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="font-bold">
                {ride.pickup.label} ate {ride.destination.label}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {ride.driver?.name} • {formatDateTime(ride.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              <Badge variant="success">{ride.paymentMethod?.toUpperCase()}</Badge>
              <Badge variant="soft">{formatCurrency(ride.price)}</Badge>
              <Badge variant="outline">{ride.rating?.accessibility}/5 acessibilidade</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function NotificationsMode() {
  const notifications = useNotificationStore((state) => state.notifications);
  const markRead = useNotificationStore((state) => state.markRead);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const clearRead = useNotificationStore((state) => state.clearRead);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Central de notificacoes</CardTitle>
            <CardDescription>Mensagens acionaveis com estados de leitura.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={markAllRead}>
              Marcar lidas
            </Button>
            <Button type="button" variant="ghost" onClick={clearRead}>
              Limpar lidas
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        {notifications.map((item) => (
          <button
            key={item.id}
            type="button"
            className="focus-ring rounded-lg border bg-white/72 p-4 text-left hover:bg-brand-soft/20 dark:bg-white/5"
            onClick={() => markRead(item.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </div>
              <Badge variant={item.read ? "outline" : "success"}>{item.read ? "Lida" : "Nova"}</Badge>
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function SettingsMode() {
  const darkMode = useUiStore((state) => state.darkMode);
  const offlineMode = useUiStore((state) => state.offlineMode);
  const voiceEnabled = useUiStore((state) => state.voiceEnabled);
  const accessibilityPreferences = useUiStore((state) => state.accessibilityPreferences);
  const toggleDarkMode = useUiStore((state) => state.toggleDarkMode);
  const toggleOfflineMode = useUiStore((state) => state.toggleOfflineMode);
  const toggleVoice = useUiStore((state) => state.toggleVoice);
  const setFontScale = useUiStore((state) => state.setFontScale);
  const toggleHighContrast = useUiStore((state) => state.toggleHighContrast);
  const toggleLowVisionMode = useUiStore((state) => state.toggleLowVisionMode);
  const toggleLargeControls = useUiStore((state) => state.toggleLargeControls);

  const settings = [
    {
      icon: Moon,
      label: "Modo escuro",
      description: "Ajusta contraste e reduz brilho em ambientes escuros.",
      checked: darkMode,
      action: toggleDarkMode
    },
    {
      icon: WifiOff,
      label: "Modo offline",
      description: "Simula indisponibilidade de rede para testar estados do produto.",
      checked: offlineMode,
      action: toggleOfflineMode
    },
    {
      icon: Radio,
      label: "Comandos por voz",
      description: "Exibe a central de comandos simulados no canto da tela.",
      checked: voiceEnabled,
      action: toggleVoice
    },
    {
      icon: Accessibility,
      label: "Alto contraste",
      description: "Aumenta contraste para baixa visao e leitura em rua.",
      checked: accessibilityPreferences.highContrast,
      action: toggleHighContrast
    },
    {
      icon: Accessibility,
      label: "Modo baixa visao",
      description: "Melhora foco, contornos e leitura de controles.",
      checked: accessibilityPreferences.lowVisionMode,
      action: toggleLowVisionMode
    },
    {
      icon: SlidersHorizontal,
      label: "Botoes grandes",
      description: "Aumenta area minima de toque em acoes importantes.",
      checked: accessibilityPreferences.largeControls,
      action: toggleLargeControls
    }
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>Preferencias</CardTitle>
          <CardDescription>Controles persistidos no navegador.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="rounded-lg border bg-white/72 p-4 dark:bg-white/5">
            <p className="mb-3 font-semibold">Tamanho do texto</p>
            <Select
              value={accessibilityPreferences.fontScale}
              onChange={(event) => setFontScale(event.target.value as "normal" | "large" | "extra")}
            >
              <option value="normal">Padrao</option>
              <option value="large">Grande</option>
              <option value="extra">Extra grande</option>
            </Select>
          </div>
          {settings.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between gap-4 rounded-lg border bg-white/72 p-4 dark:bg-white/5">
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-5 text-brand-secondary" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <Switch checked={item.checked} onCheckedChange={item.action} />
              </div>
            );
          })}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Estados da aplicacao</CardTitle>
          <CardDescription>Sucesso, erro, vazio, carregando e offline ficam demonstraveis nos fluxos.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            <CheckCircle2 className="mr-2 inline size-4" aria-hidden="true" />
            Sucesso: preferencias salvas automaticamente.
          </div>
          <div className="rounded-md border bg-muted p-3 text-sm font-semibold text-muted-foreground">
            Estado vazio: listas filtradas sem resultados exibem contexto.
          </div>
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            Offline: ative o modo offline para ver o banner global.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
