/*
  Warnings:

  - You are about to drop the `Openings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Openings";

-- CreateTable
CREATE TABLE "openings" (
    "id" SERIAL NOT NULL,
    "opening_name" TEXT NOT NULL,
    "description_file" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "openings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "openings_opening_name_key" ON "openings"("opening_name");

-- CreateIndex
CREATE UNIQUE INDEX "openings_description_file_key" ON "openings"("description_file");
