import { Client, Message } from '@open-wa/wa-automate';
import { green, magenta, red, yellow } from 'colorette';
import { format } from 'date-fns';
import { isRight } from 'fp-ts/lib/Either';
import { isNil, startsWith, toLower, trim } from 'lodash';

import { COMMAND_PREFIX, MIN_COMMAND_NAME_LENGTH } from './constants/message-handler';
import { getCommandFromMessage, sendMessage } from './helpers';
import { generateBotService } from './services/client.service';

export const makeMessageHandler = (): ((client: Client, message: Message) => Promise<void>) => {
  // Generate required methods
  const botService = generateBotService();

  return async (client: Client, message: Message): Promise<void> => {
    //  Get the message metadata
    const { sender, isGroupMsg, chat, caption, body } = message;

    // Get the chat metadata
    const { formattedTitle } = chat;

    /** If the user send a image with media, we will try to get the caption that is the same as the text message, otherwise we will use the message text from `body` */
    const getRawMessageText = (): string => {
      const trimmedCaption = trim(caption);
      if (trimmedCaption.length > 0) {
        return trimmedCaption;
      }
      return trim(body);
    };
    const rawMessageText = toLower(getRawMessageText());

    if (startsWith(rawMessageText, COMMAND_PREFIX) && rawMessageText.length > MIN_COMMAND_NAME_LENGTH) {
      // Formatted log
      const messageWithoutPrefix = trim(rawMessageText.slice(1));
      console.log(
        green(`${sender.pushname}:`),
        yellow(`"${rawMessageText}"`),
        green(' at'),
        magenta(format(new Date(), 'HH:mm')),
        isGroupMsg && formattedTitle ? green('from ') + red(formattedTitle) : '',
      );

      const commandEither = getCommandFromMessage(messageWithoutPrefix);

      if (isRight(commandEither)) {
        const command = commandEither.right;

        //* Get function
        const commandMethod = botService[command.name];

        /** Returns if we not found a command with the given name */
        if (isNil(commandMethod)) {
          return void 0;
        }

        /** Send the message to the client */
        const response = await commandMethod({
          message,
          parsedMessageText: command.message,
        });

        await sendMessage(client, message, response);
      }
    }
    return void 0;
  };
};
