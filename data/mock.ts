import type {
  AccessibilityNeed,
  AccessiblePlace,
  AccessibleRoute,
  CommunityPost,
  Driver,
  LocationPoint,
  NearbyVehicle,
  NotificationItem,
  Ride,
  ServiceType,
  TrainingModule,
  User
} from "@/types";

export const ROLE_LABELS = {
  passenger: "Passageiro",
  driver: "Motorista",
  guardian: "Responsavel",
  hospital: "Hospital"
} as const;

export const currentLocation: LocationPoint = {
  label: "Casa",
  address: "Rua Harmonia, 248 - Vila Madalena, Sao Paulo",
  lat: -23.5558,
  lng: -46.6909
};

export const favoriteLocations: LocationPoint[] = [
  {
    label: "Hospital das Clinicas",
    address: "Av. Dr. Eneas Carvalho de Aguiar, 255",
    lat: -23.5574,
    lng: -46.6697
  },
  {
    label: "Shopping Eldorado",
    address: "Av. Reboucas, 3970",
    lat: -23.5726,
    lng: -46.6964
  },
  {
    label: "Parque Ibirapuera",
    address: "Av. Pedro Alvares Cabral, s/n",
    lat: -23.5874,
    lng: -46.6576
  }
];

export const accessibilityOptions: Array<{
  id: AccessibilityNeed;
  label: string;
  description: string;
}> = [
  {
    id: "wheelchair",
    label: "Cadeira de rodas",
    description: "Veiculo preparado para cadeira de rodas"
  },
  {
    id: "wide_space",
    label: "Espaco ampliado",
    description: "Mais area para pernas, mochila ou equipamentos"
  },
  {
    id: "ramp",
    label: "Rampa",
    description: "Embarque com rampa segura e vistoriada"
  },
  {
    id: "boarding_help",
    label: "Ajuda no embarque",
    description: "Motorista treinado para auxiliar com cuidado"
  },
  {
    id: "companion",
    label: "Acompanhante",
    description: "Assento reservado para cuidador ou familiar"
  },
  {
    id: "visual_impairment",
    label: "Deficiencia visual",
    description: "Orientacao por voz e apoio ate o destino"
  },
  {
    id: "reduced_mobility",
    label: "Mobilidade reduzida",
    description: "Embarque com mais tempo e trajetos acessiveis"
  }
];

export const mockUsers: User[] = [
  {
    id: "usr_passenger_1",
    name: "Ana Beatriz Lima",
    email: "ana@rota.plus.demo",
    phone: "+55 11 98888-1020",
    password: "demo1234",
    role: "passenger",
    avatar: "AB",
    location: currentLocation,
    emergencyContact: {
      name: "Marcos Lima",
      phone: "+55 11 97777-4500",
      relation: "Irmao"
    },
    accessibility: {
      required: "yes",
      needs: ["wheelchair", "ramp", "boarding_help", "companion"],
      verifiedPcd: true,
      verificationDocument: "laudo-ana.pdf"
    },
    createdAt: "2026-01-08T10:00:00.000Z"
  },
  {
    id: "usr_driver_1",
    name: "Carlos Henrique Souza",
    email: "carlos@rota.plus.demo",
    phone: "+55 11 96666-8811",
    password: "demo1234",
    role: "driver",
    avatar: "CS",
    location: {
      label: "Base Rota+ Pinheiros",
      address: "Rua dos Pinheiros, 870",
      lat: -23.5661,
      lng: -46.6823
    },
    accessibility: {
      required: "no",
      needs: [],
      verifiedPcd: false
    },
    createdAt: "2026-01-12T10:00:00.000Z"
  },
  {
    id: "usr_guardian_1",
    name: "Marina Costa",
    email: "marina@rota.plus.demo",
    phone: "+55 11 95555-1090",
    password: "demo1234",
    role: "guardian",
    avatar: "MC",
    location: {
      label: "Trabalho",
      address: "Av. Paulista, 1000",
      lat: -23.5644,
      lng: -46.6521
    },
    accessibility: {
      required: "no",
      needs: [],
      verifiedPcd: false
    },
    createdAt: "2026-02-01T10:00:00.000Z"
  },
  {
    id: "usr_hospital_1",
    name: "Instituto Vida Plena",
    email: "hospital@rota.plus.demo",
    phone: "+55 11 3333-9000",
    password: "demo1234",
    role: "hospital",
    avatar: "IV",
    location: {
      label: "Recepcao principal",
      address: "Rua Itapeva, 500",
      lat: -23.5632,
      lng: -46.6508
    },
    accessibility: {
      required: "no",
      needs: ["boarding_help", "reduced_mobility"],
      verifiedPcd: false
    },
    createdAt: "2026-02-10T10:00:00.000Z"
  }
];

