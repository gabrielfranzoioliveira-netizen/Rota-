"use client";

import { useMemo, useState } from "react";
import {
  Accessibility,
  CarFront,
  Layers3,
  LocateFixed,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Radar,
  Route,
  ShieldCheck,
  TrafficCone
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useRideStore, nearbyVehicles, serviceTypes } from "@/context/ride-store";
import { cn } from "@/lib/utils";

interface FakeMapProps {
  compact?: boolean;
  className?: string;
  showMapChrome?: boolean;
  showStatusSheet?: boolean;
}

const cityBlocks = [
  { x: 6, y: 8, w: 22, h: 13, r: 4, tone: "soft" },
  { x: 34, y: 7, w: 18, h: 12, r: 4, tone: "white" },
  { x: 60, y: 8, w: 28, h: 15, r: 5, tone: "soft" },
  { x: 7, y: 29, w: 20, h: 16, r: 4, tone: "white" },
  { x: 35, y: 30, w: 18, h: 14, r: 4, tone: "park" },
  { x: 63, y: 31, w: 26, h: 13, r: 4, tone: "white" },
  { x: 8, y: 53, w: 23, h: 14, r: 4, tone: "soft" },
  { x: 38, y: 55, w: 20, h: 13, r: 4, tone: "white" },
  { x: 67, y: 56, w: 22, h: 16, r: 4, tone: "park" },
  { x: 10, y: 78, w: 28, h: 12, r: 5, tone: "white" },
  { x: 48, y: 78, w: 18, h: 12, r: 4, tone: "soft" },
  { x: 73, y: 79, w: 18, h: 12, r: 4, tone: "white" }
] as const;

const roadNetwork = [
  { d: "M -8 21 C 10 17, 22 30, 39 28 S 66 17, 108 24", width: 7.8, kind: "arterial" },
  { d: "M -5 47 C 15 43, 29 55, 45 53 S 68 39, 106 45", width: 7.2, kind: "arterial" },
  { d: "M -6 77 C 20 73, 34 89, 54 82 S 75 60, 108 67", width: 8, kind: "arterial" },
  { d: "M 16 -6 C 22 18, 17 35, 27 52 S 44 74, 35 108", width: 5.4, kind: "collector" },
  { d: "M 52 -6 C 48 16, 60 34, 56 51 S 49 79, 62 108", width: 5.2, kind: "collector" },
  { d: "M 84 -5 C 75 19, 89 36, 82 55 S 70 82, 86 108", width: 5.4, kind: "collector" },
  { d: "M -7 61 C 13 64, 26 70, 43 66 S 63 59, 108 58", width: 3.7, kind: "local" },
  { d: "M 1 36 C 22 40, 35 42, 50 37 S 75 30, 102 36", width: 3.6, kind: "local" },
  { d: "M 1 91 C 22 88, 36 96, 54 93 S 76 84, 103 89", width: 3.5, kind: "local" }
] as const;

const trafficSegments = [
  { d: "M 8 47 C 20 44, 31 53, 43 53", color: "#14b87a", width: 2.3 },
  { d: "M 43 53 C 55 52, 62 43, 75 42", color: "#f5a524", width: 2.3 },
  { d: "M 75 42 C 84 41, 93 44, 101 45", color: "#ef4444", width: 2.3 },
  { d: "M 12 77 C 25 75, 35 84, 48 84", color: "#14b87a", width: 2.4 },
  { d: "M 61 81 C 72 70, 81 64, 99 67", color: "#14b87a", width: 2.4 }
] as const;

const mapLabels = [
  { label: "Pinheiros", x: 10, y: 15 },
  { label: "Vila Madalena", x: 10, y: 57 },
  { label: "Reboucas", x: 67, y: 38 },
  { label: "Clinicas", x: 73, y: 17 },
  { label: "Av. Brasil", x: 35, y: 49, rotate: -8 },
  { label: "Rua Harmonia", x: 13, y: 74, rotate: -9 }
];

const accessiblePoints = [
  { label: "Rampa", x: 37, y: 43 },
  { label: "Elevador", x: 62, y: 55 },
  { label: "Embarque", x: 72, y: 30 }
];

