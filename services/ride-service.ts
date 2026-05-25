import { favoriteLocations, mockDrivers, serviceTypes } from "@/data/mock";
import { createId, simulateRequest } from "@/services/mock-api";
import type { LocationPoint, Ride, ServiceTypeId, User } from "@/types";

export function calculateFare(serviceId: ServiceTypeId, distanceKm: number) {
  const service = serviceTypes.find((item) => item.id === serviceId) ?? serviceTypes[0];
  const perKm: Record<ServiceTypeId, number> = {
    economy: 1.15,
    comfort: 1.45,
    assist: 1.75,
    van: 2.35
  };
  const fare = service.basePrice + distanceKm * perKm[service.id];
  return Number(fare.toFixed(2));
}

export function estimateDistance(destination: LocationPoint) {
  const known = favoriteLocations.find((item) => item.address === destination.address);
  if (known?.label.includes("Hospital")) {
    return 3.1;
  }
  if (known?.label.includes("Shopping")) {
    return 2.4;
  }
  if (known?.label.includes("Parque")) {
    return 5.7;
  }
  return 4.2;
}

export async function createRideRequest(
  user: User,
  destination: LocationPoint,
  serviceId: ServiceTypeId
) {
  const service = serviceTypes.find((item) => item.id === serviceId) ?? serviceTypes[0];
  const distanceKm = estimateDistance(destination);
  const ride: Ride = {
    id: createId("ride"),
    passengerId: user.id,
    pickup: user.location,
    destination,
    serviceId,
    status: "searching",
    price: calculateFare(serviceId, distanceKm),
    etaMinutes: service.etaMinutes,
    distanceKm,
    createdAt: new Date().toISOString()
  };

  return simulateRequest(ride, { delay: 650 });
}

export function chooseDriver(serviceId: ServiceTypeId) {
  if (serviceId === "van") {
    return mockDrivers[2];
  }
  if (serviceId === "comfort") {
    return mockDrivers[1];
  }
  return mockDrivers[0];
}
