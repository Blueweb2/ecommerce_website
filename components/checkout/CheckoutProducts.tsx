import { Search } from "lucide-react";

export default function CheckoutProducts() {
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
          <div className="w-full mt-6">
            <h3 className="font-bold text-[19px]">Delivery</h3>
            <div className="relative">
              <p className="absolute left-5 mt-1.5 text-xs text-gray-400">Country/Region</p>
              <select name="" id="" className="w-full rounded-[5px] border-2 border-gray-200 outline-none bg-white pt-6 px-4">
                <option value="">India</option>
                <option value="">UAE</option>
                <option value="">Saudi</option>
              </select>
            </div>

            {/* FIRST NAME AND LAST NAME SECTION */}
            <div className="flex gap-3">
              <input type="text" placeholder="First Name" className="text-black py-2 px-4 bg-white mt-3 rounded-[5px] border-2 border-gray-200 outline-none w-full" />
              <input type="text" placeholder="Last Name" className="text-black py-2 px-4 bg-white mt-3 rounded-[5px] border-2 border-gray-200 outline-none w-full" />
            </div>

            <div className="relative mt-3">
              <input type="text" placeholder="Address" className="text-black py-2 px-4 bg-white  rounded-[5px] border-2 border-gray-200 outline-none w-full" />
              <Search className=" text-gray-200 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            <input type="text" placeholder="Apartment, suite, unit, etc.(Optional)" className="text-black py-2 px-4 bg-white  rounded-[5px] border-2 border-gray-200 outline-none w-full mt-3" />

            <div className="flex gap-3">
              <input type="text" placeholder="City" className="text-black py-2 px-4 bg-white mt-3 rounded-[5px] border-2 border-gray-200 outline-none w-full" />
              <select name="" id="" className="w-full mt-3 rounded-[5px] border-2 border-gray-200 bg-white outline-none">
                <option value="">India</option>
                <option value="">UAE</option>
                <option value="">Saudi</option>
              </select>
              <input type="text" placeholder="Zip Code" className="text-black py-2 px-4 bg-white mt-3 rounded-[5px] border-2 border-gray-200 outline-none w-full" />
            </div>

            <div className="flex pl-1.5 mt-2">
              <input type="checkbox" className="scale-200 mr-6 "/>
              <p>Email me with news and offers</p>
            </div>

          </div>

          {/* DELIVERY DETAILS SECTION */}
          <div className="flex flex-col w-full border rounded-[7px] mt-3 px-3">

            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <input type="radio" name="shipping" className=" accent-black scale-150" />
                <div className="flex flex-col">
                  <h3 className="font-semibold">Standard Shipping</h3>
                  <p className="font-extralight">4 Business days</p>
                </div>
              </div>
              <p className="text-red-500">FREE</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <input type="radio" name="shipping" className=" accent-black scale-150" />
                <div className="flex flex-col">
                  <h3 className="font-semibold">Standard Shipping</h3>
                  <p className="font-extralight">4 Business days</p>
                </div>
              </div>
              <p className="text-red-500">FREE</p>
            </div>
          </div>
          
           
        </div>



        <div className="border  w-full">

        </div>

      </div>
    </section>
  );

}