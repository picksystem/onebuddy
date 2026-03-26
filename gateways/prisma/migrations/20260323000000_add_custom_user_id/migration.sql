-- AlterTable: add customUserId column to User (idempotent)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "customUserId" TEXT;

-- Backfill existing admins and consultants
UPDATE "User"
SET "customUserId" = CASE
  WHEN role = 'admin' OR "requestedRole" = 'admin'
    THEN 'ADMIN' || LPAD(id::text, 4, '0')
  WHEN role = 'consultant' OR "requestedRole" = 'consultant'
    THEN 'CONSULT' || LPAD(id::text, 4, '0')
END
WHERE (role IN ('admin', 'consultant') OR "requestedRole" IN ('admin', 'consultant'))
  AND "customUserId" IS NULL;

-- CreateIndex: unique constraint on customUserId (idempotent)
CREATE UNIQUE INDEX IF NOT EXISTS "User_customUserId_key" ON "User"("customUserId");
