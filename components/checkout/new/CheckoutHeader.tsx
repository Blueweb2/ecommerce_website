import Link from "next/link";

export default function CheckoutHeader() {
  return (
    <header className="border-b border-[#1d1d1d] bg-black text-white">
      <div className="flex h-[72px] items-center justify-between px-6 lg:px-10">

        <span className="text-[13px] uppercase tracking-[0.2em]">
          Secure
        </span>

        <Link href="/">
          <div className="font-brand-serif cursor-pointer text-2xl lg:text-3xl font-semibold tracking-wide text-white">
            <img
              src="/home/navigation/zenfaz.svg"
              alt="logo"
              className="h-4 lg:h-7 mb-2 mt-3"
            />
          </div>
        </Link>

        <div className="w-[60px]" />
      </div>
    </header>
  );
}