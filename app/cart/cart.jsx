"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';




export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const handleQuantityChange = (designNo, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item.designNo === designNo ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (designNo) => {
    const updatedCart = cart.filter((item) => item.designNo !== designNo);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateSubtotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <header className="text-center">
            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">Cart</h1>
          </header>

          {cart.length > 0 ? (
            <div className="mt-8">
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={item.designNo} className="flex items-center gap-4 border-t py-2">
                  <Link href={`/product/${item.designNo}`}>
                  <Image
                      width={200}
                      height={200}
                      src={`/images/products/${item.designNo}.JPG`}
                      alt={item.designNo}
                      className="w-16 h-16 rounded object-cover"
                    />
                  </Link>
                    <div>
                      <Link href={`/product/${item.designNo}`}>
                      <h3 className="text-sm text-gray-900">{item.designNo}</h3>
                      </Link>
                      <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                        <div>
                          <dt className="inline">Diamond Weight:</dt>
                          <dd className="inline">{item.diamondWeight}</dd>
                        </div>
                        <div>
                          <dt className="inline">Gold Type:</dt>
                          <dd className="inline">{item.goldType}</dd>
                        </div>
                        <div>
                          <dt className="inline">Gold Weight:</dt>
                          <dd className="inline">{item.goldWeight}</dd>
                        </div>
                        <div>
                          <dt className="inline">Price:</dt>
                          <dd className="inline">{item.price}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="flex flex-1 items-center justify-end gap-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.designNo, parseInt(e.target.value))}
                        className="h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600"
                      />
                      <button
                        onClick={() => handleRemoveItem(item.designNo)}
                        className="text-gray-600 transition hover:text-red-600"
                      >
                        <span className="sr-only">Remove item</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                <div className="w-screen max-w-lg space-y-4">
                  <dl className="space-y-0.5 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <dt>Subtotal</dt>
                      <dd>₹{calculateSubtotal()}</dd>
                    </div>
                    <div className="flex justify-between !text-base font-medium">
                      <dt>Total</dt>
                      <dd>₹{calculateSubtotal()}</dd>
                    </div>
                  </dl>

                  <div className="flex justify-end">
                    <Link
                      href="/checkout"
                      className="block rounded px-5 py-3 text-sm main-btn text-white uppercase"
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center mt-5 text-lg">
              <div className="flex justify-center my-6">
                <Image src="/empty-cart.svg" alt="empty cart" width={200} height={200} />
              </div>
              <p>Your cart is empty</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
