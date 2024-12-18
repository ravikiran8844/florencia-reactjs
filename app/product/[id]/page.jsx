"use client";
import Image from "next/image";
import React, { useState, useEffect,use } from "react";


import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation'
import { set } from "react-hook-form";

// Constants for gold and diamond rates
const GOLD_RATE = 7160;
const DIAMOND_RATE = 110000;


const goldPrices = {
  "18K": 5854,
  "22K": 7160,
  "24K": 7811,
};

const diamondPrices = {
  "IJS": 110000,
  "RJS": 150000,
  "MJS": 180000,
};



const ProductPage = ({ params }) => {
  const [product, setProduct] = useState(null); // Use null initially
  const {id} = use(params);
  const slug = id;
  const [loading, setLoading] = useState(false);

  const router = useRouter()


  useEffect(() => {
    fetch("/products.json")
      .then((response) => response.json())
      .then((jsonData) => {
        const filteredProduct = jsonData.find((item) => item.slug === slug);
        setProduct(filteredProduct);
      })
      .catch((error) => console.error("Error fetching JSON:", error));
  }, [slug]);

  const [selectedGoldType, setSelectedGoldType] = useState("");
  const [selectedGoldWt, setSelectedGoldWt] = useState("");
  const [selectedDiamondType, setSelectedDiamondType] = useState("");
  const [selectedDiaWt, setSelectedDiaWt] = useState("");
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (product) {
      setSelectedGoldType(product["GOLD TYPE"]?.[0] || "");
      setSelectedGoldWt(product["GOLD WT"]?.[0] || "");
      setSelectedDiamondType(product["DIAMOND TYPE"]?.[0] || "");
      setSelectedDiaWt(product["DIA WT"]?.[0] || "");
    }
  }, [product]);

  useEffect(() => {
    setPrice(calculatePrice());
  }, [selectedGoldType, selectedGoldWt, selectedDiamondType, selectedDiaWt]);

  const calculatePrice = () => {
    if (!product) return "0.00";

    const goldWeight = parseFloat(selectedGoldWt) || 0;
    const diamondWeight = parseFloat(selectedDiaWt) || 0;
    const mcValue = parseFloat(product["MC(%)"]) || 0;
    const goldRate = goldPrices[selectedGoldType] || GOLD_RATE;
    const diamondRate = diamondPrices[selectedDiamondType] || DIAMOND_RATE;

    const goldPrice = goldWeight * goldRate;
    const diamondPrice = diamondWeight * diamondRate;

    return (
     goldPrice + diamondPrice + mcValue / 100
    ).toFixed(2);
  };
  



  if (!product) {
    // Optionally render a loading state or placeholder
    return <div className="min-h-screen flex flex-col items-center gap-4 justify-center">
        <div>
            <Loader className="h-12 w-12 animate-spin" />
        </div>
        </div>;
  }



  const addItemToCart = () => {
    setLoading(true);
  
    setTimeout(() => {
      setLoading(false); // Reset loading state after the operation completes
    }, 2000);
  
    // Define the selected product based on the selected options
    const selectedProduct = {
      designNo: product["DESIGN NO"],
      category: product.CATEGORY,
      goldType: selectedGoldType,
      goldWeight: selectedGoldWt,
      diamondType: selectedDiamondType,
      diamondWeight: selectedDiaWt,
      slug: product["slug"],
      price: price, // The calculated price based on the selected options
      quantity: 1
    };
  
    // Retrieve the cart from localStorage, or initialize it as an empty array if null
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    // Ensure that `cart` is treated as an array in case it was not stored as one
    if (!Array.isArray(cart)) {
      localStorage.setItem("cart", JSON.stringify([]));
    }
  
    // Check if the item already exists in the cart
    const itemExists = cart.some(cartItem => 
      cartItem.designNo === selectedProduct.designNo &&
      cartItem.goldType === selectedProduct.goldType &&
      cartItem.diamondType === selectedProduct.diamondType
    );
  
    if (itemExists) {
      // If the item already exists, alert the user
      // alert("Item already added to cart");
      toast.error("Item already added to cart");

      setTimeout(() => {
        router.push('/cart')
        }, 1200);
        
    } else {
            
      // Alert the user that the item has been added to the cart
      // alert("Item added to cart");
      toast.success("Item added to cart");
      setTimeout(() => {
        router.push('/cart')
        }, 1200);
        

      // Add the new product to the cart
      cart.push(selectedProduct);

      // Save the updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));


    }
  
    // Optionally, update the cart count in the UI if you have a cart count element
    updateCartCount(cart);
  };
  
  // Update cart count function (example)
  const updateCartCount = (cart) => {
    const cartCount = cart.length; // Assuming each item is unique in the cart
    // Update the cart count in your app UI
    console.log('Cart Count:', cartCount);
    // You can use state or manipulate the DOM to display the count in the UI
  };
  

  

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="p-2 py-6 md:px-10 lg:p-16  grid grid-cols-1 lg:grid-cols-2 gap-10 w-11/12 mx-auto">
        <div className="bg-white border shadow-lg rounded-lg overflow-hidden aspect-square max-w-sm m-auto">
          <Image
            width={600}
            height={600}
            alt="ecommerce"
            className="aspect-square object-contain"
            src={`/images/products/${product["DESIGN NO"]}.JPG`}          />
        </div>
        <div className=" flex flex-col items-center justify-center lg:items-start lg:justify-start">
          <h2 className="text-sm title-font text-gray-500 tracking-widest">
            {product.CATEGORY}
          </h2>
          <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
            {product["DESIGN NO"]}
          </h1>
          <div className="flex mb-4">
            <span className="flex items-center">
              <svg
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="w-4 h-4 text-indigo-500"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <svg
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="w-4 h-4 text-indigo-500"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <svg
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="w-4 h-4 text-indigo-500"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <svg
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="w-4 h-4 text-indigo-500"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="w-4 h-4 text-indigo-500"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-gray-600 ml-3">4 Reviews</span>
            </span>
          </div>
          <h2 className="text-xl font-semibold">Price: ₹{price}</h2>

          <div className="flex flex-wrap border border-orange-400 rounded-lg w-fit divide-x divide-y  divide-orange-400  overflow-hidden mt-8">
            <div className="p-2 flex-grow text-center">
              <div className="text-xs">Metal</div>
              <div className="text-sm font-medium" id="selected-metal">
                {selectedGoldType} Gold
              </div>
            </div>
            <div className="p-2 flex-grow text-center">
              <div className="text-xs">Gold Wt</div>
              <div className="text-sm font-medium" id="selected-size">
                {selectedGoldWt} gm
              </div>
            </div>
            <div className="p-2 flex-grow text-center">
              <div className="text-xs">Diamond</div>
              <div className="text-sm font-medium" id="selected-diamond">
                {selectedDiamondType}
              </div>
            </div>
            <div className="p-2 flex-grow text-center">
              <div className="text-xs">Diamond Wt</div>
              <div className="text-sm font-medium" id="selected-diamond">
                {selectedDiaWt} ct
              </div>
            </div>
            <div className="bg-yellow-400 flex-grow text-black flex items-center justify-center text-center h-full">
              <Dialog>
                <DialogTrigger className="h-full p-2">
                  <div className="uppercase text-sm h-full font-medium flex items-center justify-center">
                    Customize
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Customize Your Product</DialogTitle>
                  </DialogHeader>

                  <div>
                    <div>
                      <div className="text-sm font-semibold mt-4">
                        Gold Type
                      </div>
                      <div className="flex gap-2 flex-wrap mt-2">
                        {product["GOLD TYPE"].map((goldType, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedGoldType(goldType)}
                            className={`px-4 py-2 border rounded-lg ${
                              selectedGoldType === goldType
                                ? "bg-indigo-400 text-white"
                                : "border-gray-300"
                            }`}
                          >
                            {goldType}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold mt-4">
                        Gold Weight
                      </div>
                      <div className="flex gap-2 flex-wrap mt-2">
                        {product["GOLD WT"].map((goldWt, index) => (
                          <button
                            className={`px-4 py-2 border rounded-lg ${
                              selectedGoldWt === goldWt
                                ? "bg-indigo-400 text-white"
                                : "border-gray-300"
                            }`}
                            key={index}
                            onClick={() => setSelectedGoldWt(goldWt)}
                          >
                            {goldWt} g
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold mt-4">
                        Diamond Type
                      </div>
                      <div className="flex gap-2 flex-wrap mt-2">
                        {product["DIAMOND TYPE"].map((diamondType, index) => (
                          <button
                            className={`px-4 py-2 border rounded-lg ${
                              selectedDiamondType === diamondType
                                ? "bg-indigo-400 text-white"
                                : "border-gray-300"
                            }`}
                            key={index}
                            onClick={() => setSelectedDiamondType(diamondType)}
                          >
                            {diamondType}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold mt-4">
                        Diamond Weight
                      </div>
                      <div className="flex gap-2 flex-wrap mt-2">
                        {product["DIA WT"].map((diaWt, index) => (
                          <button
                            className={`px-4 py-2 border rounded-lg ${
                              selectedDiaWt === diaWt
                                ? "bg-indigo-400 text-white"
                                : "border-gray-300"
                            }`}
                            key={index}
                            onClick={() => setSelectedDiaWt(diaWt)}
                          >
                            {diaWt} ct
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 text-lg font-semibold">
                      Estimated Price: ₹{price}
                    </div>

                    <div className="mt-8">
                    <button onClick={()=>addItemToCart()}
              type="submit"
              disabled={loading} 
              className="flex max-w-xs flex-1 items-center gap-2 justify-center btn uppercase rounded-md add-to-cart-btn py-3 px-8 text-base font-medium text-white "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
              </svg>
             {loading ? (
        <Loader className="size-6 animate-spin" /> 
      ) : (
        ' Add to Cart'
      )}
            </button>
          </div>

                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="mt-8">
            <button onClick={()=>addItemToCart()}
              type="submit"
              disabled={loading} 
              className="flex max-w-xs flex-1 items-center gap-2 justify-center btn uppercase rounded-md add-to-cart-btn py-3 px-8 text-base font-medium text-white "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
              </svg>
             {loading ? (
        <Loader className="size-6 animate-spin" /> 
      ) : (
        ' Add to Cart'
      )}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />

    </section>
  );
};

export default ProductPage;
