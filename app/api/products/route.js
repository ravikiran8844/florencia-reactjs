import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '40');
  const skip = (page - 1) * limit;

  // Extracting filters from the URL
  const category = searchParams.get('category') || '';  // Default to empty string if not provided
  const goldType = searchParams.get('goldType') || '';  // Default to empty string if not provided
  const diamondType = searchParams.get('diamondType') || '';  // Default to empty string if not provided

  // Filter options, only adding filters that are provided
  const where = {
    ...(category && { category: category }), // Only add if category exists
    ...(goldType && { goldType: goldType }), // Only add if goldType exists
    ...(diamondType && { diamondType: diamondType }), // Only add if diamondType exists
  };

  try {
    // Fetch products with the applied filters
    const products = await prisma.product.findMany({
      skip,
      take: limit,
      where, // Apply filters
    });

    const totalProducts = await prisma.product.count({
      where, // Count with filters
    });

    const hasMore = skip + products.length < totalProducts;

    return NextResponse.json({ products, hasMore });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Error fetching products' });
  }
}
