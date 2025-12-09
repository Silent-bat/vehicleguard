export type CaseStatus = "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "UNDER_INVESTIGATION" | "RECOVERED" | "ABANDONED"
export type VehicleStatus = "ACTIVE" | "STOLEN" | "RECOVERED" | "INACTIVE"
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"
export type UserRole = "USER" | "ADMIN"

export interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface Vehicle {
  id: string
  brand: string
  model: string
  licensePlate: string
  year: number
  color: string
  vin?: string | null
  registeredById: string
  registeredBy?: User
  status: VehicleStatus
  department?: string | null
  assignedDriver?: string | null
  insuranceNumber?: string | null
  insuranceExpiry?: Date | null
  createdAt: Date
  updatedAt: Date
  theftCases?: TheftCase[]
}

export interface TheftCase {
  id: string
  caseNumber: string
  vehicleId: string
  vehicle?: Vehicle
  reportedById: string
  reportedBy?: User
  theftDate: Date
  theftTime: string
  location: string
  locationDetails?: string | null
  description: string
  driverName: string | null
  driverContact: string | null
  driverLicense?: string | null
  status: CaseStatus
  priority: Priority
  assignedTo?: string | null
  recoveredDate?: Date | null
  recoveryLocation?: string | null
  vehicleCondition?: string | null
  policeReportNumber?: string | null
  policeDepartment?: string | null
  investigatingOfficer?: string | null
  actionsTaken: string | null
  createdAt: Date
  updatedAt: Date
}

export interface AdminStats {
  totalVehicles: number
  totalThefts: number
  activeThefts: number
  resolvedThefts: number
  closedThefts: number
  underInvestigation: number
  resolutionRate: number
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: "vehicle_added" | "theft_reported" | "case_updated" | "case_resolved"
  description: string
  timestamp: Date
}

export interface DashboardStats {
  totalVehicles: number
  totalThefts: number
  activeThefts: number
  resolvedThefts: number
  theftsByMonth: { month: string; count: number }[]
  theftsByBrand: { brand: string; count: number }[]
  theftsByLocation: { location: string; count: number }[]
}
