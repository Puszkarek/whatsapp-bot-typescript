import { Message } from '@open-wa/wa-automate';

import { MessageResponse } from './message.interface';

export type ServiceMethodArguments = {
  /** The message send by the user, excluding the command word */
  readonly parsedMessageText: string;

  /** The message object from wa-automate library */
  readonly message: Message;
};

export type ServiceMethod = (properties: ServiceMethodArguments) => MessageResponse;

export type AsyncServiceMethod = (properties: ServiceMethodArguments) => Promise<MessageResponse>;

// * Services
export type UtilsService = {
  readonly help: ServiceMethod;
  readonly ping: ServiceMethod;
  readonly sticker: AsyncServiceMethod;
  readonly wiki: AsyncServiceMethod;
};

export type EntertainmentService = {
  readonly choose: ServiceMethod;
  readonly countwords: ServiceMethod;
  readonly insults: ServiceMethod;
  readonly measurer: ServiceMethod;
  readonly ship: ServiceMethod;
  readonly who: ServiceMethod;
};

export type APIsService = {
  readonly advice: AsyncServiceMethod;
  readonly anime: AsyncServiceMethod;
  readonly animequote: AsyncServiceMethod;
  readonly cat: AsyncServiceMethod;
  readonly holidays: AsyncServiceMethod;
  readonly movie: AsyncServiceMethod;
  readonly music: AsyncServiceMethod;
  readonly nasa: AsyncServiceMethod;
  readonly quote: AsyncServiceMethod;
};

export type BotService = {
  readonly [key: string]: ServiceMethod | AsyncServiceMethod;
};
