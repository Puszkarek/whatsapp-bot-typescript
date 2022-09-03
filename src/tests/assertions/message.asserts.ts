/* eslint-disable functional/no-throw-statement */
import { isString } from 'lodash';

import { MESSAGE_RESPONSE_TYPE, MessageResponse, ReplyMessageResponse } from '~/interfaces';

type AssertsIsReplyMessage = (value: unknown) => asserts value is ReplyMessageResponse;
export const assertsIsReplyMessage: AssertsIsReplyMessage = value => {
  const response = value as MessageResponse;
  if (response.type === MESSAGE_RESPONSE_TYPE.reply && isString(response.message)) {
    return void 0;
  }
  throw new Error('Invalid value');
};
