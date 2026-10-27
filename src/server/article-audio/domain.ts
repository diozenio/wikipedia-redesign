export type ArticleAudioStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";

export type ArticleAudio = {
  id: string;
  articleId: string;
  contentHash: string;
  voice: string;
  status: ArticleAudioStatus;
  progress: number;
  storageKey: string | null;
  contentType: string | null;
  error: string | null;
};

export type ArticleAudioRequested = {
  type: "article-audio.requested";
  audioId: string;
  articleId: string;
  contentHash: string;
};

export class ArticleNotFoundError extends Error {
  constructor(articleId: string) {
    super(`Article "${articleId}" not found`);
    this.name = "ArticleNotFoundError";
  }
}

export class ArticleChangedError extends Error {
  constructor(articleId: string) {
    super(`Article "${articleId}" changed before its audio was generated`);
    this.name = "ArticleChangedError";
  }
}
