import { Client, ContactId, DataURL, FilePath, Message } from '@open-wa/wa-automate';
import { Either, left, right } from 'fp-ts/lib/Either';
import { map, split, trim } from 'lodash';

import { COMMAND_ARGS_SEPARATOR, STICKER_PACK_AUTHOR, STICKER_PACK_NAME } from '~/constants';
import { Command, MESSAGE_RESPONSE_TYPE, MessageResponse, SUPPORTED_MEDIA_TYPE } from '~/interfaces';
import { ITEM_UNION_MESSAGE } from '~/messages';

export const getCommandFromMessage = (message: string): Either<Error, Command> => {
  const [commandToExecute, ...commandArguments] = split(message, COMMAND_ARGS_SEPARATOR);

  if (commandToExecute) {
    return right({
      message: commandArguments.join(COMMAND_ARGS_SEPARATOR),
      name: trim(commandToExecute),
    });
  }

  return left(new Error('Invalid message'));
};

export const sendMessage = async (client: Client, { from, id }: Message, response: MessageResponse): Promise<void> => {
  switch (response.type) {
    case 'reply':
      await client.reply(from, response.message, id);
      break;
    case 'replyWithPushName': {
      const contactNames = map(response.contactIDs, async contactID => {
        const contact = await client.getContact(contactID);

        return trim(contact.pushname);
      });

      await client.reply(from, trim(contactNames.join(ITEM_UNION_MESSAGE)) + response.message, id);
      break;
    }
    case 'image': {
      await client.sendImage(from, response.image, response.filename, response.caption);
      break;
    }
    case 'sticker': {
      switch (response.mediaType) {
        case 'image': {
          await client.sendImageAsSticker(from, response.media, {
            author: STICKER_PACK_AUTHOR,
            cropPosition: 'center',
            keepScale: true,

            pack: STICKER_PACK_NAME,
          });
          break;
        }
        case 'video': {
          await client.sendMp4AsSticker(
            from,
            response.media,
            { crop: false },
            { author: STICKER_PACK_AUTHOR, pack: STICKER_PACK_NAME },
          );
          break;
        }
      }
      break;
    }
    case 'youtube': {
      await client.sendYoutubeLink(from, response.link);
      break;
    }
  }
};

export const createReplyMessage = (message: string): MessageResponse => ({
  message: message,
  type: MESSAGE_RESPONSE_TYPE.reply,
});

export const createReplyWithPushNameMessage = (
  contactIDs: ReadonlyArray<ContactId>,
  message: string,
): MessageResponse => ({
  contactIDs: contactIDs,
  message: message,
  type: MESSAGE_RESPONSE_TYPE.replyWithPushName,
});

export const creteReplyWithMention = (message: string): MessageResponse => ({
  message: message,
  type: MESSAGE_RESPONSE_TYPE.reply,
});

export const createStickerMessage = (media: Buffer, mediaType: SUPPORTED_MEDIA_TYPE): MessageResponse => ({
  media,
  mediaType,
  type: MESSAGE_RESPONSE_TYPE.sticker,
});

export const createImageMessage = (image: FilePath | DataURL, filename: string, caption = ''): MessageResponse => ({
  caption,
  filename,
  image,
  type: MESSAGE_RESPONSE_TYPE.image,
});

export const createYoutubeLinkMessage = (link: string): MessageResponse => ({
  link,
  type: MESSAGE_RESPONSE_TYPE.youtube,
});
