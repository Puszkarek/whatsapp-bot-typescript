import Kitsu from 'kitsu';
import { every, isArray } from 'lodash';

import { isAnimeMetadata } from '~/guards';
import { IAnimeMetadata } from '~/interfaces';

type KitsuServiceResponse = {
  readonly data: ReadonlyArray<IAnimeMetadata>;
};

const isKitsuServiceResponse = (value: unknown): value is KitsuServiceResponse => {
  try {
    const { data } = value as KitsuServiceResponse;

    return isArray(data) && every(data, isAnimeMetadata);
  } catch {
    return false;
  }
};

export const getAnimeMetadata = async (kitsuService: Kitsu, searchTerm: string): Promise<IAnimeMetadata | null> => {
  const response: unknown = await kitsuService.get('anime', {
    params: {
      filter: {
        text: searchTerm,
      },
    },
  });

  if (!isKitsuServiceResponse(response)) {
    return null;
  }

  const [anime] = response.data;

  return anime ?? null;
};
