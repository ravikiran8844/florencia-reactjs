const fs = require('fs');
const { parse } = require('json2csv');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function exportToCSV() {
    // Fetching the products from the database
    const products = await prisma.product.findMany();

    // Transform the data to ensure the array fields are serialized correctly
    const transformedProducts = products.map(product => ({
        ...product,
        // Convert arrays to JSON strings (e.g., ["IJS", "MJS"])
        diamondType: JSON.stringify(product.diamondType),
        goldWeight: JSON.stringify(product.goldWeight),
        goldType: JSON.stringify(product.goldType),
        diamondWeight: JSON.stringify(product.diamondWeight),
    }));

    // Convert the transformed data to CSV
    const csvData = parse(transformedProducts);

    // Write the CSV data to a file
    fs.writeFileSync('products_export.csv', csvData);
    console.log('Data has been exported to products_export.csv');
}

exportToCSV();
