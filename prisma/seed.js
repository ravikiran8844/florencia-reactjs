const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
    {
      "Product Title": "03-11417(2)",
      "DESIGN NO": "03-11417(2)",
      "slug": "03-11417-2",
      "DIAMOND TYPE": [
        "IJS","MJS"
      ],
      "GOLD WT": [
        "1.5","2.6"
      ],
      "GOLD TYPE": [
        "14K","18K"
      ],
      "DIA WT": [
        "0.396"
      ],
      "MC(%)": 30,
      "DIA PCS": 25,
      "CATEGORY": "PENDANT SET"
    },
    
    {
      "Product Title": "SE0011",
      "DESIGN NO": "SE0011",
      "slug": "SE0011",
      "DIAMOND TYPE": [
        "IJS"
      ],
      "GOLD WT": [
        "1.32","1.42"
      ],
      "GOLD TYPE": [
        "18K","22K"
      ],
      "DIA WT": [
        "0.593","0.693","0.793"
      ],
      "MC(%)": 19,
      "DIA PCS": 32,
      "CATEGORY": "EARRING"
    }
  ]

const formattedProducts = products
  .map((product) => {
    const hasRequiredFields =
      product["Product Title"] !== undefined &&
      product["DESIGN NO"] !== undefined &&
      product["slug"] !== undefined &&
      product["DIAMOND TYPE"] !== undefined &&
      product["GOLD WT"] !== undefined &&
      product["GOLD TYPE"] !== undefined &&
      product["DIA WT"] !== undefined &&
      product["MC(%)"] !== undefined &&
      product["DIA PCS"] !== undefined &&
      product["CATEGORY"] !== undefined;

    if (!hasRequiredFields) {
      console.warn(`Skipping item due to missing field(s):`, product);
      return null;
    }

    return {
      title: product["Product Title"],
      designNo: product["DESIGN NO"],
      slug: product["slug"],
      diamondType: product["DIAMOND TYPE"], // Array of diamond types
      goldWeight: product["GOLD WT"].map((wt) => parseFloat(wt)), // Convert each weight to float
      goldType: product["GOLD TYPE"], // Array of gold types
      diamondWeight: product["DIA WT"].map((wt) => parseFloat(wt)), // Convert each diamond weight to float
      mcPercentage: product["MC(%)"],
      diamondPcs: product["DIA PCS"],
      category: product["CATEGORY"],
    };
  })
  .filter((product) => product !== null);

async function main() {
    await prisma.product.createMany({
        data: formattedProducts,
        skipDuplicates: true
    });
    console.log("Data has been seeded!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
