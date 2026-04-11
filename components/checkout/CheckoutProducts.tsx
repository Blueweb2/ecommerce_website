"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import CheckoutAddress from "./CheckoutAddress";

export default function CheckoutProducts() {

  const [selected, setSelected] = useState("standard");

  return (
    <section className="bg-[#f4f7e3] pt-5 mb-44">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <div className="w-full flex flex-col justify-center items-center pr-5 pb-5">

          {/* PAYMENT ICONS */}
          <div className="relative w-full border-b pb-7">
            <h3 className="text-center pb-3">Express checkout</h3>
            <div className="flex w-full items-center justify-between gap-3" >
              <img
                src='/checkout/google-pay.png'
                alt=""
                className="w-full h-8 object-contain bg-white rounded-[5px]"
              >
              </img>
              <img
                src='/checkout/apple-pay.png'
                alt=""
                className="w-full h-8 object-contain bg-black rounded-[5px]"
              >
              </img>
              <img
                src='/checkout/pay-pal.png'
                alt=""
                className="w-full h-8 object-contain bg-white rounded-[5px]"
              >
              </img>
              <img
                src='/checkout/shop-pay.png'
                alt=""
                className="w-full h-8 object-contain bg-white rounded-[5px]"
              >
              </img>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#f4f7e3] px-5">OR</div>
          </div>

          {/* CONTACT(EMAIL) SECTION */}
          <div className="flex flex-col w-full mt-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[19px]">Contact</h3>
              <button>SIGN IN</button>
            </div>
            <input type="email" placeholder="Email" className="text-black py-2 px-4 bg-white mt-3 rounded-[5px] border-2 border-gray-200 outline-none" />
            <div className="flex pl-1.5 mt-2">
              <input type="checkbox" className="scale-200 mr-6"/>
              <p>Email me with news and offers</p>
            </div>
          </div>

          {/* DELIVERY DETAILS SECTION */}
          {/* <div className="w-full mt-6">
            <h3 className="font-bold text-[19px]">Delivery</h3>
            <div className="relative">
              <p className="absolute left-5 mt-1.5 text-xs text-gray-400">Country/Region</p>
              <select name="" id="" className="w-full rounded-[5px] border-2 border-gray-200 outline-none bg-white pt-6 px-4">
                <option value="">India</option>
                <option value="">UAE</option>
                <option value="">Saudi</option>
              </select>
            </div> */}

            {/* FIRST NAME AND LAST NAME SECTION */}
            {/* <div className="flex gap-3">
              <input type="text" placeholder="First Name" className="text-black py-2 px-4 bg-white mt-3 rounded-[5px] border-2 border-gray-200 outline-none w-full" />
              <input type="text" placeholder="Last Name" className="text-black py-2 px-4 bg-white mt-3 rounded-[5px] border-2 border-gray-200 outline-none w-full" />
            </div>

            <div className="relative mt-3">
              <input type="text" placeholder="Address" className="text-black py-2 px-4 bg-white  rounded-[5px] border-2 border-gray-200 outline-none w-full" />
              <Search className=" text-gray-200 absolute right-3 top-1/2 -translate-y-1/2" />
            </div> */}

            {/* <input type="text" placeholder="Apartment, suite, unit, etc.(Optional)" className="text-black py-2 px-4 bg-white  rounded-[5px] border-2 border-gray-200 outline-none w-full mt-3" />

            <div className="flex gap-3">
              <input type="text" placeholder="City" className="text-black py-2 px-4 bg-white mt-3 rounded-[5px] border-2 border-gray-200 outline-none w-full" />
              <select name="" id="" className="w-full mt-3 rounded-[5px] border-2 border-gray-200 bg-white outline-none">
                <option value="">India</option>
                <option value="">UAE</option>
                <option value="">Saudi</option>
              </select>
              <input type="text" placeholder="Zip Code" className="text-black py-2 px-4 bg-white mt-3 rounded-[5px] border-2 border-gray-200 outline-none w-full" />
            </div> */}

            {/* <div className="flex pl-1.5 mt-2">
              <input type="checkbox" className="scale-200 mr-6 "/>
              <p>Text me with news and offers</p>
            </div> */}

            <CheckoutAddress />

          {/* </div> */}

          {/* SHIPPING METHOD */}
          <div className="flex flex-col w-full mt-6">

            {/* HEADING */}
            <h3 className="font-bold text-[19px]">SHIPPING METHOD</h3>

            {/* FIRST OPTION */}
            <div
              onClick={() => setSelected("standard")}
              className={`flex items-center justify-between border px-3 py-3 rounded-t-[9px] cursor-pointer 
              ${selected === "standard" ? "border-black" : "border-gray-300"}`}
            >
              <div className="flex gap-3">
                <input
                  type="radio"
                  name="shipping"
                  checked={selected === "standard"}
                  onChange={() => setSelected("standard")}
                  className="accent-black scale-150"
                />
                <div className="flex flex-col">
                  <h3 className="font-semibold">Standard Shipping</h3>
                  <p className="font-extralight">4 Business days</p>
                </div>
              </div>
              <p className="text-red-500">FREE</p>
            </div>

            {/* SECOND OPTION */}
            <div
              onClick={() => setSelected("express")}
              className={`flex items-center justify-between border px-3 py-3 rounded-b-[9px] cursor-pointer 
              ${selected === "express" ? "border-black" : "border-gray-300"}`}
            >
              <div className="flex gap-3">
                <input
                  type="radio"
                  name="shipping"
                  checked={selected === "express"}
                  onChange={() => setSelected("express")}
                  className="accent-black scale-150"
                />
                <div className="flex flex-col">
                  <h3 className="font-semibold">Express Shipping</h3>
                  <p className="font-extralight">2 Business days</p>
                </div>
              </div>
              <p className="text-red-500">$10</p>
            </div>

          </div>

          {/* PAYMENT SECTION */}
           <div className="flex flex-col w-full mt-6">

              {/* HEADING */}
              <h3 className="font-bold text-[19px] mt-3">Payment</h3>
              <p>All transactions are secure and encrypted.</p>

              <div
                className="flex items-center justify-between border px-3 py-4 rounded-t-[9px] border-black"
              >
                <div className="flex gap-3">
                  <input
                    type="radio"
                    className="accent-black scale-150"
                  />
                  <div className="flex flex-col">
                    <h3 className="font-semibold">Credit card</h3>
                  </div>
                </div>

                <div className="flex gap-3">
                  <img src="/home/footer/visa.png" alt="" />
                  <img src="/home/footer/master.png" alt="" />
                  <img src="/checkout/amex.png" alt="" />
                </div>

              </div>

              <div className="flex flex-col  border border-gray-300 p-4 bg-gray-100">

                <input type="password" placeholder="Card Number" className="text-black py-2 px-4 bg-white mt-3 rounded-[5px] border-2 border-gray-200 outline-none" />

                <div className="flex gap-3">
                  <input type="date" placeholder="Expiration Date (mm/yy)" className="text-black py-2 px-4 bg-white mt-3 rounded-[5px] border-2 border-gray-200 outline-none w-full" />
                  <input type="password" placeholder="Security Code" className="text-black py-2 px-4 bg-white mt-3 rounded-[5px] border-2 border-gray-200 outline-none w-full" />
                </div>

                <input type="text" placeholder="Name on Card" className="text-black py-2 px-4 bg-white mt-3 rounded-[5px] border-2 border-gray-200 outline-none" />

                <div className="flex pl-1.5 mt-2">
                  <input type="checkbox" className="scale-200 mr-6 "/>
                  <p>Text me with news and offers</p>
                </div>

              </div>

              <div className="flex flex-col w-full border border-gray-300 rounded-b-[9px]">
                <div
                  className='flex items-center justify-between px-3 py-3 cursor-pointer'
                >
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      className="accent-black scale-150"
                    />
                    <div className="flex flex-col">
                      <h3 className="font-semibold">Shop Pay</h3>
                    </div>
                  </div>
                  <p className="text-red-500">FREE</p>
                </div>

                <div
                  className='flex items-center justify-between px-3 py-3 cursor-pointer'
                >
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      className="accent-black scale-150"
                    />
                    <div className="flex flex-col">
                      <h3 className="font-semibold">PayPal</h3>
                    </div>
                  </div>
                  <p className="text-red-500">FREE</p>
                </div>

              </div>

           </div>

          
              
        </div>



        <div className="border w-full">

        </div>

      </div>
    </section>
  );

}