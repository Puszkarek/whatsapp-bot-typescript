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
