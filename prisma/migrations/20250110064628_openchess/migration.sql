-- CreateTable
CREATE TABLE "opening" (
    "eco" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "urlName" TEXT NOT NULL,
    "pgn" TEXT NOT NULL,
    "mdx" TEXT,

    CONSTRAINT "opening_pkey" PRIMARY KEY ("eco")
);

-- CreateIndex
CREATE INDEX "opening_eco_idx" ON "opening"("eco");
