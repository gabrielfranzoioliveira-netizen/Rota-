"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CarFront,
  Heart,
  History,
  Home,
  Hospital,
  Map,
  MapPinned,
  Settings,
  Shield,
  Users
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useAuthStore } from "@/context/auth-store";
import { useNotificationStore } from "@/context/notification-store";
import { ROLE_LABELS } from "@/data/mock";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/passageiro", label: "Passageiro", icon: Home },
  { href: "/motorista", label: "Motorista", icon: CarFront },
  { href: "/cuidador", label: "Cuidador", icon: Shield },
  { href: "/hospital", label: "Hospital", icon: Hospital },
  { href: "/comunidade", label: "Comunidade", icon: Users },
  { href: "/rotas", label: "Rotas", icon: Map },
  { href: "/locais", label: "Locais", icon: MapPinned },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  { href: "/historico", label: "Historico", icon: History },
  { href: "/notificacoes", label: "Alertas", icon: Bell },
  { href: "/configuracoes", label: "Ajustes", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const immersiveRideHome = pathname === "/passageiro";
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const unreadCount = useNotificationStore((state) => state.notifications.filter((item) => !item.read).length);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className={cn("min-h-screen", immersiveRideHome && "h-full min-h-0")}>
      {!immersiveRideHome && (
        <header className="sticky top-0 z-30 border-b bg-white/86 px-4 py-3 backdrop-blur-xl dark:bg-card/90">
          <div className="flex items-center justify-between">
            <Logo compact />
            <div className="flex min-w-0 items-center gap-2">
              <div className="hidden min-w-0 text-right min-[390px]:block">
                <p className="truncate text-xs font-bold">{user?.name.split(" ")[0] ?? "Visitante"}</p>
                <p className="text-[10px] font-semibold text-muted-foreground">
                  {user ? ROLE_LABELS[user.role] : "Demo"}
                </p>
              </div>
              <Button asChild variant="outline" size="icon" aria-label="Notificacoes">
                <Link href="/notificacoes">
                  <Bell className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <button type="button" onClick={handleLogout} aria-label="Sair">
                <Avatar initials={user?.avatar ?? "R+"} className="size-10" />
              </button>
            </div>
          </div>
        </header>
      )}
      {!immersiveRideHome && (
        <nav className="sticky top-[65px] z-20 flex gap-2 overflow-x-auto border-b bg-white/76 px-3 py-2 backdrop-blur-xl dark:bg-card/80">
          {navItems.slice(5).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition-colors",
                  active ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {item.label}
                {item.href === "/notificacoes" && unreadCount > 0 && <span>{unreadCount}</span>}
              </Link>
            );
          })}
        </nav>
      )}
      <main className={immersiveRideHome ? "h-full min-h-0 overflow-hidden" : "pb-24"}>{children}</main>
      {!immersiveRideHome && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t bg-white/94 p-2 backdrop-blur-xl dark:bg-card/95">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring flex flex-col items-center gap-1 rounded-md px-2 py-2 text-[11px] font-semibold",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
