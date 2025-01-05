/*
  Warnings:

  - You are about to drop the `openings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "openings";

-- CreateTable
CREATE TABLE "Openings" (
    "id" SERIAL NOT NULL,
    "opening_name" TEXT NOT NULL,
    "description_file" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Openings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Openings_opening_name_key" ON "Openings"("opening_name");

-- CreateIndex
CREATE UNIQUE INDEX "Openings_description_file_key" ON "Openings"("description_file");
