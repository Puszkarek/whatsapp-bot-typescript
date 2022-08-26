import { ContactId } from "@open-wa/wa-automate";

export type SUPPORTED_MEDIA_TYPE = "animatedStick" | "image" | "video";
export enum MESSAGE_RESPONSE_TYPE {
  reply = "reply",
  replyWithPushName = "replyWithPushName",
  sticker = "sticker",
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
      media: any; // TODO (add type)
      mediaType: SUPPORTED_MEDIA_TYPE;
    };

export type Command = {
  name: string;
  arguments: Array<string>;
};
