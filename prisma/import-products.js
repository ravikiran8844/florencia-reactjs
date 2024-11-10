// import-products.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const csvParser = require('csv-parser');

const prisma = new PrismaClient();

async function main() {
  const results = [];

  fs.createReadStream('products_export.csv') // update with actual path
    .pipe(csvParser())
    .on('data', (data) => {
      // Parse comma-separated values for array fields
      data.goldWeight = data.goldWeight.split(',').map(parseFloat);
      data.diamondType = data.diamondType.split(',');
      data.goldType = data.goldType.split(',');
      data.diamondWeight = data.diamondWeight.split(',').map(parseFloat);
      data.mcPercentage = parseFloat(data.mcPercentage);
      data.diamondPcs = parseInt(data.diamondPcs, 10);

      results.push(data);
    })
    .on('end', async () => {
      for (const product of results) {
        await prisma.product.create({
          data: {
            title: product.title,
            designNo: product.designNo,
            slug: product.slug,
            diamondType: product.diamondType,
            goldWeight: product.goldWeight,
            goldType: product.goldType,
            diamondWeight: product.diamondWeight,
            mcPercentage: product.mcPercentage,
            diamondPcs: product.diamondPcs,
            category: product.category,
          },
        });
      }
      console.log('Products added successfully');
      await prisma.$disconnect();
    });
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
