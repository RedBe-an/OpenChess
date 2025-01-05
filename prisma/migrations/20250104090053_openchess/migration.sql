/*
  Warnings:

  - You are about to drop the `opening` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "opening";

-- CreateTable
CREATE TABLE "Opening" (
    "id" SERIAL NOT NULL,
    "opening_name" TEXT NOT NULL,
    "description_file" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opening_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Opening_opening_name_key" ON "Opening"("opening_name");

-- CreateIndex
CREATE UNIQUE INDEX "Opening_description_file_key" ON "Opening"("description_file");
