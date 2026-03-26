-- Cleanup: delete users who are NOT admin or consultant
-- This removes captain, regular user, and any other non-management roles
-- that should not appear in the Access Management admin panel.
DELETE FROM "User"
WHERE role NOT IN ('admin', 'consultant')
  AND ("requestedRole" IS NULL OR "requestedRole" NOT IN ('admin', 'consultant'));
