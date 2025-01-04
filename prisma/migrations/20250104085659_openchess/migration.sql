/*
  Warnings:

  - You are about to drop the `Opening` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Opening";

-- CreateTable
CREATE TABLE "opening" (
    "id" SERIAL NOT NULL,
    "opening_name" TEXT NOT NULL,
    "description_file" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opening_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "opening_opening_name_key" ON "opening"("opening_name");

-- CreateIndex
CREATE UNIQUE INDEX "opening_description_file_key" ON "opening"("description_file");
