import { isNil, map } from 'lodash';

import { IAnimeMetadata, IAnimeQuote, IMovieMetadata } from '~/interfaces';

export const holidayText = (name: string, data: string): string => {
  return `Feriado: ${name}\nData: ${data}\n\n`;
};

export const animeQuotesText = (quoteList: ReadonlyArray<IAnimeQuote>): string => {
  return map(quoteList, ({ anime, character, quote }) => {
    return `
Anime: ${anime}

Character: ${character}
  
${quote}
  
  
`;
  }).join(',');
};

export const animeMetadataText = (anime: IAnimeMetadata): string => {
  return `${anime.titles[0]}\n\n ${anime.synopsis}`;
};

export const movieMetadataText = (movie: IMovieMetadata): string => {
  const title = `${isNil(movie.title) ? movie.original_name : movie.title}\n`;
  const summary = `\n\n${movie.overview}`;

  return title + summary;
};
