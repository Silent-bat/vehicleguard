-- Insert sample vehicles
INSERT INTO "vehicles" ("id", "brand", "model", "licensePlate", "year", "color", "createdAt", "updatedAt") VALUES
('v1', 'Toyota', 'Camry', 'ABC-1234', 2020, 'Blanc', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('v2', 'Honda', 'Civic', 'XYZ-5678', 2021, 'Noir', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('v3', 'Ford', 'Transit', 'DEF-9012', 2019, 'Bleu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('v4', 'Mercedes', 'Sprinter', 'GHI-3456', 2022, 'Gris', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('v5', 'Renault', 'Kangoo', 'JKL-7890', 2020, 'Rouge', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample theft cases
INSERT INTO "theft_cases" ("id", "vehicleId", "theftDate", "theftTime", "location", "description", "driverName", "driverContact", "status", "actionsToken", "createdAt", "updatedAt") VALUES
('tc1', 'v1', '2024-01-15', '14:30', 'Paris, 75001', 'Véhicule volé dans un parking public. Vitres brisées.', 'Jean Dupont', '0612345678', 'RESOLVED', 'Police contactée, véhicule retrouvé après 3 jours', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tc2', 'v2', '2024-02-20', '22:00', 'Lyon, 69002', 'Vol avec effraction. Serrure forcée.', 'Marie Martin', '0623456789', 'IN_PROGRESS', 'Déclaration faite, enquête en cours', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tc3', 'v3', '2024-03-10', '09:15', 'Marseille, 13001', 'Véhicule volé devant le domicile du conducteur.', 'Pierre Durand', '0634567890', 'UNDER_INVESTIGATION', 'Caméras de surveillance vérifiées', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
