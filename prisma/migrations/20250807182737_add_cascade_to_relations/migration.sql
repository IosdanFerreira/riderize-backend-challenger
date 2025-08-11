-- DropForeignKey
ALTER TABLE "public"."RideSubscription" DROP CONSTRAINT "RideSubscription_ride_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."RideSubscription" ADD CONSTRAINT "RideSubscription_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "public"."Ride"("id") ON DELETE CASCADE ON UPDATE CASCADE;
