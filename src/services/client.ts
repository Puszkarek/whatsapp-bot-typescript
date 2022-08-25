import { generateEntertainmentService } from "./entertainment";
import { AsyncServiceMethod, ServiceMethod } from "../interfaces";

export type BotService = {
  [key: string]: ServiceMethod | AsyncServiceMethod;
};

export const generateBotService = (): BotService => {
  return {
    ...generateEntertainmentService(),
  };
};
