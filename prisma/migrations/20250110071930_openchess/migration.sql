/*
  Warnings:

  - A unique constraint covering the columns `[urlName]` on the table `opening` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "opening_urlName_key" ON "opening"("urlName");
