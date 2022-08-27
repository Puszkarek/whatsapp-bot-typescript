import { every, isArray, isObject, isString, map, trim } from 'lodash';
import fs from 'node:fs';

import { APP_LANGUAGE, COMMAND_PREFIX } from '~/constants';

export const getInsultList = (): ReadonlyArray<string> => {
  const rawInsultList: unknown = JSON.parse(fs.readFileSync(`src/assets/texts/${APP_LANGUAGE}/insults.json`, 'utf8'));
  const insultList: ReadonlyArray<string> =
    isArray(rawInsultList) && every(rawInsultList, isString) ? rawInsultList : [];

  return insultList;
};

export const getCatFactsList = (): ReadonlyArray<string> => {
  const rawCatFactsList: unknown = JSON.parse(
    fs.readFileSync(`src/assets/texts/${APP_LANGUAGE}/cat-facts.json`, 'utf8'),
  );
  const catFactsList: ReadonlyArray<string> =
    isArray(rawCatFactsList) && every(rawCatFactsList, isString) ? rawCatFactsList : [];

  return catFactsList;
};

export const getCommandList = (): string => {
  const rawCommandList: unknown = JSON.parse(fs.readFileSync('~/assets/texts/pt/help.json', 'utf8'));

  if (isObject(rawCommandList)) {
    const entries = Object.entries(rawCommandList as Record<string, string>);
    const commandList = map(entries, ([key, description]) => {
      return `${COMMAND_PREFIX + key}\n${description}\n\n───────────────\n\n`;
    });

    return trim(commandList.join('\n\n'));
  }

  return '';
};
