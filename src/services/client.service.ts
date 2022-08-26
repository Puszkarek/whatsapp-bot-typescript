import { generateEntertainmentService } from "./entertainment.service";
import { AsyncServiceMethod, ServiceMethod } from "../interfaces";
import { generateUtilsService } from "./utils.service";

export type BotService = {
  [key: string]: ServiceMethod | AsyncServiceMethod;
};

export const generateBotService = (): BotService => {
  return {
    ...generateEntertainmentService(),
    ...generateUtilsService(),
  };
};
