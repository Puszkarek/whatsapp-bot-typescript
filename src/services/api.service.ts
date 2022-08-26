import { decryptMedia } from "@open-wa/wa-automate";
import { isNil, isArray } from "lodash";
import { createReplyMessage, createStickerMessage } from "../helpers";
import { AsyncServiceMethod } from "../interfaces";
import { NEEDS_MEDIA_MESSAGE } from "../messages";
import { ServiceMethod } from "../interfaces/service.interface";
import { SEARCH_ERROR_MESSAGE } from "../messages/common.message";
import wiki from "wikipedia";
import dwiki from "../libs/desciclopedia/dist";
import fs from "fs";
import { randomInt } from "../helpers/number.helper";
import { COMMAND_PREFIX } from "../constants/message-handler";

/** Service that uses external apis to send messages */
export const generateUtilsService = (): {
  [key: string]: AsyncServiceMethod | ServiceMethod;
} => {
  // * Return the methods
  return {};
};
