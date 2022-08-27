import { ContactId, DataURL, FilePath } from '@open-wa/wa-automate';

export type SUPPORTED_MEDIA_TYPE = 'animatedStick' | 'image' | 'video';
export enum MESSAGE_RESPONSE_TYPE {
  reply = 'reply',
  replyWithPushName = 'replyWithPushName',
  sticker = 'sticker',
  image = 'image',
  youtube = 'youtube',
  mention = 'mention',
}

export type MessageResponse =
  | {
      readonly type: MESSAGE_RESPONSE_TYPE.reply;
      readonly message: string;
    }
  | {
      readonly type: MESSAGE_RESPONSE_TYPE.replyWithPushName;
      readonly contactIDs: ReadonlyArray<ContactId>;
      readonly message: string;
    }
  | {
      readonly type: MESSAGE_RESPONSE_TYPE.sticker;
      readonly media: Buffer;
      readonly mediaType: SUPPORTED_MEDIA_TYPE;
    }
  | {
      readonly type: MESSAGE_RESPONSE_TYPE.image;
      readonly image: DataURL | FilePath;
      readonly filename: string;
      readonly caption: string;
    }
  | {
      readonly type: MESSAGE_RESPONSE_TYPE.youtube;
      readonly link: string;
    }
  | {
      readonly type: MESSAGE_RESPONSE_TYPE.mention;
      readonly message: string;
    };

export type Command = {
  readonly name: string;
  readonly message: string;
};
