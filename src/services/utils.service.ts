import { decryptMedia } from '@open-wa/wa-automate';
import { isNil } from 'lodash';
import wiki from 'wikipedia';

import { APP_LANGUAGE } from '~/constants';
import { createReplyMessage, createStickerMessage, getCommandList } from '~/helpers';
import { AsyncServiceMethod, MessageResponse, ServiceMethod } from '~/interfaces';
import { NEEDS_MEDIA_MESSAGE, SEARCH_ERROR_MESSAGE } from '~/messages';

import dwiki from '../../libs/desciclopedia/dist';

// TODO: needs that? if no delete
const uaOverride =
  'WhatsApp/2.16.352 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Safari/605.1.15';

export const generateUtilsService = (): {
  readonly [key: string]: AsyncServiceMethod | ServiceMethod;
} => {
  // * Generate commands helper list
  const displayedCommandList = getCommandList();

  // * Set main settings
  wiki.setLang(APP_LANGUAGE);

  // * Return the methods
  return {
    // TODO: move to a regional service
    /** Search terms on the Desciclopedia */
    dwiki: async ({ parsedMessageText }): Promise<MessageResponse> => {
      try {
        const searchResults = await dwiki.search(parsedMessageText);

        const page = await dwiki.page(searchResults.results[0].pageid);
        const content = await page.content({
          redirect: false,
        });

        return createReplyMessage(content.replaceAll('\n', '\n\n'));
      } catch {
        return createReplyMessage(SEARCH_ERROR_MESSAGE);
      }
    },

    /** Show a list of available command */
    help: (): MessageResponse => createReplyMessage(displayedCommandList),

    /** Check if the bot ins online */
    ping: (): MessageResponse => createReplyMessage('Pong'),

    sticker: async ({ message }): Promise<MessageResponse> => {
      /** If the user is replying another message, we will get that, otherwise we will use the message sended by the user */
      const messageWithMedia = isNil(message.quotedMsgObj) ? message : message.quotedMsgObj;

      if (messageWithMedia.mimetype) {
        const media = await decryptMedia(messageWithMedia, uaOverride);
        if (messageWithMedia.type === 'image') {
          return createStickerMessage(media, 'image');
        }
        return createStickerMessage(media, 'video');
      }

      return createReplyMessage(NEEDS_MEDIA_MESSAGE);
    },
    /** Search terms on the Wikipedia */
    wiki: async ({ parsedMessageText }): Promise<MessageResponse> => {
      try {
        const searchResults = await wiki.search(parsedMessageText, {
          limit: 1,
        });

        const page = await wiki.page(searchResults.results[0].pageid);
        const content = await page.content({
          redirect: false,
        });

        return createReplyMessage(content.replaceAll('\n', '\n\n'));
      } catch {
        return createReplyMessage(SEARCH_ERROR_MESSAGE);
      }
    },
  };
};
