import { Client, Message } from "@open-wa/wa-automate";
import {
  COMMAND_PREFIX,
  MIN_COMMAND_NAME_LENGTH,
} from "./constants/message-handler";
import { format } from "date-fns";
import { fold, isRight } from "fp-ts/lib/Either";
import { MessageResponse } from "./interfaces";
import { isNil } from "lodash";
import { getCommandFromMessage, sendMessage } from "./helpers";
import { green, magenta, red, yellow } from "colorette";
import { BotService } from "./services/client";

export const onMessageReceived = async (
  client: Client,
  message: Message,
  botService: BotService
): Promise<void> => {
  //  Get the message metadata
  const { sender, isGroupMsg, chat, caption /* quotedMsg */ } = message;

  // Get the chat metadata
  const { formattedTitle /* groupMetadata */ } = chat;

  /** If the user send a image with media, we will try to get the caption that is the same as the text message, otherwise we will use the message text from `body` */
  const rawMessageText = (caption || message.body).trim().toLowerCase();

  /*   let quoteTxt = "";
  if (quotedMsg != null)
    quoteTxt =
      quotedMsg.caption || (quotedMsg.type == "chat" ? quotedMsg.body : "");

  const groupID = isGroupMsg ? groupMetadata.id : null;
 */
  // * verify if is a function
  if (
    rawMessageText.startsWith(COMMAND_PREFIX) &&
    rawMessageText.length > MIN_COMMAND_NAME_LENGTH
  ) {
    //formatted log
    const messageWithoutPrefix = rawMessageText.substring(1);
    console.log(
      green(sender.pushname + ":"),
      yellow('"' + rawMessageText + '"'),
      green(" at"),
      magenta(format(new Date(), "HH:mm")),
      isGroupMsg && formattedTitle ? green("from ") + red(formattedTitle) : ""
    );

    const commandEither = getCommandFromMessage(messageWithoutPrefix);

    if (isRight(commandEither)) {
      const command = commandEither.right;
      //* Get function
      const functionToExecute = botService[command.name];

      if (isNil(functionToExecute)) return void 0;

      const responseEither = await functionToExecute({
        parsedMessageText: messageWithoutPrefix,
        message,

        /*         argumentsTxt: rawMessageText,
        argumentsList: commandArguments,
        quoteTxt,
        chat,
        isGroupMsg,
        groupId: groupID,
        message, */
      });

      const onResponseReceive = fold<Error, MessageResponse, void>(
        // On Left
        (error) => console.error(error),
        // On Right
        (response) => sendMessage(client, message, response)
      );

      onResponseReceive(responseEither);
    }
  }
};
