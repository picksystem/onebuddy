import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
} as unknown as ConstructorParameters<typeof PrismaClient>[0]);

async function createTables() {
  console.log('Creating tables if not exist...');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS "AdminHeader" (
      "id" SERIAL PRIMARY KEY,
      "ticketType" TEXT NOT NULL,
      "key" TEXT UNIQUE NOT NULL,
      "name" TEXT NOT NULL,
      "description" TEXT,
      "isActive" BOOLEAN DEFAULT true,
      "app" TEXT NOT NULL,
      "order" INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "AdminServiceRequest" (
      "id" SERIAL PRIMARY KEY,
      "number" TEXT UNIQUE NOT NULL,
      "client" TEXT,
      "caller" TEXT NOT NULL,
      "callerPhone" TEXT,
      "callerEmail" TEXT,
      "callerLocation" TEXT,
      "callerDepartment" TEXT,
      "businessCategory" TEXT,
      "serviceLine" TEXT,
      "application" TEXT,
      "applicationCategory" TEXT,
      "applicationSubCategory" TEXT,
      "shortDescription" TEXT,
      "description" TEXT,
      "impact" TEXT,
      "urgency" TEXT,
      "priority" TEXT,
      "status" TEXT NOT NULL DEFAULT 'new',
      "assignmentGroup" TEXT,
      "primaryResource" TEXT,
      "secondaryResources" TEXT,
      "createdBy" TEXT NOT NULL,
      "isRecurring" BOOLEAN DEFAULT false,
      "isReleaseManagement" BOOLEAN DEFAULT false,
      "eta" TIMESTAMP(3),
      "notes" TEXT,
      "relatedRecords" TEXT,
      "attachments" TEXT,
      "followers" TEXT,
      "internalFollowers" TEXT,
      "draftExpiresAt" TIMESTAMP(3),
      "clientPrimaryContact" TEXT,
      "billingCode" TEXT,
      "approvedEstimatesHours" FLOAT,
      "estimatesDetails" TEXT,
      "analysisSummary" TEXT,
      "ticketSource" TEXT,
      "resolvedAt" TIMESTAMP(3),
      "resolvedBy" TEXT,
      "closedAt" TIMESTAMP(3),
      "closedBy" TEXT,
      "reopenedAt" TIMESTAMP(3),
      "reopenedBy" TEXT,
      "approvedAt" TIMESTAMP(3),
      "approvedBy" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "AdminServiceRequestComment" (
      "id" SERIAL PRIMARY KEY,
      "serviceRequestId" INTEGER NOT NULL REFERENCES "AdminServiceRequest"("id") ON DELETE CASCADE,
      "subject" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "isInternal" BOOLEAN NOT NULL DEFAULT false,
      "isSelfNote" BOOLEAN NOT NULL DEFAULT false,
      "notifyAssigneesOnly" BOOLEAN NOT NULL DEFAULT false,
      "status" TEXT,
      "attachments" TEXT,
      "createdBy" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "AdminServiceRequestTimeEntry" (
      "id" SERIAL PRIMARY KEY,
      "serviceRequestId" INTEGER NOT NULL REFERENCES "AdminServiceRequest"("id") ON DELETE CASCADE,
      "date" TEXT NOT NULL,
      "hours" INTEGER NOT NULL,
      "minutes" INTEGER NOT NULL,
      "billingCode" TEXT,
      "activityTask" TEXT,
      "externalComment" TEXT,
      "internalComment" TEXT,
      "isNonBillable" BOOLEAN NOT NULL DEFAULT false,
      "attachments" TEXT,
      "createdBy" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "AdminServiceRequestResolution" (
      "id" SERIAL PRIMARY KEY,
      "serviceRequestId" INTEGER NOT NULL REFERENCES "AdminServiceRequest"("id") ON DELETE CASCADE,
      "application" TEXT,
      "category" TEXT,
      "subCategory" TEXT,
      "customerConfirmation" BOOLEAN NOT NULL DEFAULT false,
      "isRecurring" BOOLEAN NOT NULL DEFAULT false,
      "rootCauseIdentified" BOOLEAN NOT NULL DEFAULT false,
      "rootCause" TEXT,
      "resolutionCode" TEXT NOT NULL,
      "resolution" TEXT NOT NULL,
      "internalNote" TEXT,
      "attachments" TEXT,
      "createdBy" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "AdminServiceRequestActivity" (
      "id" SERIAL PRIMARY KEY,
      "serviceRequestId" INTEGER NOT NULL REFERENCES "AdminServiceRequest"("id") ON DELETE CASCADE,
      "activityType" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "previousValue" TEXT,
      "newValue" TEXT,
      "performedBy" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "UserDashboard" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "key" TEXT NOT NULL,
      "path" TEXT NOT NULL,
      "app" TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "UserHeader" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "key" TEXT NOT NULL,
      "path" TEXT NOT NULL,
      "app" TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "UserSideNav" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "key" TEXT NOT NULL,
      "path" TEXT NOT NULL,
      "app" TEXT NOT NULL
    );

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
      "userAgent" TEXT
    );
  `);

  console.log('Tables created successfully.');
}

async function clearAndSeed() {
  console.log('Clearing existing data...');

  await pool.query(`
    DELETE FROM "AdminServiceRequestActivity" WHERE true;
    DELETE FROM "AdminServiceRequestResolution" WHERE true;
    DELETE FROM "AdminServiceRequestTimeEntry" WHERE true;
    DELETE FROM "AdminServiceRequestComment" WHERE true;
    DELETE FROM "AdminServiceRequest" WHERE true;
    DELETE FROM "AdminHeader" WHERE true;
    DELETE FROM "UserDashboard" WHERE true;
    DELETE FROM "UserHeader" WHERE true;
    DELETE FROM "UserSideNav" WHERE true;
    DELETE FROM "LoginLog" WHERE true;
    DELETE FROM "UserChangeLog" WHERE true;
    DELETE FROM "CaptainProfile" WHERE true;
    DELETE FROM "CaptainRole" WHERE true;
    DELETE FROM "User" WHERE true;
    ALTER SEQUENCE "AdminServiceRequest_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "AdminServiceRequestComment_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "AdminServiceRequestTimeEntry_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "AdminServiceRequestResolution_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "AdminServiceRequestActivity_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "AdminHeader_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "User_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "UserChangeLog_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "CaptainProfile_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "CaptainRole_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "LoginLog_id_seq" RESTART WITH 1;
  `);

  console.log('Existing data cleared.');

  // Insert Admin header data
  await pool.query(`
    INSERT INTO "AdminHeader" ("ticketType", "key", "name", "description", "isActive", "app", "order")
      VALUES ('Support Ticket', 'support-ticket', 'Support Ticket Header', 'Header for support ticket management', true, 'admin', 1);
    INSERT INTO "AdminHeader" ("ticketType", "key", "name", "description", "isActive", "app", "order")
      VALUES ('Service Request', 'service-request', 'Service Request', 'Header for service request management', true, 'admin', 2);
  `);

  // Insert User data
  await pool.query(`
    INSERT INTO "UserDashboard" ("id", "name", "key", "path", "app") VALUES ('user-dashboard-1', 'User Dashboard', 'dashboard', '/dashboard', 'user');
    INSERT INTO "UserHeader" ("id", "name", "key", "path", "app") VALUES ('user-header-1', 'Home', 'home', '/', 'user');
    INSERT INTO "UserSideNav" ("id", "name", "key", "path", "app") VALUES ('user-sidenav-1', 'Dashboard', 'dashboard', '/dashboard', 'user');
  `);

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

  // Seed sample service requests across all statuses
  await pool.query(`
    INSERT INTO "AdminServiceRequest" ("number", "caller", "callerPhone", "callerEmail", "callerLocation", "callerDepartment", "businessCategory", "serviceLine", "application", "shortDescription", "description", "impact", "urgency", "priority", "status", "assignmentGroup", "primaryResource", "createdBy", "isRecurring", "notes", "createdAt", "updatedAt")
      VALUES ('SRQ1001001', 'John Doe', '+1-555-0101', 'john.doe@company.com', 'New York - HQ', 'Finance', 'Financial Services', 'Core Banking', 'Payment Gateway', 'Request access to payment gateway reporting dashboard', 'Finance team requires read-only access to the payment gateway reporting dashboard for monthly reconciliation.', 'medium', 'medium', '3-Medium', 'new', 'Access Management Team', 'Alice Johnson', 'admin@bandi.com', false, 'Awaiting manager approval before provisioning.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

    INSERT INTO "AdminServiceRequest" ("number", "caller", "callerPhone", "callerEmail", "callerLocation", "callerDepartment", "businessCategory", "serviceLine", "application", "shortDescription", "description", "impact", "urgency", "priority", "status", "assignmentGroup", "primaryResource", "secondaryResources", "createdBy", "isRecurring", "notes", "createdAt", "updatedAt")
      VALUES ('SRQ1001002', 'Jane Smith', '+1-555-0102', 'jane.smith@company.com', 'Chicago - Branch', 'Human Resources', 'Corporate Services', 'HR Systems', 'Employee Portal', 'Install Microsoft Office on new hire laptops', 'New batch of 10 laptops for onboarding class starting next week need Office 365 installed and configured.', 'medium', 'high', '2-High', 'in_progress', 'IT Provisioning Team', 'Bob Williams', 'Carol Davis', 'admin@bandi.com', false, 'Laptops received. Imaging in progress.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

    INSERT INTO "AdminServiceRequest" ("number", "caller", "callerEmail", "callerLocation", "callerDepartment", "businessCategory", "serviceLine", "application", "shortDescription", "description", "impact", "urgency", "priority", "status", "assignmentGroup", "primaryResource", "createdBy", "isRecurring", "notes", "relatedRecords", "createdAt", "updatedAt")
      VALUES ('SRQ1001003', 'Mike Johnson', 'mike.johnson@company.com', 'Dallas - Remote', 'Engineering', 'Technology', 'Infrastructure', 'CI/CD Pipeline', 'Azure DevOps', 'Provision new Azure DevOps project for mobile app', 'Engineering team requires a new Azure DevOps project with standard pipelines and repository access for the upcoming mobile app development.', 'low', 'medium', '3-Medium', 'on_hold', 'Cloud Operations Team', 'Dave Martinez', 'user@bandi.com', false, 'On hold - waiting for budget approval from department head.', '["SRQ1000987"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

    INSERT INTO "AdminServiceRequest" ("number", "caller", "callerPhone", "callerEmail", "callerLocation", "callerDepartment", "businessCategory", "serviceLine", "application", "shortDescription", "description", "impact", "urgency", "priority", "status", "assignmentGroup", "primaryResource", "createdBy", "isRecurring", "notes", "attachments", "resolvedAt", "resolvedBy", "createdAt", "updatedAt")
      VALUES ('SRQ1001004', 'Sarah Wilson', '+1-555-0104', 'sarah.wilson@company.com', 'San Francisco - Office', 'Marketing', 'Marketing Operations', 'Digital Marketing', 'Email Campaign Tool', 'Upgrade email campaign tool license to Enterprise tier', 'Marketing team needs Enterprise tier features including advanced analytics and A/B testing for Q2 campaigns.', 'low', 'low', '4-Low', 'resolved', 'Software Licensing Team', 'Eve Rodriguez', 'user@bandi.com', false, 'License upgraded successfully. User notified.', '["license_confirmation.pdf"]', CURRENT_TIMESTAMP, 'admin@bandi.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

    INSERT INTO "AdminServiceRequest" ("number", "caller", "callerPhone", "callerEmail", "callerLocation", "callerDepartment", "businessCategory", "serviceLine", "application", "shortDescription", "description", "impact", "urgency", "priority", "status", "assignmentGroup", "primaryResource", "secondaryResources", "createdBy", "isRecurring", "notes", "closedAt", "closedBy", "createdAt", "updatedAt")
      VALUES ('SRQ1001005', 'Tom Brown', '+1-555-0105', 'tom.brown@company.com', 'Boston - Office', 'Sales', 'Sales Operations', 'CRM', 'Salesforce', 'Create custom Salesforce report for Q1 pipeline', 'Sales leadership needs a custom report showing Q1 pipeline by region, product, and stage for board presentation.', 'medium', 'high', '2-High', 'closed', 'CRM Admin Team', 'Frank Lee', 'Grace Kim', 'admin@bandi.com', false, 'Report created and shared with sales leadership. Verified correct.', CURRENT_TIMESTAMP, 'admin@bandi.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

    INSERT INTO "AdminServiceRequest" ("number", "caller", "callerPhone", "callerEmail", "callerLocation", "callerDepartment", "businessCategory", "serviceLine", "application", "shortDescription", "description", "impact", "urgency", "priority", "status", "assignmentGroup", "primaryResource", "createdBy", "isRecurring", "notes", "draftExpiresAt", "createdAt", "updatedAt")
      VALUES ('SRQ1001006', 'Amy Taylor', '+1-555-0109', 'amy.taylor@company.com', 'Denver - Remote', 'Engineering', 'Technology', 'Cloud Services', 'AWS Console', 'Draft - Request S3 bucket for analytics data lake', 'Engineering team requires a new S3 bucket with appropriate IAM policies for the analytics data lake project. Pending architecture review.', 'medium', 'low', '4-Low', 'draft', 'Cloud Operations Team', 'admin@bandi.com', 'admin@bandi.com', false, 'Draft - pending architecture review before submission.', CURRENT_TIMESTAMP + INTERVAL '3 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
  `);

  console.log('Data seeded successfully!');
}

function createSeedAttachments() {
  const uploadsDir = path.join(__dirname, '../../uploads/attachments');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const files: Record<string, string> = {
    'license_confirmation.pdf':
      'Placeholder: License upgrade confirmation for SRQ1001004.\nEmail Campaign Tool upgraded to Enterprise tier - effective immediately.',
  };

  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(uploadsDir, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Created seed attachment: ${filename}`);
    }
  }
}

async function main() {
  console.log('Starting database seeding...');
  console.log('Database URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));

  createSeedAttachments();
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
