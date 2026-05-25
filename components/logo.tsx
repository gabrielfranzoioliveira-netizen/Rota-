import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <Link href="/" className={cn("focus-ring inline-flex items-center gap-3 rounded-md", className)}>
      <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/70 bg-white p-1 shadow-soft">
        <Image
          src="/rota-plus-logo.jpeg"
          alt="Logo Rota+"
          width={500}
          height={500}
          priority
          className="size-full rounded-lg object-cover"
        />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-lg font-bold tracking-normal">Rota+</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-current opacity-70">
            Acesso em movimento
          </span>
        </span>
      )}
    </Link>
  );
}
