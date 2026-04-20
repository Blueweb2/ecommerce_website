"use client";

import { useEffect, useState } from "react";
import BannerForm from "@/components/admin/banner/BannerForm";
import BannerList from "@/components/admin/banner/BannerList";
import { getBanners } from "@/lib/api/admin/banner.api";

export default function BannerPage() {
  const [banners, setBanners] = useState<any>(null);

  const fetchBanners = async () => {
    const data = await getBanners();
    setBanners(data);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="p-6 space-y-6">
      
      {/* FORM */}
      <BannerForm onSuccess={fetchBanners} />

      {/* LIST */}
      {banners && (
        <BannerList banners={banners} refresh={fetchBanners} />
      )}
    </div>
  );
}