

export type DesignerWithProductsResponse =
  | Designer
  | {
      success?: boolean;
      designer?: Designer;
      products?: unknown[];
      data?:
        | Designer
        | {
            designer?: Designer;
            products?: unknown[];
          };
    };

export type DesignerListResponse =
  | Designer[]
  | {
      success?: boolean;
      designers?: Designer[];
      data?:
        | Designer[]
        | {
            designers?: Designer[];
          };
    };

export type DesignerDetailResponse =
  | Designer
  | {
      success?: boolean;
      designer?: Designer;
      data?:
        | Designer
        | {
            designer?: Designer;
          };
    };




export type DesignerImage = {
  url: string;
  public_id: string;
  alt?: string;
  altText?: string;
};

export type DesignerAddress = {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  pincode?: string;
};

export type DesignerSocialLinks = {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  pinterest?: string;
  twitter?: string;
};

export type Designer = {
  _id?: string;

  name: string;
  slug?: string;
  description?: string;
  brandName: string;

  // NEW BUSINESS FIELDS
  businessName?: string;
  email?: string;
  phone?: string;
  gstNumber?: string;
  website?: string;

  // CATEGORY IDS
  categories?: string[];

  // ADDRESS
  address?: DesignerAddress;

  // SOCIAL LINKS
  socialLinks?: DesignerSocialLinks;

  avatar?: DesignerImage | null;
  brandImage?: DesignerImage | null;
  bannerImage?: DesignerImage | null;

  isFavorite?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
};

export type DesignerPayload = {
  name: string;
  description: string;
  brandName: string;

  businessName?: string;
  email?: string;
  phone?: string;
  gstNumber?: string;
  website?: string;

  categories?: string[];

  address?: DesignerAddress;

  socialLinks?: DesignerSocialLinks;

  avatar?: DesignerImage;
  brandImage?: DesignerImage;
  bannerImage?: DesignerImage;

  isFavorite?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
};

// Phase 14 - New Store Types

export interface DesignerAuthTypes {
  designer: Designer | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface DesignerDashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeCoupons: number;
  recentOrders: any[]; // Or order type
  topProducts: any[]; // Or product type
  lowStockProducts: any[]; // Or product type
}

export interface DesignerDashboardTypes {
  stats: DesignerDashboardStats | null;
  loading: boolean;
  error: string | null;
}

export interface DesignerProductTypes {
  products: any[];
  currentProduct: any | null;
  loading: boolean;
  error: string | null;
}

export interface DesignerOrderTypes {
  orders: any[];
  currentOrder: any | null;
  loading: boolean;
  error: string | null;
}

export interface DesignerCouponTypes {
  coupons: any[];
  currentCoupon: any | null;
  loading: boolean;
  error: string | null;
}

export interface DesignerAnalyticsData {
  revenueTrend: { date: string; revenue: number }[];
  ordersTrend: { date: string; orders: number }[];
  topProducts: any[];
  categoryPerformance: any[];
}

export interface DesignerAnalyticsTypes {
  data: DesignerAnalyticsData | null;
  loading: boolean;
  error: string | null;
}