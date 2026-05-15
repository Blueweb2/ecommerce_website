export type DesignerImage = {
  url: string;
  public_id: string;
  alt?: string;
  altText?: string;
};

export type Designer = {
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  brandName: string;
  avatar?: DesignerImage | null;
  brandImage?: DesignerImage | null;
  bannerImage?: DesignerImage | null;
  isFavorite?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

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

export type DesignerPayload = {
  name: string;
  description: string;
  brandName: string;
  avatar?: DesignerImage;
  brandImage?: DesignerImage;
  bannerImage?: DesignerImage;
  isFavorite?: boolean;
  isActive?: boolean;
};
