export enum MESSAGE_RESPONSE_TYPE {
  reply = "reply",
}

export type MessageResponse = {
  type: MESSAGE_RESPONSE_TYPE;
  message: string;
};

export type Command = {
  name: string;
  arguments: Array<string>;
};
