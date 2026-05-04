export type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  description?: string;
  deliveryDetails?: string;
  keyFeatures?: string[];
  images?: { url: string; alt?: string }[];
  brand?: string;
  category?: any;
  sections?: string[];
  isOnSale?: boolean;
  gstPercentage?: number;
};
