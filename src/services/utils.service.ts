import { decryptMedia } from "@open-wa/wa-automate";
import { isNil, isArray } from "lodash";
import { createReplyMessage, createStickerMessage } from "../helpers";
import { AsyncServiceMethod } from "../interfaces";
import { NEEDS_MEDIA_MESSAGE } from "../messages";
import { ServiceMethod } from "../interfaces/service.interface";
import { SEARCH_ERROR_MESSAGE } from "../messages/common.message";
import wiki from "wikipedia";
import dwiki from "../libs/desciclopedia/dist";
import fs from "fs";
import { randomInt } from "../helpers/number.helper";
import { COMMAND_PREFIX } from "../constants/message-handler";
import { APP_LANGUAGE } from "../constants/settings";

// TODO: needs that? if no delete
const uaOverride =
  "WhatsApp/2.16.352 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Safari/605.1.15";

export const generateUtilsService = (): {
  [key: string]: AsyncServiceMethod | ServiceMethod;
} => {
  // * Generate commands helper list
  const rawCommandList: Record<string, string> = JSON.parse(
    fs.readFileSync("src/assets/texts/pt/help.json", "utf-8")
  );
  const displayedCommandList = Object.entries(rawCommandList)
    .map(([key, description]) => {
      return (
        COMMAND_PREFIX + key + "\n" + description + "\n\n───────────────\n\n"
      );
    })
    .join()
    .trim();

  // * Generate bolso quote list
  const rawInsultList: unknown = JSON.parse(
    fs.readFileSync("src/assets/texts/pt/insults.json", "utf-8")
  );
  const bolsoList: Array<{
    formattedDate: string;
    text: string;
  }> = isArray(rawInsultList) ? rawInsultList : [];

  // * Return the methods
  return {
    sticker: async ({ message }) => {
      /** If the user is replying another message, we will get that, otherwise we will use the message sended by the user */
      const messageWithMedia = isNil(message.quotedMsgObj)
        ? message
        : message.quotedMsgObj;

      if (messageWithMedia.mimetype) {
        const media = await decryptMedia(messageWithMedia, uaOverride);
        if (messageWithMedia.type === "image") {
          return createStickerMessage(media, "image");
        } else {
          return createStickerMessage(media, "video");
        }
      }

      return createReplyMessage(NEEDS_MEDIA_MESSAGE);
    },
    /** Check if the bot ins online */
    ping: () => createReplyMessage("Pong"),
    /** Search terms on the Wikipedia */
    wiki: async ({ parsedMessageText }) => {
      try {
        await wiki.setLang(APP_LANGUAGE);
        const searchResults = await wiki.search(parsedMessageText, {
          limit: 1,
        });

        const page = await wiki.page(searchResults.results[0].pageid);
        const content = await page.content({
          redirect: false,
        });

        return createReplyMessage(content.replaceAll("\n", "\n\n"));
      } catch (err) {
        return createReplyMessage(SEARCH_ERROR_MESSAGE);
      }
    },
    // TODO: move to a regional service
    /** Search terms on the Desciclopedia */
    dwiki: async ({ parsedMessageText }) => {
      try {
        const searchResults = await dwiki.search(parsedMessageText);

        const page = await dwiki.page(searchResults.results[0].pageid);
        const content = await page.content({
          redirect: false,
        });

        return createReplyMessage(content.replaceAll("\n", "\n\n"));
      } catch (err) {
        return createReplyMessage(SEARCH_ERROR_MESSAGE);
      }
    },
    // TODO: move to a regional service
    bolso: () => {
      const quote = bolsoList[randomInt(bolsoList.length)];

      return createReplyMessage(quote.formattedDate + "\n\n" + quote.text);
    },
    help: () => {
      return createReplyMessage(displayedCommandList);
    },
  };
};
