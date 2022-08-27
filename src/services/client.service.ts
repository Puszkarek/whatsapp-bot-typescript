import { AsyncServiceMethod, ServiceMethod } from '~/interfaces';

import { generateAPIsService } from './api.service';
import { generateEntertainmentService } from './entertainment.service';
import { generateUtilsService } from './utils.service';

export type BotService = {
  readonly [key: string]: ServiceMethod | AsyncServiceMethod;
};

export const generateBotService = (): BotService => {
  return {
    ...generateEntertainmentService(),
    ...generateUtilsService(),
    ...generateAPIsService(),
  };
};
