-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "design_no" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "diamondType" TEXT[],
    "gold_weight" DOUBLE PRECISION[],
    "goldType" TEXT[],
    "diamond_weight" DOUBLE PRECISION[],
    "mc_percentage" INTEGER NOT NULL,
    "diamond_pcs" INTEGER NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
