-- Production logs show CLOSED missing from a database changed with db push.
-- Add the value without replacing the enum or altering existing records.
ALTER TYPE "RequisitionStatus" ADD VALUE IF NOT EXISTS 'CLOSED';
