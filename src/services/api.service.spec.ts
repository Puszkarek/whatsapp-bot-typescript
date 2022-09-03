import { APIsService } from '~/interfaces';

import { generateAPIsService } from './api.service';

describe('APIsService', () => {
  let service: APIsService;

  beforeEach(() => {
    service = generateAPIsService();
  });

  it('Should generate', () => {
    expect(service).toBeTruthy();
  });
});
