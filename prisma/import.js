const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const csv = require('csv-parser');

// Utility function to compare arrays
function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

async function importAndUpdateCSV(filePath) {
    const updatedProducts = [];

    fs.createReadStream(path.resolve(filePath))
        .pipe(csv())
        .on('data', async (row) => {
            const { slug, title, diamondType, goldWeight, goldType, diamondWeight, mcPercentage, diamondPcs, category } = row;

            try {
                // Log the incoming row data from CSV
                console.log('Raw CSV Data:', { slug, title, diamondType, goldWeight, goldType, diamondWeight, mcPercentage, diamondPcs, category });

                // Parse the CSV values
                const newDiamondType = JSON.parse(diamondType.trim());
                const newGoldWeight = JSON.parse(goldWeight.trim());
                const newGoldType = JSON.parse(goldType.trim());
                const newDiamondWeight = JSON.parse(diamondWeight.trim());
                const newMcPercentage = parseFloat(mcPercentage.trim());  // Ensure mcPercentage is a number
                const newDiamondPcs = parseInt(diamondPcs.trim());  // Ensure diamondPcs is an integer

                // Log the parsed values
                console.log('Parsed New Values:', { newDiamondType, newGoldWeight, newGoldType, newDiamondWeight, newMcPercentage, newDiamondPcs, category });

                // Find the existing product by slug
                const existingProduct = await prisma.product.findUnique({
                    where: { slug }
                });

                if (existingProduct) {
                    // Log the existing product data
                    console.log('Existing Product:', existingProduct);

                    // Compare the fields
                    let fieldsChanged = false;

                    // Check if simple fields like title and mcPercentage have changed
                    if (existingProduct.title !== title || existingProduct.mcPercentage !== newMcPercentage) {
                        fieldsChanged = true;
                    }

                    // Compare arrays (diamondType, goldWeight, etc.)
                    if (!arraysAreEqual(existingProduct.diamondType, newDiamondType) ||
                        !arraysAreEqual(existingProduct.goldWeight, newGoldWeight) ||
                        !arraysAreEqual(existingProduct.diamondWeight, newDiamondWeight) ||
                        !arraysAreEqual(existingProduct.goldType, newGoldType)) {
                        fieldsChanged = true;
                    }

                    // Log if changes are detected
                    console.log('Fields Changed:', fieldsChanged);

                    // If any changes are detected, prepare the update
                    if (fieldsChanged) {
                        updatedProducts.push({
                            slug,
                            title,
                            mcPercentage: newMcPercentage,
                            diamondPcs: newDiamondPcs,
                            category,
                            diamondType: newDiamondType,
                            goldWeight: newGoldWeight,
                            diamondWeight: newDiamondWeight,
                            goldType: newGoldType
                        });
                    }
                }
            } catch (error) {
                console.error(`Error processing row for slug ${slug}:`, error);
            }
        })
        .on('end', async () => {
            if (updatedProducts.length > 0) {
                try {
                    // Log the updates
                    console.log('Updating products:', updatedProducts);

                    // Use updateMany to update products
                    const updatePromises = updatedProducts.map((product) => {
                        return prisma.product.updateMany({
                            where: { slug: product.slug },  // Ensure that the correct product is matched by slug
                            data: {
                                title: product.title,
                                mcPercentage: product.mcPercentage,
                                diamondPcs: product.diamondPcs,
                                category: product.category,
                                diamondType: product.diamondType,
                                goldWeight: product.goldWeight,
                                diamondWeight: product.diamondWeight,
                                goldType: product.goldType,
                            }
                        });
                    });

                    // Execute the update queries
                    const results = await Promise.all(updatePromises);

                    console.log('Update results:', results);  // Log the update results
                    console.log('Data has been updated with changes from the CSV');
                } catch (error) {
                    console.error('Error updating products in transaction:', error);
                }
            } else {
                console.log('No changes detected in the CSV data');
            }
        });
}

importAndUpdateCSV('products_export.csv');
