-- Fix phone column type: change from INTEGER to TEXT if needed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'CustomerOnboarding'
      AND column_name = 'phone'
      AND data_type IN ('integer', 'bigint', 'smallint', 'numeric')
  ) THEN
    ALTER TABLE "CustomerOnboarding" ALTER COLUMN "phone" TYPE TEXT USING "phone"::TEXT;
  END IF;
END $$;

-- Add createdBy / registration fields
ALTER TABLE "CustomerOnboarding" ADD COLUMN IF NOT EXISTS "idProofExpiry"     TEXT;
ALTER TABLE "CustomerOnboarding" ADD COLUMN IF NOT EXISTS "createdByName"     TEXT;
ALTER TABLE "CustomerOnboarding" ADD COLUMN IF NOT EXISTS "createdByEmail"    TEXT;
ALTER TABLE "CustomerOnboarding" ADD COLUMN IF NOT EXISTS "createdByPhone"    TEXT;
ALTER TABLE "CustomerOnboarding" ADD COLUMN IF NOT EXISTS "isSelfRegistered"  BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "CustomerOnboarding" ADD COLUMN IF NOT EXISTS "reviewedAt"        TIMESTAMP(3);
