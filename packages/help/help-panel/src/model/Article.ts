export interface Article {
  body: string;
  context: string[];
  description?: string;
  id: string;
  lastPublished: string;
  objectId: string;
  productUrl?: string;
  title: string;
  type: string;
  relatedArticles?: ArticleItem[];
}

export interface ArticleItem {
  id: string;
  title: string;
  description: string;
}

export interface ArticleFeedback {
  RateReasonText: string;
  negativeRateReason?: string;
}
