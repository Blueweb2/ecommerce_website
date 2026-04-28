export type CategoryImage = {
  url: string;
  public_id: string;
  altText?: string;
};

export type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: CategoryImage;
  parent?: string | null;
  level: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
