// Story section layout types
export type SectionLayout = "image-left" | "image-right" | "full-image" | "text";

export type StoryImage = {
  url: string;
  public_id: string;
  alt?: string;
  altText?: string;
};

export type StorySection = {
  _id?: string;
  layout: SectionLayout;
  heading?: string;
  content?: string;
  image?: StoryImage;
  caption?: string;
  products?: string[]; // ObjectIds when editing, full product objects when fetched
  order: number;
};

export type Story = {
  _id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  author?: string;
  publishDate?: string;
  featured?: boolean;
  heroImage?: StoryImage | null;
  sections?: StorySection[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Legacy (kept for backward-compat, will be removed after migration)
  description?: string;
  category?: string;
  image?: StoryImage | null;
};

export type StoryPayload = {
  title: string;
  excerpt?: string;
  author?: string;
  publishDate?: string;
  featured?: boolean;
  heroImage?: StoryImage;
  sections?: StorySection[];
  isActive: boolean;
};

export type StoryFieldErrors = Partial<
  Record<"title" | "excerpt" | "heroImage" | "sections", string>
>;
