import { every, isArray, isString } from 'lodash';

import { IAnimeMetadata } from '~/interfaces';

export const isAnimeMetadata = (value: unknown): value is IAnimeMetadata => {
  try {
    const anime = value as IAnimeMetadata;

    return (
      isArray(anime.titles) &&
      every(anime.titles, isString) &&
      isString(anime.posterImage.medium) &&
      isString(anime.synopsis)
    );
  } catch {
    return false;
  }
};
