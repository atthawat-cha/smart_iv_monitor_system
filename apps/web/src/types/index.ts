// Shared frontend types — mirror the Prisma entities in apps/api/prisma/schema.prisma
// (014 Database/Database.md). Keep field names/casing in sync with the API responses.

export type BedStatus = "vacant" | "occupied" | "offline";
export type DeviceStatus = "online" | "offline" | "low_battery";
export type AlertType = "critical_low" | "empty" | "device_offline" | "occlusion_suspected";

export interface Ward {
  id: string;
  name: string;
  floor: string;
}

export interface Bed {
  id: string;
  wardId: string;
  deviceId: string | null;
  patientHn: string | null;
  status: BedStatus;
}

export interface IvStatus {
  bedId: string;
  remainingMl: number;
  remainingPercent: number;
  flowRate: number;
  estimatedEmptyAt: string | null;
  priorityScore: number;
  isMobilityMode: boolean;
}

export interface Alert {
  id: string;
  bedId: string;
  type: AlertType;
  isRead: boolean;
  resolvedAt: string | null;
  createdAt: string;
}
