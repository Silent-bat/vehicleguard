-- Create enum for case status
CREATE TYPE "CaseStatus" AS ENUM ('IN_PROGRESS', 'RESOLVED', 'CLOSED', 'UNDER_INVESTIGATION');

-- Create vehicles table
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- Create theft_cases table
CREATE TABLE "theft_cases" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "theftDate" TIMESTAMP(3) NOT NULL,
    "theftTime" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "driverName" TEXT,
    "driverContact" TEXT,
    "status" "CaseStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "actionsToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "theft_cases_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint on license plate
CREATE UNIQUE INDEX "vehicles_licensePlate_key" ON "vehicles"("licensePlate");

-- Create foreign key constraint
ALTER TABLE "theft_cases" ADD CONSTRAINT "theft_cases_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
