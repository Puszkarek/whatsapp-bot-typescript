import { isNil } from "lodash";
import { IAnimeMetadata, IAnimeQuote } from "../interfaces";
import { IMovieMetadata } from "../interfaces/api-response.interface";

export const holidayText = (name: string, data: string): string => {
  return `Feriado: ${name}\nData: ${data}\n\n`;
};

export const animeQuotesText = (quoteList: Array<IAnimeQuote>): string => {
  return quoteList
    .map(({ anime, character, quote }) => {
      return `
Anime: ${anime}

Character: ${character}
    
${quote}
    
    
`;
    })
    .join();
};

export const animeMetadataText = (anime: IAnimeMetadata): string => {
  return `${anime.titles[0]}\n\n ${anime.synopsis}`;
};

export const movieMetadataText = (movie: IMovieMetadata) => {
  const title = `${isNil(movie.title) ? movie.original_name : movie.title}\n`;
  const summary = `\n\n${movie.overview}`;

  return title + summary;
};
