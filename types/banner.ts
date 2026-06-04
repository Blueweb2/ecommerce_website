export interface BannerImage {
  url: string;
  public_id: string;
}

export interface Banner {
  _id: string;
  title?: string;
  image: BannerImage;
  link?: string;
  position: "hero" | "center" | "rightTop" | "rightBottom";
  order?: number;
}
export interface BannerGrouped {
  hero: Banner[];
  center: Banner | null;
  rightTop: Banner | null;
  rightBottom: Banner | null;
}