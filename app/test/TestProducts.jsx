"use client";
import React, { useState } from "react";

const TestProducts = () => {
   // Sample JSON data
   const productData = {
    "Product Title": "03-11417(2)",
    "DESIGN NO": "03-11417(2)",
    slug: "03-11417-2",
    "DIAMOND TYPE": ["IJ-SI", "VVS1", "IF"],
    "GOLD WT": ["1.5", "2.5", "3.5", "4.5"],
    "GOLD TYPE": ["14KT", "18KT", "22KT"],
    "DIA WT": ["0.396", "0.496", "0.596"],
    "MC(%)": 30,
    "DIA PCS": 25,
    CATEGORY: "PENDANT SET",
  };

  // State for user selections
  const [selectedGoldType, setSelectedGoldType] = useState("14KT");
  const [selectedGoldWeight, setSelectedGoldWeight] = useState("1.5");
  const [selectedDiamondType, setSelectedDiamondType] = useState("IJ-SI");
  const [selectedDiamondWeight, setSelectedDiamondWeight] = useState("0.396");

  // Prices per type (for example purposes)
  const goldPrices = {
    "14KT": 5000,
    "18KT": 6200,
    "22KT": 7000,
  };

  const diamondPrices = {
    "IJ-SI": 110000,
    VVS1: 150000,
    IF: 180000,
  };

  // Calculate Price
  const calculatePrice = () => {
    const goldPrice = goldPrices[selectedGoldType];
    const diamondPrice = diamondPrices[selectedDiamondType];
    const makingCharge = productData["MC(%)"];

    const goldCost = parseFloat(selectedGoldWeight) * goldPrice;
    const diamondCost = parseFloat(selectedDiamondWeight) * diamondPrice;
    const makingChargeCost = (goldCost * makingCharge) / 100;

    return goldCost + diamondCost + makingChargeCost;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{productData["Product Title"]}</h1>
      <p className="text-gray-600 mb-2">{productData.CATEGORY}</p>

      {/* Gold Type */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Gold Type</h2>
        <div className="flex gap-4">
          {productData["GOLD TYPE"].map((goldType) => (
            <label key={goldType} className="flex items-center space-x-2">
              <input
                type="radio"
                name="goldType"
                value={goldType}
                checked={selectedGoldType === goldType}
                onChange={() => setSelectedGoldType(goldType)}
                className="h-4 w-4 text-blue-600"
              />
              <span>{goldType}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gold Weight */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Gold Weight (g)</h2>
        <div className="flex gap-4">
          {productData["GOLD WT"].map((weight) => (
            <label key={weight} className="flex items-center space-x-2">
              <input
                type="radio"
                name="goldWeight"
                value={weight}
                checked={selectedGoldWeight === weight}
                onChange={() => setSelectedGoldWeight(weight)}
                className="h-4 w-4 text-blue-600"
              />
              <span>{weight}g</span>
            </label>
          ))}
        </div>
      </div>

      {/* Diamond Type */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Diamond Type</h2>
        <div className="flex gap-4">
          {productData["DIAMOND TYPE"].map((diamondType) => (
            <label key={diamondType} className="flex items-center space-x-2">
              <input
                type="radio"
                name="diamondType"
                value={diamondType}
                checked={selectedDiamondType === diamondType}
                onChange={() => setSelectedDiamondType(diamondType)}
                className="h-4 w-4 text-blue-600"
              />
              <span>{diamondType}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Diamond Weight */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Diamond Weight (ct)</h2>
        <div className="flex gap-4">
          {productData["DIA WT"].map((weight) => (
            <label key={weight} className="flex items-center space-x-2">
              <input
                type="radio"
                name="diamondWeight"
                value={weight}
                checked={selectedDiamondWeight === weight}
                onChange={() => setSelectedDiamondWeight(weight)}
                className="h-4 w-4 text-blue-600"
              />
              <span>{weight}ct</span>
            </label>
          ))}
        </div>
      </div>

      {/* Total Price */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold">
          Total Price: ₹{calculatePrice().toFixed(2)}
        </h2>
      </div>
    </div>
  );
};

export default TestProducts