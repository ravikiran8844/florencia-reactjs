// "use client";
// import React, { useEffect, useState } from 'react';

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   // Function to fetch products from the API with pagination
//   const fetchProducts = async () => {
//     if (loading || !hasMore) return;

//     setLoading(true);
//     const res = await fetch(`/api/products?page=${page}&limit=40`);
//     const data = await res.json();

//     setProducts(prevProducts => [...prevProducts, ...data.products]);
//     setLoading(false);

//     // If fewer products are returned than requested, assume no more are available
//     if (data.products.length < 40) setHasMore(false);
//   };

//   // Initial fetch and load on page change
//   useEffect(() => {
//     fetchProducts();
//   }, [page]);

//   // Infinite scroll logic
//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + document.documentElement.scrollTop >=
//         document.documentElement.offsetHeight - 500
//       ) {
//         setPage(prevPage => prevPage + 1);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <div>
//       <h1>Product List</h1>
//       <div className="product-container grid grid-cols-4 gap-10 p-10">
//         {products.map(product => (
//           <div key={product.id} className="product-card h-100 bg-gray-100 shadow-sm">
//             <h2>{product.title}</h2>
//             <p><strong>Category:</strong> {product.category}</p>
//           </div>
//         ))}
       
//       </div>
//     </div>
//   );
// };

// export default ProductList;


import React from 'react'

const TestProducts = () => {
  return (
    <div>TestProducts</div>
  )
}

export default TestProducts
