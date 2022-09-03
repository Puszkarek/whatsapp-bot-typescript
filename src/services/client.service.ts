import { BotService } from '~/interfaces';

import { generateAPIsService } from './api.service';
import { generateEntertainmentService } from './entertainment.service';
import { generateUtilsService } from './utils.service';

export const generateBotService = (): BotService => {
  return {
    ...generateEntertainmentService(),
    ...generateUtilsService(),
    ...generateAPIsService(),
  };
};
