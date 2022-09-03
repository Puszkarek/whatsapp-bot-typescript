import { BotService } from '~/interfaces';

import { generateBotService } from './client.service';

describe('BotService', () => {
  let service: BotService;

  beforeEach(() => {
    service = generateBotService();
  });

  it('Should generate', () => {
    expect(service).toBeTruthy();
  });
});
