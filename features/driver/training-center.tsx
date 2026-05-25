"use client";

import { useMemo, useState } from "react";
import { Award, BookOpenCheck, CheckCircle2, GraduationCap, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trainingModules } from "@/data/mock";
import type { TrainingModule } from "@/types";

export function TrainingCenter() {
  const [modules, setModules] = useState<TrainingModule[]>(trainingModules);
  const [certificateId, setCertificateId] = useState("");
  const averageProgress = useMemo(
    () => Math.round(modules.reduce((sum, module) => sum + module.progress, 0) / modules.length),
    [modules]
  );
  const certificateUnlocked = modules.every((module) => module.completed);

  const advanceModule = (id: string) => {
    setModules((current) =>
      current.map((module) => {
        if (module.id !== id) {
          return module;
        }
        const progress = Math.min(100, module.progress + 28);
        return {
          ...module,
          progress,
          completed: progress === 100
        };
      })
    );
  };

  const generateCertificate = () => {
    setCertificateId(`ACG-CERT-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Treinamento acessivel</CardTitle>
            <CardDescription>Mini aulas reais para liberar selo e aumentar prioridade de chamadas.</CardDescription>
          </div>
          <Badge variant={certificateUnlocked ? "success" : "soft"}>{averageProgress}% concluido</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <Progress value={averageProgress} />
        <div className="grid gap-3 md:grid-cols-2">
          {modules.map((module) => (
            <div key={module.id} className="rounded-lg border bg-white/72 p-4 dark:bg-white/5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-soft/60 text-brand-primary">
                    <BookOpenCheck className="size-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-bold">{module.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{module.description}</p>
                  </div>
                </div>
                {module.completed && <CheckCircle2 className="size-5 shrink-0 text-emerald-600" aria-hidden="true" />}
              </div>
              <div className="mt-4">
                <Progress value={module.progress} />
                <div className="mt-3 flex flex-wrap gap-2">
                  {module.lessons.map((lesson) => (
                    <Badge key={lesson} variant="soft">
                      {lesson}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                type="button"
                variant={module.completed ? "outline" : "default"}
                size="sm"
                className="mt-4"
                onClick={() => advanceModule(module.id)}
                disabled={module.completed}
              >
                <PlayCircle className="size-4" aria-hidden="true" />
                {module.completed ? "Aula concluida" : "Concluir aula"}
              </Button>
            </div>
          ))}
        </div>

        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="size-6" aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold">Certificado Rota+ Care</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Liberado quando todas as aulas chegam a 100%.
                </p>
                {certificateId && <p className="mt-2 text-sm font-semibold text-brand-primary">{certificateId}</p>}
              </div>
            </div>
            <Button type="button" onClick={generateCertificate} disabled={!certificateUnlocked}>
              <Award className="size-4" aria-hidden="true" />
              Gerar certificado
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
