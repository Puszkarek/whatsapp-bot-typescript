import fs from "fs";
import { isArray } from "lodash";
import { COMMAND_ARGS_SEPARATOR } from "../../constants";
import {
  createReplyMessage,
  createReplyWithPushNameMessage,
  randomInt,
} from "../../helpers";
import { ServiceMethod } from "../../interfaces";
import { counterText, measurerText, shipText } from "../../messages";
import { NEEDS_GROUP_MESSAGE } from "../../messages/common.message";

export const generateEntertainmentService = () => {
  // * Generate insults list
  const rawInsultList: unknown = JSON.parse(
    fs.readFileSync("src/assets/texts/pt/insults.json", "utf-8")
  );
  const insultList = isArray(rawInsultList) ? rawInsultList : [];

  // * Return the methods
  return (): { [key: string]: ServiceMethod } => {
    return {
      /** Measurer something */
      measurer: ({ parsedMessageText }) => {
        const mod_type = parsedMessageText.trim();
        const mod = randomInt(100);

        return createReplyMessage(measurerText(mod, mod_type));
      },
      /** Send random insults */
      insults: () => {
        return createReplyMessage(insultList[randomInt(insultList.length)]);
      },
      choose: ({ parsedMessageText }) => {
        if (parsedMessageText.length === 0) {
          return createReplyMessage(insultList[randomInt(insultList.length)]);
        }

        /** Get the raw message and divide using a main separator if found, or a second separator */
        const itemsToCompare = parsedMessageText.includes(",")
          ? parsedMessageText.split(",")
          : parsedMessageText.split(COMMAND_ARGS_SEPARATOR);

        /** Get a random item from the list and send back to the user */
        const firstWordIndex = randomInt(itemsToCompare.length);
        return createReplyMessage(itemsToCompare[firstWordIndex].trim());
      },
      countwords: ({ parsedMessageText }) => {
        return createReplyMessage(counterText(parsedMessageText.length));
      },
      ship: ({ message }) => {
        if (message.isGroupMsg) {
          if (message.mentionedJidList.length > 0) {
            return createReplyWithPushNameMessage(
              message.mentionedJidList,
              shipText()
            );
          }
          const groupParticipants = message.chat.groupMetadata.participants;
          const getRandomParticipant = () =>
            randomInt(groupParticipants.length);

          // Add two participants to the list
          const member_1 = groupParticipants[getRandomParticipant()];
          const member_2 = groupParticipants[getRandomParticipant()];

          return createReplyWithPushNameMessage(
            [member_1.id._serialized, member_2.id._serialized],
            shipText()
          );
        }

        return createReplyMessage(NEEDS_GROUP_MESSAGE);
      },
    };
  };
};