const mapPois = [
  { label: "Hospital", x: 77, y: 20, color: "#ea4335" },
  { label: "Metro", x: 31, y: 50, color: "#1a73e8" },
  { label: "Parque", x: 74, y: 64, color: "#34a853" },
  { label: "Shopping", x: 58, y: 82, color: "#fbbc04" }
];

const driverAngles = [18, -12, 42, -28];

function blockFill(tone: (typeof cityBlocks)[number]["tone"]) {
  if (tone === "park") {
    return "#d7efd9";
  }
  if (tone === "soft") {
    return "#f1f3f4";
  }
  return "#ffffff";
}

export function FakeMap({
  compact = false,
  className,
  showMapChrome = true,
  showStatusSheet = true
}: FakeMapProps) {
  const [zoom, setZoom] = useState(1);
  const [showAccessLayer, setShowAccessLayer] = useState(true);
  const [showTrafficLayer, setShowTrafficLayer] = useState(true);
  const currentRide = useRideStore((state) => state.currentRide);
  const routeProgress = useRideStore((state) => state.routeProgress);
  const selectedServiceId = useRideStore((state) => state.selectedServiceId);
  const destination = useRideStore((state) => state.destination);
  const statusMessage = useRideStore((state) => state.statusMessage);
  const selectedService = serviceTypes.find((service) => service.id === selectedServiceId);
  const etaMinutes = currentRide?.etaMinutes ?? selectedService?.etaMinutes ?? 6;
  const routeCompletion = currentRide ? routeProgress : 42;
  const liveVehicle = useMemo(
    () => ({
      x: 13 + routeCompletion * 0.72,
      y: 75 - routeCompletion * 0.5 + Math.sin(routeCompletion / 9) * 4
    }),
    [routeCompletion]
  );

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[1.4rem] border-0 bg-[#f8fafd] shadow-premium dark:bg-[#0b2927]",
        compact ? "h-72" : "min-h-[34rem]",
        className
      )}
      aria-label="Mapa simulado Rota+"
    >
      <motion.div
        className="absolute inset-0 origin-center"
        animate={{ scale: zoom }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <div className="absolute inset-0 bg-[#f8fafd] dark:bg-[#0b2927]" />
        <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(60,64,67,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(60,64,67,0.045)_1px,transparent_1px)] [background-size:18px_18px]" />

        <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="routeDrop" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.4" stdDeviation="1.2" floodColor="#1a73e8" floodOpacity="0.34" />
            </filter>
            <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#174ea6" />
              <stop offset="55%" stopColor="#1a73e8" />
              <stop offset="100%" stopColor="#4285f4" />
            </linearGradient>
          </defs>

          {cityBlocks.map((block, index) => (
            <rect
              key={`${block.x}-${block.y}-${index}`}
              x={block.x}
              y={block.y}
              width={block.w}
              height={block.h}
              rx={block.r}
              fill={blockFill(block.tone)}
              stroke="rgba(0,89,84,0.06)"
              strokeWidth="0.4"
            />
          ))}

          <path
            d="M 89 0 C 95 16, 91 34, 97 49 S 96 82, 106 101 L 110 101 L 110 0 Z"
            fill="#d2e3fc"
          />

          {roadNetwork.map((road, index) => (
            <g key={`${road.d}-${index}`}>
              <path
                d={road.d}
                fill="none"
                stroke={road.kind === "arterial" ? "#fff8e1" : "#ffffff"}
                strokeLinecap="round"
                strokeWidth={road.width + 2.7}
              />
              <path
                d={road.d}
                fill="none"
                stroke={
                  road.kind === "arterial"
                    ? "#fdd663"
                    : road.kind === "collector"
                      ? "#ffffff"
                      : "#ffffff"
                }
                strokeLinecap="round"
                strokeWidth={road.width}
              />
              <path
                d={road.d}
                fill="none"
                stroke={road.kind === "arterial" ? "rgba(95,99,104,0.22)" : "rgba(95,99,104,0.16)"}
                strokeDasharray={road.kind === "local" ? "0" : "2 6"}
                strokeLinecap="round"
                strokeWidth="0.55"
              />
            </g>
          ))}

          {showTrafficLayer &&
            trafficSegments.map((segment) => (
              <path
                key={segment.d}
                d={segment.d}
                fill="none"
                stroke={segment.color}
                strokeLinecap="round"
                strokeWidth={segment.width}
              />
            ))}

          <path
            d="M 13 75 C 29 42, 45 83, 63 50 S 78 34, 86 25"
            fill="none"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeWidth="10.5"
          />
          <path
            d="M 13 75 C 29 42, 45 83, 63 50 S 78 34, 86 25"
            fill="none"
            stroke="rgba(26,115,232,0.16)"
            strokeLinecap="round"
            strokeWidth="8"
          />
          <motion.path
            d="M 13 75 C 29 42, 45 83, 63 50 S 78 34, 86 25"
            fill="none"
            filter="url(#routeDrop)"
            initial={false}
            animate={{ pathLength: Math.max(routeCompletion / 100, currentRide ? 0.08 : 0.44) }}
            stroke="url(#routeGradient)"
            strokeLinecap="round"
            strokeWidth="4.2"
            transition={{ duration: 0.65 }}
          />
          <path
            d="M 18 71 C 37 66, 47 57, 61 60 S 80 56, 92 37"
            fill="none"
            stroke="rgba(51,139,133,0.48)"
            strokeDasharray="2 3"
            strokeLinecap="round"
            strokeWidth="2"
          />

          {mapLabels.map((item) => (
            <text
              key={item.label}
              x={item.x}
              y={item.y}
              fill="rgba(95,99,104,0.76)"
              fontSize="3"
              fontWeight="700"
              letterSpacing="0"
              transform={item.rotate ? `rotate(${item.rotate} ${item.x} ${item.y})` : undefined}
            >
              {item.label}
            </text>
          ))}
        </svg>

        {mapPois.map((poi) => (
          <div
            key={poi.label}
            className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-[#5f6368] shadow-sm"
            style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
          >
            <span className="size-2 rounded-full" style={{ background: poi.color }} />
            {poi.label}
          </div>
        ))}

        {showAccessLayer &&
          accessiblePoints.map((point) => (
            <div
              key={point.label}
              className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border border-white/80 bg-white/94 px-2 py-1 text-[10px] font-bold text-[#188038] shadow-soft dark:border-white/10 dark:bg-card/90"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            >
              <Accessibility className="size-3" aria-hidden="true" />
              {point.label}
            </div>
          ))}

        <div className="absolute left-[13%] top-[75%] z-30 flex -translate-y-1/2 flex-col items-center gap-1">
          <div className="relative flex size-12 items-center justify-center rounded-full bg-[#1a73e8] text-white shadow-premium ring-4 ring-white/70">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#1a73e8]/24" />
            <Navigation className="size-5" aria-hidden="true" />
          </div>
          <span className="rounded-full bg-white/94 px-2 py-1 text-[11px] font-bold text-[#1a73e8] shadow-soft dark:bg-card">
            Voce
          </span>
        </div>

        <div className="absolute left-[86%] top-[25%] z-30 flex -translate-x-1/2 flex-col items-center gap-1">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#ea4335] text-white shadow-premium ring-4 ring-white/65">
            <MapPin className="size-5" aria-hidden="true" />
          </div>
          <span className="max-w-32 rounded-full bg-white/94 px-2 py-1 text-center text-[11px] font-bold text-[#5f6368] shadow-soft dark:bg-card">
            {destination.label}
          </span>
        </div>

        {nearbyVehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle.id}
            className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border border-white/80 bg-white/95 px-2 py-1.5 text-[#3c4043] shadow-soft ring-4 ring-white/30 dark:border-white/10 dark:bg-card/92"
            style={{ left: `${vehicle.x}%`, top: `${vehicle.y}%` }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: vehicle.etaMinutes / 10 }}
            title={`${vehicle.etaMinutes} min`}
          >
            <CarFront
              className="size-4"
              style={{ transform: `rotate(${driverAngles[index % driverAngles.length]}deg)` }}
              aria-hidden="true"
            />
            <span className="text-[10px] font-bold">{vehicle.etaMinutes}m</span>
          </motion.div>
        ))}

        {currentRide && currentRide.status !== "searching" && (
          <motion.div
            className="absolute z-40 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#1a73e8] text-white shadow-premium ring-4 ring-[#d2e3fc]"
            animate={{ left: `${liveVehicle.x}%`, top: `${liveVehicle.y}%` }}
            transition={{ type: "spring", stiffness: 70, damping: 18 }}
          >
            <CarFront className="size-5 -rotate-12" aria-hidden="true" />
          </motion.div>
        )}
      </motion.div>

      {showMapChrome && (
        <>
          <div className="absolute inset-x-4 top-4 z-50 rounded-3xl border border-white/75 bg-white/92 p-3 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-card/90">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a73e8]">
                  Rota+ Maps
                </p>
                <p className="mt-1 text-sm font-bold text-[#202124] dark:text-foreground">Pesquisar nesta area</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Badge variant="soft" className="gap-1">
                  <Radar className="size-3.5" aria-hidden="true" />
                  {nearbyVehicles.length}
                </Badge>
                <Badge variant="outline" className="bg-white/80 dark:bg-card/80">
                  {etaMinutes} min
                </Badge>
              </div>
            </div>
          </div>

          <div className="absolute right-4 top-24 z-50 grid gap-2">
            <button
              type="button"
              className="focus-ring flex size-10 items-center justify-center rounded-2xl border border-white/75 bg-white/92 text-brand-primary shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-card/90"
              aria-label="Aumentar zoom do mapa"
              onClick={() => setZoom((value) => Math.min(1.12, Number((value + 0.04).toFixed(2))))}
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="focus-ring flex size-10 items-center justify-center rounded-2xl border border-white/75 bg-white/92 text-brand-primary shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-card/90"
              aria-label="Diminuir zoom do mapa"
              onClick={() => setZoom((value) => Math.max(0.94, Number((value - 0.04).toFixed(2))))}
            >
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="focus-ring flex size-10 items-center justify-center rounded-2xl border border-white/75 bg-white/92 text-brand-primary shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-card/90"
              aria-label="Centralizar minha localizacao"
              onClick={() => setZoom(1)}
            >
              <LocateFixed className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="absolute left-4 top-24 z-50 grid gap-2">
            <button
              type="button"
              className={cn(
                "focus-ring flex items-center gap-2 rounded-2xl border px-3 py-2 text-[11px] font-bold shadow-soft backdrop-blur-xl",
                showAccessLayer
                  ? "border-[#d2e3fc] bg-[#1a73e8] text-white"
                  : "border-white/75 bg-white/92 text-brand-primary dark:border-white/10 dark:bg-card/90"
              )}
              onClick={() => setShowAccessLayer((value) => !value)}
            >
              <Layers3 className="size-3.5" aria-hidden="true" />
              Acesso
            </button>
            <button
              type="button"
              className={cn(
                "focus-ring flex items-center gap-2 rounded-2xl border px-3 py-2 text-[11px] font-bold shadow-soft backdrop-blur-xl",
                showTrafficLayer
                  ? "border-emerald-200 bg-white/95 text-[#188038]"
                  : "border-white/75 bg-white/80 text-muted-foreground dark:border-white/10 dark:bg-card/90"
              )}
              onClick={() => setShowTrafficLayer((value) => !value)}
            >
              <TrafficCone className="size-3.5" aria-hidden="true" />
              Transito
            </button>
          </div>
        </>
      )}

      {showStatusSheet && (
        <div className="absolute inset-x-4 bottom-4 z-50 rounded-[1.4rem] border border-white/75 bg-white/94 p-4 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-card/94">
          <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[#dadce0]" />
          <div className="grid gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge variant="success">{Math.round(routeCompletion)}% rota</Badge>
                  <Badge variant="soft">{selectedService?.name}</Badge>
                </div>
                <p className="flex items-center gap-2 text-sm font-bold text-[#202124] dark:text-foreground">
                  <Route className="size-4 text-[#1a73e8]" aria-hidden="true" />
                  {statusMessage}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Via mais acessivel, com embarque validado e transito monitorado.
                </p>
              </div>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#e8f0fe] text-[#1a73e8]">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </div>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-[#1a73e8]"
                animate={{ width: `${Math.max(routeCompletion, 12)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-muted/55 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">ETA</p>
                <p className="mt-1 text-sm font-bold">{etaMinutes} min</p>
              </div>
              <div className="rounded-2xl bg-muted/55 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Acesso</p>
                <p className="mt-1 text-sm font-bold">98%</p>
              </div>
              <div className="rounded-2xl bg-muted/55 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Zoom</p>
                <p className="mt-1 text-sm font-bold">{Math.round(zoom * 100)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
