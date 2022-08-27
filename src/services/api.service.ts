import { createImageMessage, createReplyMessage } from "../helpers";
import { AsyncServiceMethod } from "../interfaces";
import { ServiceMethod } from "../interfaces/service.interface";
import {
  API_ERROR_MESSAGE,
  SEARCH_ERROR_MESSAGE,
} from "../messages/common.message";
import Kitsu from "kitsu";
import { Either, isLeft, left, right } from "fp-ts/lib/Either";
import axios from "axios";
import { animeMetadataText, animeQuotesText, holidayText } from "../messages";
import {
  CAT_IMAGE_API_URL,
  MOVIE_IMAGE_BASE_URL,
  NASA_API_URL,
  NASA_IMAGE_SEARCH_API_URL,
} from "../constants/api-urls";
import fs from "fs";
import {
  IHoliday,
  IAnimeQuote,
  IAdvice,
  IQuote,
  ICatImage,
} from "../interfaces/api-response.interface";
import {
  ADVICE_API_URL,
  ANIME_QUOTES_API_URL,
  HOLIDAY_API_URL,
  HOROSCOPE_API_URL,
  QUOTE_API_URL,
} from "../constants/api-urls";
import { isArray, isNil } from "lodash";
import { randomInt } from "../helpers/number.helper";
import {
  IAnimeMetadata,
  IMovieMetadata,
} from "../interfaces/api-response.interface";
import { createYoutubeLinkMessage } from "../helpers/message.helper";
import * as dotenv from "dotenv";
import { APP_LANGUAGE_ID } from "../constants";
import {
  MOVIE_SEARCH_API_URL,
  MOVIE_DISCOVER_API_URL,
} from "../constants/api-urls";
import { movieMetadataText } from "../messages/api.message";

// TODO: move to helpers
export const makeRequestFromURL = async <T>(
  url: string,
  params: Record<string, string | boolean | number> = {}
): Promise<Either<Error, T>> => {
  try {
    const response = await axios.get<T>(url, {
      responseType: "json",
      params: params,
    });

    return right(response.data);
  } catch {
    return left(new Error(`Something gone wrong with the request`));
  }
};

