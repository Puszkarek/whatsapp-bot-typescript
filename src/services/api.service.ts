import * as dotenv from 'dotenv';
import { isLeft } from 'fp-ts/lib/Either';
import Kitsu from 'kitsu';
import { isNil, map, trim } from 'lodash';

import {
  ADVICE_API_URL,
  ANIME_QUOTES_API_URL,
  APP_LANGUAGE_ID,
  CAT_IMAGE_API_URL,
  HOLIDAY_API_URL,
  MOVIE_DISCOVER_API_URL,
  MOVIE_IMAGE_BASE_URL,
  MOVIE_SEARCH_API_URL,
  NASA_API_URL,
  NASA_IMAGE_SEARCH_API_URL,
  QUOTE_API_URL,
} from '~/constants';
import {
  createImageMessage,
  createReplyMessage,
  createYoutubeLinkMessage,
  getCatFactsList,
  makeRequestFromURL,
  randomInt,
} from '~/helpers';
import { getAnimeMetadata } from '~/helpers/get-anime-metadata';
import {
  AsyncServiceMethod,
  IAdvice,
  IAnimeQuote,
  ICatImage,
  IHoliday,
  IMovieMetadata,
  IQuote,
  MessageResponse,
} from '~/interfaces';
import {
  animeMetadataText,
  animeQuotesText,
  API_ERROR_MESSAGE,
  holidayText,
  movieMetadataText,
  SEARCH_ERROR_MESSAGE,
} from '~/messages';

