import { ContactId, DataURL, FilePath } from "@open-wa/wa-automate";

export type SUPPORTED_MEDIA_TYPE = "animatedStick" | "image" | "video";
export enum MESSAGE_RESPONSE_TYPE {
  reply = "reply",
  replyWithPushName = "replyWithPushName",
  sticker = "sticker",
  image = "image",
  youtube = "youtube",
  mention = "mention",
}

export type MessageResponse =
  | {
      type: MESSAGE_RESPONSE_TYPE.reply;
      message: string;
    }
  | {
      type: MESSAGE_RESPONSE_TYPE.replyWithPushName;
      contactIDs: Array<ContactId>;
      message: string;
    }
  | {
      type: MESSAGE_RESPONSE_TYPE.sticker;
      media: Buffer;
      mediaType: SUPPORTED_MEDIA_TYPE;
    }
  | {
      type: MESSAGE_RESPONSE_TYPE.image;
      image: DataURL | FilePath;
      filename: string;
      caption: string;
    }
  | {
      type: MESSAGE_RESPONSE_TYPE.youtube;
      link: string;
    }
  | {
      type: MESSAGE_RESPONSE_TYPE.mention;
      message: string;
    };

export type Command = {
  name: string;
  message: string;
};
