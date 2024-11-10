const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const csvParser = require('csv-parser');

const prisma = new PrismaClient();

async function updateOrCreateProductsFromCSV(filePath) {
  const results = [];

  // Step 1: Parse CSV file
  fs.createReadStream(filePath)
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
      // Step 2: Iterate through each product in the CSV
      for (const product of results) {
        const existingProduct = await prisma.product.findFirst({
          where: { designNo: product.designNo }, // Using findFirst for non-unique fields
        });

        if (existingProduct) {
          // Step 3: Update product if there are any differences
          const needsUpdate =
            existingProduct.title !== product.title ||
            existingProduct.slug !== product.slug ||
            JSON.stringify(existingProduct.diamondType) !== JSON.stringify(product.diamondType) ||
            JSON.stringify(existingProduct.goldWeight) !== JSON.stringify(product.goldWeight) ||
            JSON.stringify(existingProduct.goldType) !== JSON.stringify(product.goldType) ||
            JSON.stringify(existingProduct.diamondWeight) !== JSON.stringify(product.diamondWeight) ||
            existingProduct.mcPercentage !== product.mcPercentage ||
            existingProduct.diamondPcs !== product.diamondPcs ||
            existingProduct.category !== product.category;

          if (needsUpdate) {
            await prisma.product.update({
              where: { id: existingProduct.id },
              data: {
                title: product.title,
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
          // Step 4: Create new product if it does not exist
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



// Run the function with the path to your CSV file
updateOrCreateProductsFromCSV('products_export.csv').catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
