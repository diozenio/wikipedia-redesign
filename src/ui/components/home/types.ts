export type FeaturedArticleThumbnail = {
  src: string;
  width: number;
  height: number;
};

export type FeaturedArticleData = {
  slug: string;
  title: string;
  description: string | null;
  excerpt: string;
  thumbnail: FeaturedArticleThumbnail | null;
  views: number | null;
};

export type FeaturedFeedData = {
  date: string;
  articles: FeaturedArticleData[];
};
