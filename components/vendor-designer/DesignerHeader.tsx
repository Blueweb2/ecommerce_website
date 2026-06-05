"use client";

import { Bell, Menu, Search } from "lucide-react";
import Image from "next/image";

interface DesignerHeaderProps {
  onMenuClick?: () => void;
}

export default function DesignerHeader({
  onMenuClick,
}: DesignerHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="flex items-center justify-between px-6 h-16">
        
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>

          <h1 className="text-lg font-semibold text-gray-800">
            Designer Dashboard
          </h1>
        </div>

        {/* Center Search */}
        <div className="hidden md:flex items-center relative w-full max-w-md mx-8">
          <Search
            size={18}
            className="absolute left-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search products, orders..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100">
            <Bell size={20} />

            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Designer Profile */}
          <button className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-xl transition">
            <Image
              src="/avatar-placeholder.png"
              alt="Designer"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />

            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800">
                Designer Name
              </p>

              <p className="text-xs text-gray-500">
                Fashion Designer
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}