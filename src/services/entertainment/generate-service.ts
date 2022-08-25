import fs from "fs";
import { isArray } from "lodash";
import { createReplyMessage, randomInt } from "../../helpers";
import { ServiceMethod } from "../../interfaces";
import { measurerText } from "../../messages";

export const generateEntertainmentService = () => {
  // * Generate insults list
  const rawInsultList: unknown = JSON.parse(
    fs.readFileSync("src/assets/texts/pt/insults.json", "utf-8")
  );
  const insultList = isArray(rawInsultList) ? rawInsultList : [];

  // * Return the methods
  return (): { [key: string]: ServiceMethod } => {
    return {
      /** Measurer something */
      measurer: ({ rawMessage }) => {
        const mod_type = rawMessage.trim();
        const mod = randomInt(100);

        return createReplyMessage(measurerText(mod, mod_type));
      },
      /** Send random insults */
      insults: () => {
        return createReplyMessage(insultList[randomInt(insultList.length)]);
      },
      ping: () => {
        return createReplyMessage("Pong");
      },
    };
  };
};
