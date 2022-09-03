import { isString } from 'lodash';

import { getCommandList } from '~/helpers';
import { UtilsService } from '~/interfaces';

import { assertsIsReplyMessage } from '../tests/assertions';
import { MESSAGE_WITH_PONG_COMMAND } from '../tests/mocks';
import { generateUtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(() => {
    service = generateUtilsService();
  });

  it('Should generate', () => {
    expect(service).toBeTruthy();
  });

  it('Should RETURN "Pong" when call "ping"', () => {
    const response = service.ping({
      message: MESSAGE_WITH_PONG_COMMAND,
      parsedMessageText: '',
    });

    assertsIsReplyMessage(response);
    expect(response.message).toBe('Pong');
  });

  it('Should RETURN the command list when call "help"', () => {
    // * Generate commands helper list
    const displayedCommandList = getCommandList();

    const response = service.help({
      message: MESSAGE_WITH_PONG_COMMAND,
      parsedMessageText: '',
    });

    assertsIsReplyMessage(response);
    expect(response.message).toBe(displayedCommandList);
  });

  it('Should RETURN successfully when call "wiki"', async () => {
    const response = await service.wiki({
      message: MESSAGE_WITH_PONG_COMMAND,
      parsedMessageText: 'batman',
    });

    assertsIsReplyMessage(response);
    expect(isString(response.message)).toBe(true);
  });
});
