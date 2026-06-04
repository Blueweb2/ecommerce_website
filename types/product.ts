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
  designer?: any; 
  sections?: string[];
  isOnSale?: boolean;
  gstPercentage?: number;
  stock: number; 
  
  isFabric?: boolean;
  unit?: string;
  minOrderQty?: number;
  stepQty?: number;

  customizable?: {
    isCustomizable: boolean;
    fields: {
      name: string;
      type: "text" | "number" | "select";
      required?: boolean;
      options?: string[];
      unit?: string;
    }[];
  };
};
