import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
} as unknown as ConstructorParameters<typeof PrismaClient>[0]);

async function createTables() {
  console.log('Creating tables if not exist...');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" SERIAL PRIMARY KEY,
      "firstName" TEXT NOT NULL,
      "lastName" TEXT NOT NULL,
      "email" TEXT UNIQUE NOT NULL,
      "password" TEXT NOT NULL,
      "phone" TEXT,
      "reasonForAccess" TEXT,
      "employeeId" TEXT,
      "businessUnit" TEXT,
      "dateOfBirth" TEXT,
      "profilePicture" TEXT,
      "name" TEXT NOT NULL,
      "role" TEXT NOT NULL DEFAULT 'user',
      "requestedRole" TEXT,
      "status" TEXT NOT NULL DEFAULT 'pending_approval',
      "source" TEXT NOT NULL DEFAULT 'signup',
      "reviewedBy" INTEGER,
      "reviewedAt" TIMESTAMP(3),
      "adminNotes" TEXT,
      "invitationToken" TEXT,
      "invitationExpiry" TIMESTAMP(3),
      "mustResetPassword" BOOLEAN NOT NULL DEFAULT false,
      "otp" TEXT,
      "otpExpiresAt" TIMESTAMP(3),
      "otpIsUsed" BOOLEAN DEFAULT false,
      "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
      "lockedUntil" TIMESTAMP(3),
      "lastLoginAt" TIMESTAMP(3),
      "passwordChangedAt" TIMESTAMP(3),
      "isActive" BOOLEAN NOT NULL DEFAULT false,
      "accessFromDate" TIMESTAMP(3),
      "accessToDate" TIMESTAMP(3),
      "firstActivationDate" TIMESTAMP(3),
      "lastDeactivationDate" TIMESTAMP(3),
      "lastActivityAt" TIMESTAMP(3),
      "captainProfileUpdated" BOOLEAN NOT NULL DEFAULT false,
      "application" TEXT,
      "applicationLead" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "UserChangeLog" (
      "id" SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL,
      "changeType" TEXT NOT NULL,
      "fieldName" TEXT,
      "previousValue" TEXT,
      "newValue" TEXT,
      "changedBy" INTEGER NOT NULL,
      "changedByName" TEXT NOT NULL,
      "reasonCode" TEXT,
      "reasonNotes" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "CaptainProfile" (
      "id" SERIAL PRIMARY KEY,
      "userId" INTEGER UNIQUE NOT NULL,
      "application" TEXT NOT NULL,
      "captainRole" TEXT,
      "slaWorkingCalendar" TEXT,
      "slaExceptionCalendar" TEXT,
      "leadCaptain" TEXT,
      "applicationManager" TEXT,
      "isPocLead" BOOLEAN NOT NULL DEFAULT false,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "CaptainRole" (
      "id" SERIAL PRIMARY KEY,
      "application" TEXT NOT NULL,
      "roleName" TEXT NOT NULL,
      "description" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "LoginLog" (
      "id" SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL,
      "loginTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "logoutTime" TIMESTAMP(3),
      "ipAddress" TEXT,
      "device" TEXT,
      "userAgent" TEXT,
      "platform" TEXT,
      "deviceId" TEXT
    );

    CREATE TABLE IF NOT EXISTS "DeviceToken" (
      "id" SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL,
      "token" TEXT UNIQUE NOT NULL,
      "platform" TEXT NOT NULL,
      "deviceId" TEXT,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "CustomerOnboarding" (
      "id" SERIAL PRIMARY KEY,
      "firstName" TEXT NOT NULL,
      "lastName" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "email" TEXT,
      "city" TEXT NOT NULL,
      "area" TEXT,
      "pincode" TEXT,
      "serviceCategory" TEXT NOT NULL,
      "vehicleType" TEXT NOT NULL,
      "vehicleSubType" TEXT,
      "fuelType" TEXT NOT NULL,
      "tripPreference" TEXT NOT NULL,
      "vehicleNumber" TEXT NOT NULL,
      "rcNumber" TEXT NOT NULL,
      "rcExpiry" TEXT,
      "insuranceNumber" TEXT,
      "insuranceExpiry" TEXT,
      "pucNumber" TEXT,
      "pucExpiry" TEXT,
      "fitnessNumber" TEXT,
      "fitnessExpiry" TEXT,
      "permitNumber" TEXT,
      "permitExpiry" TEXT,
      "dlNumber" TEXT NOT NULL,
      "dlExpiry" TEXT,
      "idProofType" TEXT NOT NULL,
      "idProofNumber" TEXT,
      "bundleTypes" TEXT,
      "bundleDiscount" FLOAT,
      "rentalVehiclePref" TEXT,
      "rentalDuration" TEXT,
      "rentalPickupZone" TEXT,
      "driverHireCount" INTEGER,
      "driverHireShift" TEXT,
      "driverHireBudget" TEXT,
      "additionalVehicles" TEXT,
      "parcelComboTypes" TEXT,
      "parcelMaxWeight" TEXT,
      "parcelRadiusPref" TEXT,
      "cargoCoRideMax" INTEGER,
      "cargoCoRideHaulPref" TEXT,
      "cargoCoRideRatePref" TEXT,
      "status" TEXT NOT NULL DEFAULT 'pending',
      "adminNotes" TEXT,
      "submittedAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Tables created successfully.');
}

async function clearAndSeed() {
  console.log('Clearing existing data...');

  await pool.query(`
    DELETE FROM "DeviceToken" WHERE true;
    DELETE FROM "CustomerOnboarding" WHERE true;
    DELETE FROM "LoginLog" WHERE true;
    DELETE FROM "UserChangeLog" WHERE true;
    DELETE FROM "CaptainProfile" WHERE true;
    DELETE FROM "CaptainRole" WHERE true;
    DELETE FROM "User" WHERE true;
    ALTER SEQUENCE "DeviceToken_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "CustomerOnboarding_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "LoginLog_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "User_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "UserChangeLog_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "CaptainProfile_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "CaptainRole_id_seq" RESTART WITH 1;
  `);

  console.log('Existing data cleared.');

  // Seed default users (admin, user, captain)
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);
  const captainPassword = await bcrypt.hash('captain123', 10);

  await pool.query(`
    INSERT INTO "User" ("firstName", "lastName", "email", "password", "phone", "businessUnit", "employeeId", "name", "role", "status", "source", "lastActivityAt", "failedLoginAttempts", "isActive", "mustResetPassword", "firstActivationDate", "createdAt", "updatedAt")
      VALUES ('Admin', 'User', 'admin@bandi.com', '${adminPassword}', '+1-555-0001', 'Technology', 'EMP001', 'Admin User', 'admin', 'active', 'admin', NOW() - INTERVAL '15 minutes', 0, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    INSERT INTO "User" ("firstName", "lastName", "email", "password", "phone", "businessUnit", "employeeId", "name", "role", "status", "source", "lastActivityAt", "failedLoginAttempts", "isActive", "mustResetPassword", "firstActivationDate", "createdAt", "updatedAt")
      VALUES ('Regular', 'User', 'user@bandi.com', '${userPassword}', '+1-555-0002', 'Corporate Services', 'EMP002', 'Regular User', 'user', 'active', 'admin', NOW() - INTERVAL '3 hours', 0, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    INSERT INTO "User" ("firstName", "lastName", "email", "password", "phone", "businessUnit", "employeeId", "reasonForAccess", "name", "role", "status", "source", "lastActivityAt", "failedLoginAttempts", "isActive", "mustResetPassword", "firstActivationDate", "createdAt", "updatedAt")
      VALUES ('Captain', 'User', 'captain@bandi.com', '${captainPassword}', '+1-555-0003', 'Professional Services', 'CON001', 'Assigned to BANDI implementation project', 'Captain User', 'captain', 'active', 'admin', NOW() - INTERVAL '1 day', 0, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
  `);

  console.log('Data seeded successfully!');
}

async function main() {
  console.log('Starting database seeding...');
  console.log('Database URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));

  await createTables();
  await clearAndSeed();

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
