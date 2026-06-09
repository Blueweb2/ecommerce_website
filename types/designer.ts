// ─── Response shape helpers ───────────────────────────────────────────────────

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

// ─── Image & sub-objects ─────────────────────────────────────────────────────

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

// ─── Core Designer type ───────────────────────────────────────────────────────

export type Designer = {
  _id?: string;

  name: string;
  slug?: string;
  description?: string;
  brandName?: string;

  // Business fields
  businessName?: string;
  email?: string;
  phone?: string;
  gstNumber?: string;
  website?: string;

  // Category IDs
  categories?: string[] | { _id: string; name: string; slug?: string }[];

  // Address
  address?: DesignerAddress;

  // Social links
  socialLinks?: DesignerSocialLinks;

  // Brand assets
  avatar?: DesignerImage | null;
  brandImage?: DesignerImage | null;
  bannerImage?: DesignerImage | null;

  // Storefront controls (admin-only)
  isFavorite?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;

  // Admin approval workflow
  isVerified?: boolean;
  verificationStatus?: "pending" | "approved" | "rejected";

  // Profile completion
  profileCompleted?: boolean;

  createdAt?: string;
  updatedAt?: string;
};

// ─── Admin create payload (minimal) ──────────────────────────────────────────

export type AdminCreateDesignerPayload = {
  name: string;
  email: string;
  password: string;
};

// ─── Designer profile update payload (all content fields) ────────────────────

export type DesignerProfilePayload = {
  brandName?: string;
  description?: string;

  businessName?: string;
  phone?: string;
  gstNumber?: string;
  website?: string;

  categories?: string[];
  address?: DesignerAddress;
  socialLinks?: DesignerSocialLinks;

  avatar?: DesignerImage;
  brandImage?: DesignerImage;
  bannerImage?: DesignerImage;
};

// ─── Admin storefront payload ─────────────────────────────────────────────────

export type AdminStorefrontPayload = {
  isFeatured?: boolean;
  isFavorite?: boolean;
  isActive?: boolean;
};

// ─── Legacy DesignerPayload (backward compat) ─────────────────────────────────

export type DesignerPayload = DesignerProfilePayload & {
  name?: string;
  email?: string;
  isFavorite?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
};

// ─── Zustand Store Types ──────────────────────────────────────────────────────

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
  recentOrders: any[];
  topProducts: any[];
  lowStockProducts: any[];
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