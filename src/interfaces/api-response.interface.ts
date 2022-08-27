/** The response from the anime quotes API */
export type IAnimeQuote = {
  readonly anime: string;
  readonly character: string;
  readonly quote: string;
};

/** The response from the anime API */
export type IAnimeMetadata = {
  readonly titles: ReadonlyArray<string>;
  readonly posterImage: {
    readonly medium: string;
  };
  readonly synopsis: string;
};

/** The response from the holiday API */
export type IHoliday = {
  readonly date: string;
  readonly localName: string;
};

export type IAdvice = {
  readonly slip: {
    readonly id: string;
    readonly advice: string;
  };
};

export type ICatImage = {
  readonly id: string;
  readonly url: string;
};

export type IMovieMetadata = {
  readonly poster_path: string;
  readonly title?: string | null;
  readonly original_name: string;
  readonly overview: string;
};

// TODO: move to a regional interface
/** Is in PT-BR because the request returns that */
export type IQuote = {
  readonly frases: ReadonlyArray<{
    readonly autor: string;
    readonly texto: string;
  }>;
};
