"use client";

import { ChangeEvent, useState } from "react";
import { Camera, CarFront, CheckCircle2, ClipboardCheck, FileBadge, ShieldCheck, Upload, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs } from "@/components/ui/tabs";
import { TrainingCenter } from "@/features/driver/training-center";

type Step = "profile" | "vehicle" | "training";

const vehicleChecks = [
  ["hasRamp", "Rampa"],
  ["hasLift", "Elevador"],
  ["wideDoor", "Porta ampla"],
  ["hasWheelchair", "Cadeira"],
  ["safetyLock", "Trava de seguranca"]
] as const;

export function DriverOnboarding({ publicMode = false }: { publicMode?: boolean }) {
  const [step, setStep] = useState<Step>("profile");
  const [files, setFiles] = useState<string[]>([]);
  const [profile, setProfile] = useState({
    name: "Carlos Henrique Souza",
    cnh: "05234567890",
    document: "123.456.789-00",
    photo: "",
    address: "Rua dos Pinheiros, 870",
    background: "Antecedentes sem apontamentos"
  });
  const [vehicle, setVehicle] = useState({
    model: "Spin Adaptada",
    plate: "ACG-4A21",
    hasRamp: true,
    hasLift: false,
    wideDoor: true,
    hasWheelchair: false,
    safetyLock: true
  });

  const completed = [
    profile.name && profile.cnh && profile.document && profile.address,
    vehicle.model && vehicle.plate && Object.entries(vehicle).some(([key, value]) => key !== "model" && key !== "plate" && value === true),
    files.length >= 2
  ].filter(Boolean).length;

  const progress = Math.round((completed / 3) * 100);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const names = Array.from(event.target.files ?? []).map((file) => file.name);
    setFiles((current) => [...names, ...current].slice(0, 6));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Onboarding do motorista</CardTitle>
            <CardDescription>
              Cadastro, veiculo acessivel, documentos, vistoria e treinamento em um unico fluxo.
            </CardDescription>
          </div>
          <Badge variant={progress === 100 ? "success" : "soft"}>{progress}% aprovado</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <Progress value={progress} />
        <Tabs
          value={step}
          onValueChange={setStep}
          items={[
            { value: "profile", label: "Cadastro" },
            { value: "vehicle", label: "Veiculo" },
            { value: "training", label: "Treinamento" }
          ]}
          className="w-full justify-center"
        />

        {step === "profile" && (
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="driver-name">Nome</Label>
                <Input id="driver-name" value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="driver-cnh">CNH</Label>
                <Input id="driver-cnh" value={profile.cnh} onChange={(event) => setProfile((current) => ({ ...current, cnh: event.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="driver-document">Documento</Label>
                <Input id="driver-document" value={profile.document} onChange={(event) => setProfile((current) => ({ ...current, document: event.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="driver-address">Endereco</Label>
                <Input id="driver-address" value={profile.address} onChange={(event) => setProfile((current) => ({ ...current, address: event.target.value }))} />
              </div>
            </div>
            <div className="grid gap-3 rounded-lg border bg-muted/40 p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="size-4 text-brand-secondary" aria-hidden="true" />
                  Antecedentes e foto
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{profile.background}</p>
              </div>
              <div>
                <input id="driver-files" type="file" multiple className="sr-only" onChange={handleFile} />
                <Button asChild variant="outline">
                  <label htmlFor="driver-files" className="cursor-pointer">
                    <Camera className="size-4" aria-hidden="true" />
                    Upload mock
                  </label>
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === "vehicle" && (
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="vehicle-model">Modelo</Label>
                <Input id="vehicle-model" value={vehicle.model} onChange={(event) => setVehicle((current) => ({ ...current, model: event.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vehicle-plate">Placa</Label>
                <Input id="vehicle-plate" value={vehicle.plate} onChange={(event) => setVehicle((current) => ({ ...current, plate: event.target.value }))} />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {vehicleChecks.map(([key, label]) => (
                <div key={key} className="flex items-center justify-between rounded-lg border bg-white/70 p-4 dark:bg-white/5">
                  <div className="flex items-center gap-3">
                    <CarFront className="size-5 text-brand-secondary" aria-hidden="true" />
                    <span className="font-semibold">{label}</span>
                  </div>
                  <Switch
                    checked={Boolean(vehicle[key])}
                    onCheckedChange={(checked) => setVehicle((current) => ({ ...current, [key]: checked }))}
                  />
                </div>
              ))}
            </div>
            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="mb-3 flex items-center gap-2 font-semibold">
                <FileBadge className="size-4 text-brand-secondary" aria-hidden="true" />
                Fotos, documentos e vistoria
              </p>
              <input id="vehicle-files" type="file" multiple className="sr-only" onChange={handleFile} />
              <Button asChild>
                <label htmlFor="vehicle-files" className="cursor-pointer">
                  <Upload className="size-4" aria-hidden="true" />
                  Enviar arquivos
                </label>
              </Button>
              <div className="mt-3 flex flex-wrap gap-2">
                {files.map((file) => (
                  <Badge key={file} variant="soft">
                    {file}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === "training" && <TrainingCenter />}

        <div className="flex flex-col gap-3 rounded-lg border bg-primary p-4 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-white/15">
              {progress === 100 ? <CheckCircle2 className="size-5" /> : <ClipboardCheck className="size-5" />}
            </div>
            <div>
              <p className="font-bold">{progress === 100 ? "Selo motorista acessivel liberado" : "Checklist em andamento"}</p>
              <p className="text-sm text-primary-foreground/72">
                {publicMode ? "Ao criar conta, estes dados demonstram a jornada completa." : "Dados salvos localmente nesta demonstracao."}
              </p>
            </div>
          </div>
          <Button type="button" variant="outline" className="bg-white/10 text-primary-foreground hover:bg-white/15">
            <UserRound className="size-4" aria-hidden="true" />
            Salvar etapa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
