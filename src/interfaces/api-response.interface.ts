/** The response from the anime quotes API */
export type IAnimeQuote = {
  anime: string;
  character: string;
  quote: string;
};

/** The response from the anime API */
export type IAnimeMetadata = {
  titles: Array<string>;
  posterImage: {
    medium: string;
  };
  synopsis: string;
};

/** The response from the holiday API */
export type IHoliday = {
  date: string;
  localName: string;
};

export type IAdvice = {
  slip: {
    id: string;
    advice: string;
  };
};

export type ICatImage = {
  id: string;
  url: string;
};

export type IMovieMetadata = {
  poster_path: string;
  title?: string | null;
  original_name: string;
  overview: string;
};

// TODO: move to a regional interface
/** Is in PT-BR because the request returns that */
export type IQuote = {
  frases: Array<{
    autor: string;
    texto: string;
  }>;
};
