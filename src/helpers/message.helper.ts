import { Client, Message } from "@open-wa/wa-automate";
import { Either, right, left } from "fp-ts/lib/Either";
import { COMMAND_ARGS_SEPARATOR } from "../constants";
import { Command, MessageResponse, MESSAGE_RESPONSE_TYPE } from "../interfaces";

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

export const getCommandFromMessage = (
  message: string
): Either<Error, Command> => {
  const [commandToExecute, ...args] = message.split(COMMAND_ARGS_SEPARATOR);

  if (commandToExecute) {
    return right({
      name: commandToExecute,
      arguments: args,
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
      console.log("reply", response.message);
      await client.reply(from, response.message, id);
      break;
  }
};
