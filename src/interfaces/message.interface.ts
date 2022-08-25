import { ContactId } from "@open-wa/wa-automate";

export enum MESSAGE_RESPONSE_TYPE {
  reply = "reply",
  replyWithPushName = "replyWithPushName",
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
    };

export type Command = {
  name: string;
  arguments: Array<string>;
};
