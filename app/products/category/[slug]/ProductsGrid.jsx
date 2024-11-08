"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useState , useEffect} from "react";


function calculatePrice(goldWeight, diamondWeight, makingCharge) {
  const goldPrice = 6200; // example value per gram
  const diamondPrice = 110000; // example value per carat
  return (
    goldWeight * goldPrice + diamondWeight * diamondPrice + makingCharge / 100
  );
}

const ProductsGrid = ({productsData,selectedCategory}) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts(productsData)
      }, [productsData]); 

    
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const itemsPerPage = 30;
  const uniqueCategories = [
    ...new Set(products.map((product) => product["CATEGORY"])),
  ];
  const uniqueGoldTypes = [
    ...new Set(products.flatMap((product) => product["GOLD TYPE"])),
  ];
  const uniqueDiamondTypes = [
    ...new Set(products.flatMap((product) => product["DIAMOND TYPE"])),
  ];

  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedCategories, setSelectedCategories] = useState([selectedCategory]);
  const [selectedGoldTypes, setSelectedGoldTypes] = useState([]);
  const [selectedDiamondTypes, setSelectedDiamondTypes] = useState([]);

  const handleCheckboxChange = (setter, selectedItems, value) => {
    setter(
      selectedItems.includes(value)
        ? selectedItems.filter((item) => item !== value)
        : [...selectedItems, value]
    );
  };

  const filteredProducts = products.filter((product) => {
    const defaultGoldWeight = parseFloat(product["GOLD WT"][0]);
    const defaultDiamondWeight = parseFloat(product["DIA WT"][0]);
    const price = calculatePrice(
      defaultGoldWeight,
      defaultDiamondWeight,
      product["MC(%)"]
    );

    return (
      (selectedCategories.length === 0 ||
        selectedCategories.includes(product["CATEGORY"])) &&
      (selectedGoldTypes.length === 0 ||
        selectedGoldTypes.some((type) =>
          product["GOLD TYPE"].includes(type)
        )) &&
      (selectedDiamondTypes.length === 0 ||
        selectedDiamondTypes.some((type) =>
          product["DIAMOND TYPE"].includes(type)
        )) &&
      price >= priceRange[0] &&
      price <= priceRange[1]
    );
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    const priceA = calculatePrice(
      parseFloat(a["GOLD WT"][0]),
      parseFloat(a["DIA WT"][0]),
      a["MC(%)"]
    );
    const priceB = calculatePrice(
      parseFloat(b["GOLD WT"][0]),
      parseFloat(b["DIA WT"][0]),
      b["MC(%)"]
    );

    if (sortOption === "priceLowToHigh") return priceA - priceB;
    if (sortOption === "priceHighToLow") return priceB - priceA;
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div>
      <div className="shadow-sm py-10 bg-[#F6F3F9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-purple-900">
              All Products
            </h1>
          </div>
          <div className="mt-2">
            <nav className="flex" aria-label="Breadcrumb">
              <ol role="list" className="flex items-center space-x-1">
                <li>
                  <div className="flex items-center">
                    <a
                      href="#"
                      className="text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Home
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                      x-description="Heroicon name: mini/chevron-right"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <a
                      href="#"
                      className="text-sm font-medium text-gray-500 hover:text-gray-700"
                      aria-current="page"
                    >
                      Product Catalog
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar Filters */}
      <div className="p-2 md:px-10 lg:px-16 mt-6 flex gap-6">
        <div className="hidden lg:block  bg-white rounded min-w-[260px]">
          <h3 className="font-bold mb-4">Filters</h3>

          {/* Category Filter */}
          <ul className="space-y-1 border-t border-gray-200 py-4">
            <h4 className="font-semibold mb-3">Category</h4>
            {uniqueCategories.map((category,index) => (
              <li key={index}>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="size-5 rounded border-gray-300"
                    checked={selectedCategories.includes(category)}
                    onChange={() =>
                      handleCheckboxChange(
                        setSelectedCategories,
                        selectedCategories,
                        category
                      )
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {category}
                  </span>
                </label>
              </li>
            ))}
          </ul>

          {/* Gold Type Filter */}
          <ul className="space-y-1 border-t border-gray-200 py-4">
            <h4 className="font-semibold mb-3">Gold Type</h4>
            {uniqueGoldTypes.map((goldType) => (
              <li key={goldType}>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="size-5 rounded border-gray-300"
                    checked={selectedGoldTypes.includes(goldType)}
                    onChange={() =>
                      handleCheckboxChange(
                        setSelectedGoldTypes,
                        selectedGoldTypes,
                        goldType
                      )
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {goldType}
                  </span>
                </label>
              </li>
            ))}
          </ul>

          {/* Diamond Type Filter */}
          <ul className="space-y-1 border-t border-gray-200 py-4">
            <h4 className="font-semibold mb-3">Diamond Type</h4>
            {uniqueDiamondTypes.map((diamondType) => (
              <li key={diamondType}>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="size-5 rounded border-gray-300"
                    checked={selectedDiamondTypes.includes(diamondType)}
                    onChange={() =>
                      handleCheckboxChange(
                        setSelectedDiamondTypes,
                        selectedDiamondTypes,
                        diamondType
                      )
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {diamondType}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Product List and Pagination */}
        <div className="flex-grow">
          <div className="flex flex-wrap justify-between gap-4 items-center mb-4">
            <div className="lg:hidden">
              <Button onClick={() => setIsFilterOpen(true)} variant="outline">
                Filters
              </Button>
            </div>
            {/* Sort Options */}
            <div className="flex justify-between lg:ms-auto">
              <select
                className="border border-gray-300 rounded px-3 py-2"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Sort by</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {currentProducts.map((product) => {
              const defaultGoldWeight = parseFloat(product["GOLD WT"][0]);
              const defaultDiamondWeight = parseFloat(product["DIA WT"][0]);
              const price = calculatePrice(
                defaultGoldWeight,
                defaultDiamondWeight,
                product["MC(%)"]
              );

              return (
                <div
                  className="bg-white shadow-lg overflow-hidden border rounded-lg"
                  key={product["slug"]}
                >
                    <div>
                       <Link href={`/product/${product["slug"]}`}>
                       <img 
                            className="aspect-square object-contain m-auto" 
                            src={`/images/products/${product["DESIGN NO"]}.jpg`} 
                            width={200} 
                            height={200} 
                            alt="product" 
                            />
                       </Link>
                    </div>
                 
                 <div className="p-4 flex flex-wrap justify-between gap-2 items-center">
                 <div className="text-sm font-medium">
                    {product["Product Title"]}
                  </div>
                  {/* <p className="text-gray-700">
                    Category: {product["CATEGORY"]}
                  </p>
                  <p className="text-gray-700">
                    Gold Weight: {product["GOLD WT"][0]}
                  </p>
                  <p className="text-gray-700">
                    Diamond Weight: {product["DIA WT"][0]}
                  </p> */}
                  <p className="text-gray-900 text-sm font-medium">
                    ₹{price.toFixed(2)}
                  </p>
                 </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === index + 1
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsGrid;