/** Service that uses external apis to send messages */
export const generateAPIsService = (): {
  [key: string]: AsyncServiceMethod | ServiceMethod;
} => {
  // * Cat facts
  const rawCatFactsList: unknown = JSON.parse(
    fs.readFileSync("src/assets/texts/pt/cat-facts.json", "utf-8")
  );
  const catFacts: Array<string> = isArray(rawCatFactsList)
    ? rawCatFactsList
    : [];

  // * Generate the anime service
  const kitsuService = new Kitsu({
    baseURL: "https://kitsu.io/api/edge/anime?",
  });

  // * Set env variables
  dotenv.config();

  // * Return the methods
  return {
    // General apis
    holidays: async () => {
      const response = await makeRequestFromURL<Array<IHoliday>>(
        HOLIDAY_API_URL
      );

      if (isLeft(response)) {
        return createReplyMessage(API_ERROR_MESSAGE);
      }

      const parsedResponse = response.right
        .map((holiday) => {
          return holidayText(holiday.localName, holiday.date);
        })
        .join()
        .trim();

      return createReplyMessage(parsedResponse);
    },
    advice: async () => {
      const response = await makeRequestFromURL<IAdvice>(ADVICE_API_URL);

      if (isLeft(response)) {
        return createReplyMessage(API_ERROR_MESSAGE);
      }

      return createReplyMessage(response.right.slip.advice);
    },
    quote: async ({ parsedMessageText }) => {
      const response = await makeRequestFromURL<IQuote>(QUOTE_API_URL, {
        max: "5",
        term: parsedMessageText,
      });

      if (isLeft(response)) {
        return createReplyMessage(API_ERROR_MESSAGE);
      }

      const message = response.right.frases
        .map(({ texto, autor }) => `"${texto}"\n - ${autor}\n\n`)
        .join()
        .trim();

      return createReplyMessage(message);
    },

    // Anime apis
    anime: async ({ parsedMessageText }) => {
      const response = await kitsuService.get("anime", {
        params: {
          filter: {
            text: parsedMessageText,
          },
        },
      });
      const anime: IAnimeMetadata = response.data[0];
      const caption = animeMetadataText(anime);

      //image url
      const imgUrl = anime.posterImage.medium;
      return createImageMessage(imgUrl, anime.titles[0], caption);
    },
    animequote: async ({ parsedMessageText }) => {
      const response = await makeRequestFromURL<Array<IAnimeQuote>>(
        ANIME_QUOTES_API_URL,
        {
          title: parsedMessageText,
        }
      );

      if (isLeft(response)) {
        return createReplyMessage(API_ERROR_MESSAGE);
      }

      return createReplyMessage(animeQuotesText(response.right));
    },

    // Media apis
    cat: async () => {
      const response = await makeRequestFromURL<[ICatImage]>(CAT_IMAGE_API_URL);

      if (isLeft(response)) {
        return createReplyMessage(API_ERROR_MESSAGE);
      }
      const catImage = response.right[0];

      return createImageMessage(
        catImage.url,
        catImage.id,
        catFacts[randomInt(catFacts.length)]
      );
    },
    nasa: async ({ parsedMessageText }) => {
      if (parsedMessageText.length > 0) {
        // * Search by images
        const response = await makeRequestFromURL<{
          collection: {
            items: Array<{
              href: string;
              data: Array<{ title: string; nasa_id: string }>;
            }>;
          };
        }>(NASA_IMAGE_SEARCH_API_URL, {
          media_type: "image",
          q: parsedMessageText,
        });

        if (isLeft(response)) {
          return createReplyMessage(API_ERROR_MESSAGE);
        }

        const collectionItems = response.right.collection.items;
        const randomResult = collectionItems[randomInt(collectionItems.length)];
        const data = randomResult.data[0];

        const caption = data.title;
        const filename = data.nasa_id;
        const image = randomResult.href;
        return createImageMessage(image, filename, caption);
      }

      // * Get the image of the day from nasa
      const responseEither = await makeRequestFromURL<{
        media_type: string;
        url: string;
        title: string;
      }>(NASA_API_URL, {
        api_key: process.env.NASA_API_KEY ?? "",
      });

      if (isLeft(responseEither)) {
        return createReplyMessage(API_ERROR_MESSAGE);
      }

      const data = responseEither.right;

      if (data.media_type === "image") {
        return createImageMessage(data.url, data.title, data.title);
      } else {
        createYoutubeLinkMessage(data.url);
      }

      return createReplyMessage(API_ERROR_MESSAGE);
    },
    movie: async ({ parsedMessageText }) => {
      if (parsedMessageText.length > 0) {
        // * Search a movie using a term
        const movieName = parsedMessageText;

        const response = await makeRequestFromURL<{
          results: Array<IMovieMetadata>;
        }>(MOVIE_SEARCH_API_URL, {
          api_key: process.env.MOVIE_API_KEY ?? "",
          query: movieName,
          language: APP_LANGUAGE_ID,
          page: 1,
          include_adult: true,
        });

        if (isLeft(response)) {
          return createReplyMessage(API_ERROR_MESSAGE);
        }

        const movie = response.right.results[0];

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
        results: Array<IMovieMetadata>;
      }>(MOVIE_DISCOVER_API_URL, {
        api_key: process.env.MOVIE_API_KEY ?? "",
        include_adult: true,
        language: APP_LANGUAGE_ID,
      });

      if (isLeft(response)) {
        return createReplyMessage(API_ERROR_MESSAGE);
      }

      const data = response.right.results;
      const movie = data[randomInt(data.length)];
      const imageURL = MOVIE_IMAGE_BASE_URL + movie.poster_path;
      const filename = movie.poster_path;
      const caption = movieMetadataText(movie);

      return createImageMessage(imageURL, filename, caption);
    },
    // Music apis
    music: async () => {
      const response = await makeRequestFromURL<string>(ANIME_QUOTES_API_URL);

      if (isLeft(response)) {
        return createReplyMessage(API_ERROR_MESSAGE);
      }

      return createReplyMessage(response.right);
    },
  };
};

generateAPIsService();
