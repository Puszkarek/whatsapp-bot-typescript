import { includes } from 'lodash';

import { EntertainmentService } from '~/interfaces';

import { assertsIsReplyMessage } from '../tests/assertions';
import { MESSAGE_WITH_PONG_COMMAND } from '../tests/mocks';
import { generateEntertainmentService } from './entertainment.service';

describe('EntertainmentService', () => {
  let service: EntertainmentService;

  beforeEach(() => {
    service = generateEntertainmentService();
  });

  it('Should generate', () => {
    expect(service).toBeTruthy();
  });

  it('Should RETURN one of the given values when call "choose"', () => {
    const response = service.choose({
      message: MESSAGE_WITH_PONG_COMMAND,
      parsedMessageText: 'one, two',
    });

    assertsIsReplyMessage(response);
    expect(includes(['one', 'two'], response.message)).toBe(true);
  });

  it('Should RETURN the length of the message when call "countwords"', () => {
    const _parsedMessageText = 'some-big-big-big-message';
    const response = service.countwords({
      message: MESSAGE_WITH_PONG_COMMAND,
      parsedMessageText: _parsedMessageText,
    });

    assertsIsReplyMessage(response);
    expect(includes(response.message, _parsedMessageText.length.toString())).toBe(true);
  });
});