export const serviceTypes: ServiceType[] = [
  {
    id: "economy",
    name: "Economico acessivel",
    subtitle: "Tarifa social acessivel",
    description: "Carros adaptados para viagens rapidas com preco popular.",
    basePrice: 8,
    etaMinutes: 5,
    comfort: 4,
    capacity: "1 passageiro + acompanhante",
    features: ["Tarifa social", "Rampa portatil", "Motorista treinado"]
  },
  {
    id: "comfort",
    name: "Comfort PCD",
    subtitle: "Mais espaco e conforto",
    description: "Veiculos maiores com embarque assistido por preco controlado.",
    basePrice: 12,
    etaMinutes: 7,
    comfort: 5,
    capacity: "1 cadeira + 2 acompanhantes",
    features: ["Preco reduzido", "Porta ampla", "Espaco ampliado"]
  },
  {
    id: "assist",
    name: "Assist+",
    subtitle: "Cuidado especializado",
    description: "Motoristas com treinamento avancado sem tarifa proibitiva.",
    basePrice: 16,
    etaMinutes: 8,
    comfort: 5,
    capacity: "Cadeira, acompanhante e equipamentos",
    features: ["Ajuda no embarque", "Tarifa inclusiva", "Contato emergencia"]
  },
  {
    id: "van",
    name: "Van acessivel",
    subtitle: "Para grupos e hospitais",
    description: "Van adaptada para cadeiras, elevador e travas com preco compartilhavel.",
    basePrice: 24,
    etaMinutes: 12,
    comfort: 5,
    capacity: "Ate 2 cadeiras + 4 pessoas",
    features: ["Preco compartilhado", "Elevador", "Travas de seguranca"]
  }
];

export const mockDrivers: Driver[] = [
  {
    id: "drv_1",
    userId: "usr_driver_1",
    name: "Carlos Henrique",
    photo: "CH",
    rating: 4.96,
    totalRides: 1284,
    trained: true,
    verified: true,
    accessibilityScore: 98,
    earningsToday: 142.4,
    ranking: 3,
    vehicle: {
      id: "veh_1",
      model: "Spin Adaptada",
      plate: "ACG-4A21",
      color: "Prata",
      year: 2025,
      features: ["wheelchair", "ramp", "boarding_help", "companion"],
      hasRamp: true,
      hasLift: false,
      wideDoor: true,
      hasWheelchair: false,
      safetyLock: true,
      inspectionStatus: "approved",
      photos: ["spin-frente.jpg", "rampa-lateral.jpg"]
    }
  },
  {
    id: "drv_2",
    userId: "usr_driver_2",
    name: "Patricia Nogueira",
    photo: "PN",
    rating: 4.91,
    totalRides: 918,
    trained: true,
    verified: true,
    accessibilityScore: 95,
    earningsToday: 118.8,
    ranking: 8,
    vehicle: {
      id: "veh_2",
      model: "Doblo Mobility",
      plate: "PCD-8J90",
      color: "Branco",
      year: 2024,
      features: ["wheelchair", "wide_space", "ramp", "visual_impairment"],
      hasRamp: true,
      hasLift: false,
      wideDoor: true,
      hasWheelchair: true,
      safetyLock: true,
      inspectionStatus: "approved",
      photos: ["doblo-cabine.jpg", "trava-seguranca.jpg"]
    }
  },
  {
    id: "drv_3",
    userId: "usr_driver_3",
    name: "Renato Alves",
    photo: "RA",
    rating: 4.88,
    totalRides: 743,
    trained: true,
    verified: true,
    accessibilityScore: 93,
    earningsToday: 104.2,
    ranking: 12,
    vehicle: {
      id: "veh_3",
      model: "Master Elevadora",
      plate: "VAN-2D56",
      color: "Azul petroleo",
      year: 2025,
      features: ["wheelchair", "wide_space", "boarding_help", "companion"],
      hasRamp: false,
      hasLift: true,
      wideDoor: true,
      hasWheelchair: true,
      safetyLock: true,
      inspectionStatus: "approved",
      photos: ["master-elevador.jpg", "cabine-ampla.jpg"]
    }
  }
];

