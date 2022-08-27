import { includes, isNil, replace, split, trim } from 'lodash';
import { COMMAND_ARGS_SEPARATOR } from '~/constants';
import {
  createReplyMessage,
  createReplyWithPushNameMessage,
  creteReplyWithMention,
  getInsultList,
  randomInt,
} from '~/helpers';
import { MessageResponse, ServiceMethod } from '~/interfaces';
import {
  counterText,
  measurerText,
  NEEDS_GROUP_MESSAGE,
  NEEDS_TEXT_MESSAGE,
  REGULAR_ERROR_MESSAGE,
  shipText,
} from '~/messages';

export const generateEntertainmentService = (): {
  readonly [key: string]: ServiceMethod;
} => {
  // * Generate insults list
  const insultList = getInsultList();

  // * Return the methods
  return {
    choose: ({ parsedMessageText }): MessageResponse => {
      if (parsedMessageText.length === 0) {
        return createReplyMessage(NEEDS_TEXT_MESSAGE);
      }

      /** Get the raw message and divide using a main separator if found, or a second separator */
      const itemsToCompare = includes(parsedMessageText, ',')
        ? split(parsedMessageText, ',')
        : split(parsedMessageText, COMMAND_ARGS_SEPARATOR);

      /** Get a random item from the list and send back to the user */
      const randomItem = itemsToCompare[randomInt(itemsToCompare.length)];

      if (isNil(randomItem)) {
        return createReplyMessage(REGULAR_ERROR_MESSAGE);
      }

      return createReplyMessage(trim(randomItem));
    },

    countwords: ({ parsedMessageText }): MessageResponse => {
      return createReplyMessage(counterText(parsedMessageText.length));
    },

    /** Send random insults */
    insults: (): MessageResponse => {
      const randomInsult = insultList[randomInt(insultList.length)];

      if (isNil(randomInsult)) {
        return createReplyMessage(REGULAR_ERROR_MESSAGE);
      }

      return createReplyMessage(randomInsult);
    },
    /** Measurer something */
    measurer: ({ parsedMessageText }): MessageResponse => {
      const moduleType = trim(parsedMessageText);
      const moduleBase = 100;
      const randomModule = randomInt(moduleBase);

      return createReplyMessage(measurerText(randomModule, moduleType));
    },
    ship: ({ message }): MessageResponse => {
      if (message.isGroupMsg) {
        if (message.mentionedJidList.length > 0) {
          return createReplyWithPushNameMessage(message.mentionedJidList, shipText());
        }
        const groupParticipants = message.chat.groupMetadata.participants;
        const getRandomParticipantID = (): number => randomInt(groupParticipants.length);

        // Add two participants to the list
        const firstMemberID = groupParticipants[getRandomParticipantID()]?.id._serialized;
        const secondMemberID = groupParticipants[getRandomParticipantID()]?.id._serialized;

        if (isNil(firstMemberID) || isNil(secondMemberID)) {
          return createReplyMessage(REGULAR_ERROR_MESSAGE);
        }
        return createReplyWithPushNameMessage([firstMemberID, secondMemberID], shipText());
      }

      return createReplyMessage(NEEDS_GROUP_MESSAGE);
    },
    who: ({ message }): MessageResponse => {
      if (message.isGroupMsg) {
        const groupMembers = message.chat.groupMetadata.participants;

        const rawID = groupMembers[randomInt(groupMembers.length)]?.id._serialized;

        if (isNil(rawID)) {
          return createReplyMessage(REGULAR_ERROR_MESSAGE);
        }
        const memberID = replace(rawID, '@c.us', '');

        return creteReplyWithMention(`@${memberID}`);
      }

      return createReplyMessage(NEEDS_GROUP_MESSAGE);
    },
  };
};
