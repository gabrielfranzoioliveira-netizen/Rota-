"use client";

import { Mic, Radio, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/context/ui-store";

const commands = [
  "Solicitar Assist+",
  "Compartilhar viagem",
  "Acionar suporte",
  "Mostrar locais acessiveis"
];

export function VoiceCommandDock() {
  const voiceEnabled = useUiStore((state) => state.voiceEnabled);
  const lastVoiceCommand = useUiStore((state) => state.lastVoiceCommand);
  const toggleVoice = useUiStore((state) => state.toggleVoice);
  const setVoiceCommand = useUiStore((state) => state.setVoiceCommand);

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {voiceEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="w-[min(22rem,calc(100vw-2rem))] rounded-lg border bg-card p-4 shadow-premium"
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Radio className="size-4 text-brand-secondary" aria-hidden="true" />
              Comandos por voz simulados
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {commands.map((command) => (
                <Button
                  key={command}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setVoiceCommand(command)}
                  className="justify-start"
                >
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  {command}
                </Button>
              ))}
            </div>
            {lastVoiceCommand && (
              <p className="mt-3 rounded-md bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
                Ultimo comando: {lastVoiceCommand}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        type="button"
        size="icon"
        variant={voiceEnabled ? "secondary" : "default"}
        onClick={toggleVoice}
        aria-label={voiceEnabled ? "Pausar comandos por voz" : "Ativar comandos por voz"}
        title={voiceEnabled ? "Pausar comandos por voz" : "Ativar comandos por voz"}
        className="rounded-full"
      >
        <Mic className="size-5" aria-hidden="true" />
      </Button>
    </div>
  );
}