/** Service that uses external apis to send messages */
export const generateAPIsService = (): {
  readonly [key: string]: AsyncServiceMethod;
} => {
  // * Cat facts
  const catFacts = getCatFactsList();

  // * Generate the anime service
  const kitsuService = new Kitsu({
    baseURL: 'https://kitsu.io/api/edge/anime?',
  });

  // * Set env variables
  dotenv.config();

  // * Return the methods
  return {
    advice: async (): Promise<MessageResponse> => {
      const response = await makeRequestFromURL<IAdvice>(ADVICE_API_URL);

      if (isLeft(response)) {
        return createReplyMessage(API_ERROR_MESSAGE);
      }

      return createReplyMessage(response.right.slip.advice);
    },

    // Anime apis
    anime: async ({ parsedMessageText }): Promise<MessageResponse> => {
      const anime = await getAnimeMetadata(kitsuService, parsedMessageText);

      if (isNil(anime)) {
        return createReplyMessage(SEARCH_ERROR_MESSAGE);
      }

      const caption = animeMetadataText(anime);

      // Image url
      const imgUrl = anime.posterImage.medium;
      const title = anime.titles[0] ?? anime.posterImage.medium;
      return createImageMessage(imgUrl, title, caption);
    },

    animequote: async ({ parsedMessageText }): Promise<MessageResponse> => {
      const response = await makeRequestFromURL<ReadonlyArray<IAnimeQuote>>(ANIME_QUOTES_API_URL, {
        title: parsedMessageText,
      });

      if (isLeft(response)) {
        return createReplyMessage(API_ERROR_MESSAGE);
      }

      return createReplyMessage(animeQuotesText(response.right));
    },

    // Media apis
    cat: async (): Promise<MessageResponse> => {
      const response = await makeRequestFromURL<readonly [ICatImage]>(CAT_IMAGE_API_URL);

      if (isLeft(response)) {
        return createReplyMessage(API_ERROR_MESSAGE);
      }
      const [catImage] = response.right;

      return createImageMessage(catImage.url, catImage.id, catFacts[randomInt(catFacts.length)]);
    },

    // General apis
    holidays: async (): Promise<MessageResponse> => {
      const response = await makeRequestFromURL<ReadonlyArray<IHoliday>>(HOLIDAY_API_URL);

      if (isLeft(response)) {
        return createReplyMessage(API_ERROR_MESSAGE);
      }

      const parsedResponse = map(response.right, holiday => {
        return holidayText(holiday.localName, holiday.date);
      }).join(',');

      return createReplyMessage(trim(parsedResponse));
    },

    movie: async ({ parsedMessageText }): Promise<MessageResponse> => {
      if (parsedMessageText.length > 0) {
        // * Search a movie using a term
        const movieName = parsedMessageText;

        const response = await makeRequestFromURL<{
          readonly results: ReadonlyArray<IMovieMetadata>;
        }>(MOVIE_SEARCH_API_URL, {
          api_key: process.env['MOVIE_API_KEY'] ?? '',
          include_adult: true,
          language: APP_LANGUAGE_ID,
          page: 1,
          query: movieName,
        });

        if (isLeft(response)) {
          return createReplyMessage(API_ERROR_MESSAGE);
        }

        const [movie] = response.right.results;

        if (isNil(movie)) {
          return createReplyMessage(SEARCH_ERROR_MESSAGE);
        }

        const imageURL = MOVIE_IMAGE_BASE_URL + movie.poster_path;
        const filename = movie.poster_path;
        const caption = movieMetadataText(movie);

        return createImageMessage(imageURL, filename, caption);
      }

      // * Get a random movie
      const response = await makeRequestFromURL<{
        readonly results: ReadonlyArray<IMovieMetadata>;
      }>(MOVIE_DISCOVER_API_URL, {
        api_key: process.env['MOVIE_API_KEY'] ?? '',
        include_adult: true,
        language: APP_LANGUAGE_ID,
      });

      if (isLeft(response)) {
        return createReplyMessage(API_ERROR_MESSAGE);
      }

      const data = response.right.results;
      const movie = data[randomInt(data.length)];

      if (isNil(movie)) {
        return createReplyMessage(SEARCH_ERROR_MESSAGE);
      }

      const imageURL = MOVIE_IMAGE_BASE_URL + movie.poster_path;
      const filename = movie.poster_path;
      const caption = movieMetadataText(movie);

      return createImageMessage(imageURL, filename, caption);
    },
    // Music apis
    music: async (): Promise<MessageResponse> => {
      const response = await makeRequestFromURL<string>(ANIME_QUOTES_API_URL);

      if (isLeft(response)) {
        return createReplyMessage(API_ERROR_MESSAGE);
      }

      return createReplyMessage(response.right);
    },

    nasa: async ({ parsedMessageText }): Promise<MessageResponse> => {
      if (parsedMessageText.length > 0) {
        // * Search by images
        const response = await makeRequestFromURL<{
          readonly collection: {
            readonly items: ReadonlyArray<{
              readonly href: string;
              readonly data: ReadonlyArray<{ readonly title: string; readonly nasa_id: string }>;
            }>;
          };
        }>(NASA_IMAGE_SEARCH_API_URL, {
          media_type: 'image',
          q: parsedMessageText,
        });

        if (isLeft(response)) {
          return createReplyMessage(API_ERROR_MESSAGE);
        }

        const collectionItems = response.right.collection.items;
        const randomResult = collectionItems[randomInt(collectionItems.length)];

        const data = randomResult?.data[0];

        if (isNil(randomResult) || isNil(data)) {
          return createReplyMessage(SEARCH_ERROR_MESSAGE);
        }

        const caption = data.title;
        const filename = data.nasa_id;
        const image = randomResult.href;
        return createImageMessage(image, filename, caption);
      }

      // * Get the image of the day from nasa
      const responseEither = await makeRequestFromURL<{
        readonly media_type: string;
        readonly url: string;
        readonly title: string;
      }>(NASA_API_URL, {
        api_key: process.env['NASA_API_KEY'] ?? '',
      });

      if (isLeft(responseEither)) {
        return createReplyMessage(API_ERROR_MESSAGE);
      }

      const data = responseEither.right;

      if (data.media_type === 'image') {
        return createImageMessage(data.url, data.title, data.title);
      }
      createYoutubeLinkMessage(data.url);

      return createReplyMessage(API_ERROR_MESSAGE);
    },

    quote: async ({ parsedMessageText }): Promise<MessageResponse> => {
      const response = await makeRequestFromURL<IQuote>(QUOTE_API_URL, {
        max: '5',
        term: parsedMessageText,
      });

      if (isLeft(response)) {
        return createReplyMessage(API_ERROR_MESSAGE);
      }

      const quoteList = map(response.right.frases, ({ texto, autor }) => `"${texto}"\n - ${autor}\n\n`);
      const message = trim(quoteList.join(','));

      return createReplyMessage(message);
    },
  };
};
