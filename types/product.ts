export type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  description?: string;
  images?: { url: string; alt?: string }[];
  brand?: string;
};