export const nearbyVehicles: NearbyVehicle[] = [
  { id: "near_1", driverId: "drv_1", x: 22, y: 32, etaMinutes: 5, service: "economy" },
  { id: "near_2", driverId: "drv_2", x: 74, y: 26, etaMinutes: 7, service: "comfort" },
  { id: "near_3", driverId: "drv_3", x: 64, y: 74, etaMinutes: 12, service: "van" },
  { id: "near_4", driverId: "drv_1", x: 34, y: 72, etaMinutes: 8, service: "assist" }
];

export const trainingModules: TrainingModule[] = [
  {
    id: "training_1",
    title: "Como auxiliar cadeirantes",
    description: "Tecnicas de abordagem, comunicacao e embarque com autonomia.",
    durationMinutes: 18,
    progress: 72,
    lessons: ["Perguntar antes de ajudar", "Travamento seguro", "Rampa e inclinacao"],
    completed: false
  },
  {
    id: "training_2",
    title: "Inclusao e respeito",
    description: "Conduta, linguagem inclusiva e atendimento sem infantilizacao.",
    durationMinutes: 14,
    progress: 100,
    lessons: ["Escuta ativa", "Privacidade", "Autonomia do passageiro"],
    completed: true
  },
  {
    id: "training_3",
    title: "Seguranca no trajeto",
    description: "Protocolos de rota, parada, emergencia e compartilhamento.",
    durationMinutes: 21,
    progress: 44,
    lessons: ["Checklist do veiculo", "Rota acessivel", "SOS e suporte"],
    completed: false
  },
  {
    id: "training_4",
    title: "Primeiros socorros",
    description: "Acoes iniciais em mal-estar, queda, dor e situacoes de risco.",
    durationMinutes: 26,
    progress: 36,
    lessons: ["Avaliar ambiente", "Acionar suporte", "Registrar ocorrencia"],
    completed: false
  }
];

export const notifications: NotificationItem[] = [
  {
    id: "not_1",
    title: "Selo PCD verificado ativo",
    body: "Sua prioridade e suporte premium estao liberados para proximas viagens.",
    type: "benefit",
    read: false,
    createdAt: "2026-05-24T09:25:00.000Z"
  },
  {
    id: "not_2",
    title: "Motorista treinado proximo",
    body: "Ha 4 veiculos acessiveis a menos de 8 minutos da sua localizacao.",
    type: "ride",
    read: false,
    createdAt: "2026-05-24T09:42:00.000Z"
  },
  {
    id: "not_3",
    title: "Checklist de seguranca atualizado",
    body: "Todos os veiculos Comfort PCD agora exibem vistoria no app.",
    type: "system",
    read: true,
    createdAt: "2026-05-23T16:10:00.000Z"
  }
];

export const accessiblePlaces: AccessiblePlace[] = [
  {
    id: "place_1",
    name: "Hospital das Clinicas",
    category: "hospital",
    address: "Av. Dr. Eneas Carvalho de Aguiar, 255",
    rating: 4.8,
    distanceKm: 2.6,
    features: ["ramp", "wide_space", "boarding_help", "visual_impairment"],
    openNow: true
  },
  {
    id: "place_2",
    name: "Sesc Pompeia",
    category: "culture",
    address: "Rua Clelia, 93",
    rating: 4.7,
    distanceKm: 4.1,
    features: ["ramp", "wide_space", "companion"],
    openNow: true
  },
  {
    id: "place_3",
    name: "Estacao Pinheiros",
    category: "transport",
    address: "Largo da Batata",
    rating: 4.4,
    distanceKm: 1.4,
    features: ["wide_space", "visual_impairment", "reduced_mobility"],
    openNow: true
  },
  {
    id: "place_4",
    name: "Bistro Aurora",
    category: "food",
    address: "Rua Fradique Coutinho, 1120",
    rating: 4.6,
    distanceKm: 1.8,
    features: ["ramp", "wide_space"],
    openNow: false
  }
];

