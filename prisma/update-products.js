const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const csvParser = require('csv-parser');

const prisma = new PrismaClient();

async function updateOrCreateProductsFromCSV(filePath) {
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (data) => {
      // Ensure id is an integer and parse other fields correctly
      data.id = parseInt(data.id, 10);
      data.goldWeight = JSON.parse(data.goldWeight).map(parseFloat).filter(val => !isNaN(val));
      data.diamondType = JSON.parse(data.diamondType);
      data.goldType = JSON.parse(data.goldType);
      data.diamondWeight = JSON.parse(data.diamondWeight).map(parseFloat).filter(val => !isNaN(val));
      data.mcPercentage = parseFloat(data.mcPercentage) || 0;
      data.diamondPcs = parseInt(data.diamondPcs, 10) || 0;

      results.push(data);
    })
    .on('end', async () => {
      for (const product of results) {
        const existingProduct = await prisma.product.findFirst({
          where: { designNo: product.designNo },
        });

        if (existingProduct) {
          const needsUpdate = (
            existingProduct.title !== product.title ||
            existingProduct.slug !== product.slug ||
            JSON.stringify(existingProduct.diamondType) !== JSON.stringify(product.diamondType) ||
            JSON.stringify(existingProduct.goldWeight) !== JSON.stringify(product.goldWeight) ||
            JSON.stringify(existingProduct.goldType) !== JSON.stringify(product.goldType) ||
            JSON.stringify(existingProduct.diamondWeight) !== JSON.stringify(product.diamondWeight) ||
            existingProduct.mcPercentage !== product.mcPercentage ||
            existingProduct.diamondPcs !== product.diamondPcs ||
            existingProduct.category !== product.category
          );

          if (needsUpdate) {
            await prisma.product.update({
              where: { id: existingProduct.id },
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
            console.log(`Updated product with designNo: ${product.designNo}`);
          }
        } else {
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
          console.log(`Created new product with designNo: ${product.designNo}`);
        }
      }
      console.log('Update and creation process completed');
      await prisma.$disconnect();
    });
}

updateOrCreateProductsFromCSV('products_export.csv').catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
