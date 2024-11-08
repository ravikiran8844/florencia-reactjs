import React from 'react'
import ProductsGrid from './ProductsGrid';
import { CloudFog } from 'lucide-react';
import { notFound } from 'next/navigation';


const getProductsData = async () => {
    const response = await fetch(`http://localhost:3000/products.json`);
    const data = await response.json()
    return data;
}

function formatSlug(slug) {
    return slug
      .replace(/^\//, "")     // Remove leading slash
      .replace(/-/g, " ")      // Replace hyphens with spaces
      .toUpperCase();          // Convert to uppercase
  }

const CategoryPage = async ({params}) => {
    const {slug} = await params
    const data = await getProductsData()   
      const formattedText = formatSlug(slug);
      console.log(formattedText);  // Output: "DIAMOND TYPE"

      const isCategory = data.some((item) => item.CATEGORY.toLowerCase()=== formattedText.toLowerCase());
      console.log(isCategory,"is cat")
      if (!isCategory) {
        notFound()
      }

  return (
    <div>
        <ProductsGrid productsData={data} selectedCategory={formattedText}/>
    </div>
  )
}

export default CategoryPage