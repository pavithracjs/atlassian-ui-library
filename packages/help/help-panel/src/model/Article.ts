export interface Article {
  id?: string;
  title?: string;
  body?: string;
  externalLink?: string;
  relatedArticles?: ArticleItem[];
}

export interface ArticleItem {
  id: string;
  title: string;
  description: string;
}
