import {
  Client,
  ContactId,
  DataURL,
  FilePath,
  Message,
} from "@open-wa/wa-automate";
import { Either, right, left } from "fp-ts/lib/Either";
import { COMMAND_ARGS_SEPARATOR, STICKER_PACK_AUTHOR } from "../constants";
import {
  Command,
  MessageResponse,
  MESSAGE_RESPONSE_TYPE,
  SUPPORTED_MEDIA_TYPE,
} from "../interfaces";
import { ITEM_UNION_MESSAGE } from "../messages";
import { STICKER_PACK_NAME } from "../constants/message-handler";

export const getCommandFromMessage = (
  message: string
): Either<Error, Command> => {
  const [commandToExecute, ...args] = message.split(COMMAND_ARGS_SEPARATOR);

  if (commandToExecute) {
    return right({
      name: commandToExecute.trim(),
      message: args.join(COMMAND_ARGS_SEPARATOR),
    });
  }

  return left(new Error("Invalid message"));
};

export const sendMessage = async (
  client: Client,
  { from, id }: Message,
  response: MessageResponse
): Promise<void> => {
  switch (response.type) {
    case "reply":
      await client.reply(from, response.message, id);
      break;
    case "replyWithPushName": {
      const contactNames = response.contactIDs.map(async (id) => {
        const contact = await client.getContact(id);

        const contactName = contact.pushname
          ? contact.pushname
          : contact.formattedName;

        return contactName.trim();
      });

      await client.reply(
        from,
        contactNames.join(ITEM_UNION_MESSAGE).trim() + response.message,
        id
      );
      break;
    }
    case "image": {
      await client.sendImage(
        from,
        response.image,
        response.filename,
        response.caption
      );
      break;
    }
    case "sticker": {
      switch (response.mediaType) {
        case "image": {
          await client.sendImageAsSticker(from, response.media, {
            pack: STICKER_PACK_NAME,
            author: STICKER_PACK_AUTHOR,
            cropPosition: "center",

            keepScale: true,
          });
          break;
        }
        case "video": {
          await client.sendMp4AsSticker(
            from,
            response.media,
            { crop: false },
            { pack: STICKER_PACK_NAME, author: STICKER_PACK_AUTHOR }
          );
          break;
        }
      }
      break;
    }
    case "youtube": {
      await client.sendYoutubeLink(from, response.link);
      break;
    }
  }
};

export const createReplyMessage = (
  message: string | undefined | null
): Either<Error, MessageResponse> => {
  if (message) {
    return right({
      type: MESSAGE_RESPONSE_TYPE.reply,
      message: message,
    });
  }

  return left(new Error("Invalid message"));
};

export const createReplyWithPushNameMessage = (
  contactIDs: Array<ContactId>,
  message: string | undefined | null
): Either<Error, MessageResponse> => {
  if (message) {
    return right({
      type: MESSAGE_RESPONSE_TYPE.replyWithPushName,
      contactIDs: contactIDs,
      message: message,
    });
  }

  return left(new Error("Invalid message"));
};

export const createStickerMessage = (
  media: Buffer,
  mediaType: SUPPORTED_MEDIA_TYPE
): Either<Error, MessageResponse> => {
  return right({
    type: MESSAGE_RESPONSE_TYPE.sticker,
    media,
    mediaType,
  });
};

export const createImageMessage = (
  image: FilePath | DataURL,
  filename: string,
  caption: string = ""
): Either<Error, MessageResponse> => {
  return right({
    type: MESSAGE_RESPONSE_TYPE.image,
    image,
    filename,
    caption: caption ?? "",
  });
};

export const createYoutubeLinkMessage = (
  link: string
): Either<Error, MessageResponse> => {
  return right({
    type: MESSAGE_RESPONSE_TYPE.youtube,
    link,
  });
};

export const creteReplyWithMention = (
  message: string | undefined | null
): Either<Error, MessageResponse> => {
  if (message) {
    return right({
      type: MESSAGE_RESPONSE_TYPE.reply,
      message: message,
    });
  }

  return left(new Error("Invalid message"));
};
