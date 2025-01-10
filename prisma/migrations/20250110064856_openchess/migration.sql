/*
  Warnings:

  - The primary key for the `opening` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[eco]` on the table `opening` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `opening` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[urlName]` on the table `opening` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pgn]` on the table `opening` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "opening" DROP CONSTRAINT "opening_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "opening_eco_key" ON "opening"("eco");

-- CreateIndex
CREATE UNIQUE INDEX "opening_name_key" ON "opening"("name");

-- CreateIndex
CREATE UNIQUE INDEX "opening_urlName_key" ON "opening"("urlName");

-- CreateIndex
CREATE UNIQUE INDEX "opening_pgn_key" ON "opening"("pgn");
