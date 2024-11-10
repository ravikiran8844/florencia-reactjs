"use client";
import { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "lucide-react";
import Script from 'next/script'
import { redirect } from "next/navigation";
import local from "next/font/local";
import Image from "next/image";

const deliveryMethods = [
  { id: 1, title: "Standard", turnaround: "4–10 business days", price: "₹40" },
  { id: 2, title: "Express", turnaround: "2–5 business days", price: "₹100" },
];
const paymentMethods = [{ id: "razor-pay", title: "Razor pay" }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function CheckoutSection() {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(deliveryMethods[0]);
  const [currency, setCurrency] = useState('INR');
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [email, setEmail] = useState("");
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    country: "India",
    region: "",
    postalCode: "",
    phone: "",
  });

  useEffect(() => {
    // Load cart items from localStorage
    const storedCartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCartItems);

    // Calculate total
    const calculateTotal = storedCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
    setTotal(calculateTotal);
  }, []);




  const updateQuantity = (id, newQuantity) => {
    const updatedCart = cartItems.map((item) =>
      item.designNo === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Update total
    const updatedTotal = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
    setTotal(updatedTotal);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.designNo !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const updatedTotal = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(updatedTotal);
  };

  const handlePayNowClick = (event) => {
    event.preventDefault();
    const checkoutData = {
      email,
      shippingInfo,
      deliveryMethod: selectedDeliveryMethod,
      paymentMethod: "Razor pay", // As we only have one payment option for now
      cartItems,
      totalPrice: total,
    };
    payNow();
    
    console.log(checkoutData); // This will log the checkout data
  };


  const payNow = async () => {
    try {
      const orderId = await createOrderId();
      const options = {
       key: process.env.key_id,
       amount: parseFloat(total) * 100,
       currency: currency,
       name: shippingInfo.firstName + " " + shippingInfo.lastName,
       description: 'description',
       order_id: orderId,
       handler: async function (response) {
        const data = {
         orderCreationId: orderId,
         razorpayPaymentId: response.razorpay_payment_id,
         razorpayOrderId: response.razorpay_order_id,
         razorpaySignature: response.razorpay_signature,
        };
   
        const result = await fetch('/api/verify-payment', {
         method: 'POST',
         body: JSON.stringify(data),
         headers: { 'Content-Type': 'application/json' },
        });
        const res = await result.json();
        if (res.isOk) {
          // alert("payment succeed");
          setCartItems([]);
          localStorage.setItem('cart', JSON.stringify([]));
          redirect('/payment-success');
        }
        else {
         alert(res.message);
        }
       },
       prefill: {
        name: shippingInfo.name,
        email: email,
       },
       theme: {
        color: '#3399cc',
       },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
       alert(response.error.description);
      });
      paymentObject.open();
     } catch (error) {
      console.log(error);
     }
  }
  const createOrderId = async () => {
    try {
     const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
       'Content-Type': 'application/json',
      },
      body: JSON.stringify({
       amount: parseFloat(total)*100,
      })
     });
  
     if (!response.ok) {
      throw new Error('Network response was not ok');
     }
  
     const data = await response.json();
     return data.orderId;
    } catch (error) {
     console.error('There was a problem with your fetch operation:', error);
    }
   };


  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else {
      setShippingInfo({
        ...shippingInfo,
        [name]: value,
      });
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Checkout</h2>

        <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16" onSubmit={handlePayNowClick}>
          <div>
          <h2 className="text-lg font-medium text-gray-900">Contact information</h2>

          <div className="mt-4 border-t border-gray-200 pt-6">
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      required
                      id="email"
                      name="email"
                      value={email} // Bind to state
                      onChange={handleInputChange} // Update state on change
                      autoComplete="email"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    
                  </div>
                </div>
         

            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      placeholder="Enter your first name"
                      required
                      id="firstName"
                      name="firstName"
                      value={shippingInfo.firstName} // Bind to state
                      onChange={handleInputChange} // Update state on change
                      autoComplete="given-name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      placeholder="Enter your last name"
                      required
                      value={shippingInfo.lastName} // Bind to state
                      onChange={handleInputChange} // Update state on change

                      id="lastName"
                      name="lastName"
                      autoComplete="family-name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

              

                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <div className="mt-1">
                    <input
                      placeholder="Enter your address"
                      required
                      value={shippingInfo.address} // Bind to state
                      onChange={handleInputChange} // Update state on change
                      type="text"
                      name="address"
                      id="address"
                      autoComplete="street-address"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">
                    Apartment, suite, etc.
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      placeholder="Enter your apartment, suite, etc"
                      required
                      value={shippingInfo.apartment} // Bind to state
                      onChange={handleInputChange} // Update state on change
                      name="apartment"
                      id="apartment"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      placeholder="Enter your city"
                      required

                      value={shippingInfo.city} // Bind to state
                      onChange={handleInputChange} // Update state on change
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="address-level2"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <div className="mt-1">
                    <select
                      id="country"
                      placeholder="Enter your country"
                      required
                      name="country"
                      value={shippingInfo.country} // Bind to state
                      onChange={handleInputChange} // Update state on change
                      autoComplete="country-name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option>India</option>
               
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="region"
                      placeholder="Enter your state"
                      required
                      value={shippingInfo.region} // Bind to state
                      onChange={handleInputChange} // Update state on change
                      id="region"
                      autoComplete="address-level1"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                    Postal code
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      placeholder="Enter your postal code"
                      required
                      name="postalCode"
                      id="postalCode"
                      value={shippingInfo.postalCode} // Bind to state
                      onChange={handleInputChange} // Update state on change
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      value={shippingInfo.phone} // Bind to state
                      onChange={handleInputChange} // Update state on change
                      placeholder="Enter your phone number"
                      required
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <RadioGroup value={selectedDeliveryMethod} onChange={setSelectedDeliveryMethod}>
                <RadioGroup.Label className="text-lg font-medium text-gray-900">Delivery method</RadioGroup.Label>

                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  {deliveryMethods.map((deliveryMethod) => (
                    <RadioGroup.Option
                      key={deliveryMethod.id}
                      value={deliveryMethod}
                      className={({ checked, active }) =>
                        classNames(
                          checked ? 'border-transparent' : 'border-gray-300',
                          active ? 'ring-2 ring-indigo-500' : '',
                          'relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none'
                        )
                      }
                    >
                      {({ checked, active }) => (
                        <>
                          <span className="flex flex-1">
                            <span className="flex flex-col">
                              <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                                {deliveryMethod.title}
                              </RadioGroup.Label>
                              <RadioGroup.Description
                                as="span"
                                className="mt-1 flex items-center text-sm text-gray-500"
                              >
                                {deliveryMethod.turnaround}
                              </RadioGroup.Description>
                              <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-gray-900">
                                {deliveryMethod.price}
                              </RadioGroup.Description>
                            </span>
                          </span>
                          {checked ? <CheckCircleIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" /> : null}
                          <span
                            className={classNames(
                              active ? 'border' : 'border-2',
                              checked ? 'border-indigo-500' : 'border-transparent',
                              'pointer-events-none absolute -inset-px rounded-lg'
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Payment */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">Payment</h2>

              <fieldset className="mt-4">
                <legend className="sr-only">Payment type</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                  {paymentMethods.map((paymentMethod, paymentMethodIdx) => (
                    <div key={paymentMethod.id} className="flex items-center">
                      {paymentMethodIdx === 0 ? (
                        <input
                          id={paymentMethod.id}
                          name="payment-type"
                          type="radio"
                          defaultChecked
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      ) : (
                        <input
                          id={paymentMethod.id}
                          name="payment-type"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      )}

                      <label htmlFor={paymentMethod.id} className="ml-3 block text-sm font-medium text-gray-700">
                        {paymentMethod.title}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>

             
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
              <h3 className="sr-only">Items in your cart</h3>
              <ul role="list" className="divide-y divide-gray-200">
                {cartItems.map((product) => (
                  <li key={product.designNo} className="flex py-6 px-4 sm:px-6">
                    <div className="flex-shrink-0">
                      <Image width={100} height={100} src={`/images/products/${product.designNo}.JPG`} alt={product.imageAlt} className="w-20 rounded-md" />
                    </div>

                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm">
                            <a href={product.slug} className="font-medium text-gray-700 hover:text-gray-800">
                              {product.designNo}
                            </a>
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">Gold Type:{product.goldType}</p>
                          <p className="mt-1 text-sm text-gray-500">Gold Wt:{product.goldWeight}</p>
                          <p className="mt-1 text-sm text-gray-500">Diamond Type:{product.diamondType}</p>
                          <p className="mt-1 text-sm text-gray-500">Gold Type:{product.diamondWeight}</p>

                        </div>

                        <div className="ml-4 flow-root flex-shrink-0">
                          <button
                            type="button"
                            className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
                            onClick={() => removeItem(product.designNo)}
                          >
                            <span className="sr-only">Remove</span>
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-1 items-end justify-between pt-2">
                        <p className="mt-1 text-sm font-medium text-gray-900">₹{product.price}</p>

                        <div className="ml-4">
                          <label htmlFor="quantity" className="sr-only">
                            Quantity
                          </label>
                          <select
                            id="quantity"
                            name="quantity"
                            value={product.quantity}
                            onChange={(e) => updateQuantity(product.designNo, parseInt(e.target.value))}
                            className="rounded-md border border-gray-300 text-left"
                          >
                            {[1, 2, 3, 4, 5].map((qty) => (
                              <option key={qty} value={qty}>
                                {qty}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>₹{total}</p>
                </div>
                <div className="mt-6">
                <button
              type="submit"
              disabled={total>0 ? false : true}
              className="mt-10 w-full py-3 px-4 bg-indigo-600 text-white font-medium text-lg rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Pay Now
            </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Script
    id="razorpay-checkout-js"
    src="https://checkout.razorpay.com/v1/checkout.js"
   />

    </div>
  );
}