export const accessibleRoutes: AccessibleRoute[] = [
  {
    id: "route_1",
    title: "Vila Madalena ate Hospital das Clinicas",
    origin: "Rua Harmonia",
    destination: "Hospital das Clinicas",
    distanceKm: 2.9,
    curbCuts: 14,
    elevators: 2,
    surface: "good",
    warnings: ["Calcada estreita por 80m na Rua Oscar Freire"]
  },
  {
    id: "route_2",
    title: "Pinheiros ate Shopping Eldorado",
    origin: "Largo da Batata",
    destination: "Shopping Eldorado",
    distanceKm: 1.7,
    curbCuts: 9,
    elevators: 1,
    surface: "excellent",
    warnings: ["Movimento intenso entre 18h e 19h"]
  },
  {
    id: "route_3",
    title: "Paulista cultural acessivel",
    origin: "Masp",
    destination: "Japan House",
    distanceKm: 1.2,
    curbCuts: 11,
    elevators: 3,
    surface: "excellent",
    warnings: ["Evento publico pode alterar pontos de embarque"]
  }
];

export const rideHistory: Ride[] = [
  {
    id: "ride_hist_1",
    passengerId: "usr_passenger_1",
    pickup: currentLocation,
    destination: favoriteLocations[0],
    serviceId: "assist",
    status: "completed",
    price: 22.9,
    etaMinutes: 0,
    distanceKm: 3.1,
    driver: mockDrivers[0],
    createdAt: "2026-05-22T15:05:00.000Z",
    completedAt: "2026-05-22T15:31:00.000Z",
    paymentMethod: "pix",
    rating: {
      accessibility: 5,
      education: 5,
      comfort: 5,
      care: 5,
      comment: "Embarque respeitoso e muito seguro."
    }
  },
  {
    id: "ride_hist_2",
    passengerId: "usr_passenger_1",
    pickup: favoriteLocations[1],
    destination: currentLocation,
    serviceId: "comfort",
    status: "completed",
    price: 16.5,
    etaMinutes: 0,
    distanceKm: 2.4,
    driver: mockDrivers[1],
    createdAt: "2026-05-18T19:20:00.000Z",
    completedAt: "2026-05-18T19:48:00.000Z",
    paymentMethod: "card",
    rating: {
      accessibility: 5,
      education: 4,
      comfort: 5,
      care: 5
    }
  }
];

export const communityPosts: CommunityPost[] = [
  {
    id: "post_1",
    author: "Ana Beatriz",
    title: "Rota tranquila para consulta no HC",
    body: "A rota pela Rua Teodoro Sampaio estava com calcadas boas hoje e ponto de embarque amplo.",
    likes: 84,
    tag: "Rotas acessiveis"
  },
  {
    id: "post_2",
    author: "Equipe Rota+",
    title: "Checklist para viajar com acompanhante",
    body: "Confirme destino, contato de emergencia e necessidade de ajuda no embarque antes de solicitar.",
    likes: 132,
    tag: "Seguranca"
  }
];

export const hospitalTransfers = [
  {
    id: "transfer_1",
    patient: "Roberto M.",
    pickup: "Instituto Vida Plena",
    destination: "Clinica Reabilitar",
    time: "14:30",
    need: "Van com elevador",
    status: "Agendado"
  },
  {
    id: "transfer_2",
    patient: "Helena F.",
    pickup: "Recepcao principal",
    destination: "Residencial Jardins",
    time: "16:10",
    need: "Assist+ com acompanhante",
    status: "Motorista confirmado"
  }
];
