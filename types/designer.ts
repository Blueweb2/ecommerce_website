

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