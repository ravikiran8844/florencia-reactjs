const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const rawData = fs.readFileSync('public/products.json', 'utf-8');
  const products = JSON.parse(rawData);

  for (const product of products) {
    try {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {
          title: product["Product Title"],
          designNo: product["DESIGN NO"],
          diamondType: product["DIAMOND TYPE"],
          goldWeight: product["GOLD WT"].map(parseFloat),
          goldType: product["GOLD TYPE"],
          diamondWeight: product["DIA WT"].map(parseFloat),
          mcPercentage: parseFloat(product["MC(%)"]),
          diamondPcs: parseInt(product["DIA PCS"], 10),
          category: product.CATEGORY,
        },
        create: {
          title: product["Product Title"],
          designNo: product["DESIGN NO"],
          slug: product.slug,
          diamondType: product["DIAMOND TYPE"],
          goldWeight: product["GOLD WT"].map(parseFloat),
          goldType: product["GOLD TYPE"],
          diamondWeight: product["DIA WT"].map(parseFloat),
          mcPercentage: parseFloat(product["MC(%)"]),
          diamondPcs: parseInt(product["DIA PCS"], 10),
          category: product.CATEGORY,
        },
      });
      console.log(`Product with slug ${product.slug} added or updated successfully.`);
    } catch (error) {
      console.error(`Error processing product with slug ${product.slug}:`, error);
    }
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
