import { currentLocation } from "@/data/mock";
import { createId, simulateRequest } from "@/services/mock-api";
import type {
  AccessibilityRequirement,
  EmergencyContact,
  User,
  UserRole
} from "@/types";

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  location: string;
  accessibilityRequired: AccessibilityRequirement;
  emergencyContact?: EmergencyContact;
}

export async function authenticateUser(users: User[], email: string, password: string) {
  const user = users.find(
    (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
  );

  return simulateRequest(user ?? null, {
    delay: 650,
    errorMessage: "Credenciais invalidas."
  });
}

export async function createUser(users: User[], payload: RegisterPayload) {
  const exists = users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase());

  if (exists) {
    await simulateRequest(null, { delay: 350 });
    throw new Error("Este email ja esta cadastrado.");
  }

  const initials = payload.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const user: User = {
    id: createId("usr"),
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
    role: payload.role,
    avatar: initials || "AG",
    location: {
      ...currentLocation,
      label: payload.location || "Minha localizacao",
      address: payload.location || currentLocation.address
    },
    emergencyContact: payload.emergencyContact,
    accessibility: {
      required: payload.accessibilityRequired,
      needs: [],
      verifiedPcd: false
    },
    createdAt: new Date().toISOString()
  };

  return simulateRequest(user, { delay: 720 });
}

export async function recoverPassword(email: string) {
  return simulateRequest(
    {
      email,
      message:
        "Enviamos uma simulacao de recuperacao para seu email. Use demo1234 nos perfis de teste."
    },
    { delay: 700 }
  );
}
