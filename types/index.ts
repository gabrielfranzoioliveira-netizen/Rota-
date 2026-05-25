export type UserRole = "passenger" | "driver" | "guardian" | "hospital";

export type AccessibilityRequirement = "yes" | "no" | "temporary";

export type AccessibilityNeed =
  | "wheelchair"
  | "wide_space"
  | "ramp"
  | "boarding_help"
  | "companion"
  | "visual_impairment"
  | "reduced_mobility";

export type RideStatus =
  | "idle"
  | "searching"
  | "accepted"
  | "arriving"
  | "boarding"
  | "in_progress"
  | "completed"
  | "cancelled";

export type RideFlowStep =
  | "choosing_destination"
  | "choosing_service"
  | "searching_driver"
  | "driver_found"
  | "arriving"
  | "boarding"
  | "in_progress"
  | "finalization";

export type ServiceTypeId = "economy" | "comfort" | "assist" | "van";

export type PaymentMethod = "pix" | "card" | "cash";

export interface LocationPoint {
  label: string;
  address: string;
  lat: number;
  lng: number;
}

export interface AccessibilityProfile {
  required: AccessibilityRequirement;
  needs: AccessibilityNeed[];
  verifiedPcd: boolean;
  verificationDocument?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  avatar: string;
  location: LocationPoint;
  emergencyContact?: EmergencyContact;
  accessibility: AccessibilityProfile;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  model: string;
  plate: string;
  color: string;
  year: number;
  features: AccessibilityNeed[];
  hasRamp: boolean;
  hasLift: boolean;
  wideDoor: boolean;
  hasWheelchair: boolean;
  safetyLock: boolean;
  inspectionStatus: "pending" | "approved" | "expired";
  photos: string[];
}

export interface Driver {
  id: string;
  userId: string;
  name: string;
  photo: string;
  rating: number;
  totalRides: number;
  trained: boolean;
  verified: boolean;
  accessibilityScore: number;
  vehicle: Vehicle;
  earningsToday: number;
  ranking: number;
}

export interface NearbyVehicle {
  id: string;
  driverId: string;
  x: number;
  y: number;
  etaMinutes: number;
  service: ServiceTypeId;
}

export interface ServiceType {
  id: ServiceTypeId;
  name: string;
  subtitle: string;
  description: string;
  basePrice: number;
  etaMinutes: number;
  comfort: number;
  capacity: string;
  features: string[];
}

export interface RideRating {
  accessibility: number;
  education: number;
  comfort: number;
  care: number;
  comment?: string;
}

export interface Ride {
  id: string;
  passengerId: string;
  pickup: LocationPoint;
  destination: LocationPoint;
  serviceId: ServiceTypeId;
  status: RideStatus;
  price: number;
  etaMinutes: number;
  distanceKm: number;
  driver?: Driver;
  createdAt: string;
  completedAt?: string;
  paymentMethod?: PaymentMethod;
  rating?: RideRating;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  progress: number;
  lessons: string[];
  completed: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: "ride" | "safety" | "system" | "benefit";
  read: boolean;
  createdAt: string;
}

export interface AccessiblePlace {
  id: string;
  name: string;
  category: "hospital" | "culture" | "food" | "service" | "transport";
  address: string;
  rating: number;
  distanceKm: number;
  features: AccessibilityNeed[];
  openNow: boolean;
}

export interface AccessibleRoute {
  id: string;
  title: string;
  origin: string;
  destination: string;
  distanceKm: number;
  curbCuts: number;
  elevators: number;
  surface: "regular" | "good" | "excellent";
  warnings: string[];
}

export interface CommunityPost {
  id: string;
  author: string;
  title: string;
  body: string;
  likes: number;
  tag: string;
}

export interface AccessibilityPreferences {
  fontScale: "normal" | "large" | "extra";
  highContrast: boolean;
  lowVisionMode: boolean;
  largeControls: boolean;
  voiceGuidance: boolean;
}
