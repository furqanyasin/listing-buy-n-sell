-- Rebrand: Update enums from automotive to industrial machinery

-- Step 1: Delete existing listings (dev data only) to avoid enum constraint issues
DELETE FROM "listing_images";
DELETE FROM "favorites";
DELETE FROM "conversations";
DELETE FROM "messages";
DELETE FROM "listings";

-- Step 2: Recreate BodyType enum with machinery values
ALTER TYPE "BodyType" RENAME TO "BodyType_old";
CREATE TYPE "BodyType" AS ENUM ('CNC_MILL', 'CNC_LATHE', 'LASER_CUTTER', 'CNC_ROUTER', 'PRESS_BRAKE', 'WATERJET', 'PLASMA_CUTTER', 'PRINTER_3D');
ALTER TABLE "listings" ALTER COLUMN "bodyType" TYPE "BodyType" USING "bodyType"::text::"BodyType";
DROP TYPE "BodyType_old";

-- Step 3: Recreate FuelType enum with power type values
ALTER TYPE "FuelType" RENAME TO "FuelType_old";
CREATE TYPE "FuelType" AS ENUM ('ELECTRIC', 'HYDRAULIC', 'PNEUMATIC', 'DIESEL', 'MANUAL');
ALTER TABLE "listings" ALTER COLUMN "fuelType" TYPE "FuelType" USING "fuelType"::text::"FuelType";
DROP TYPE "FuelType_old";
