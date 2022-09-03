import { generateClientMessage } from '../generators/client-message.generator';

export const MESSAGE_WITH_PONG_COMMAND = generateClientMessage({
  author: '5511987654321@c.us',
  body: '!ping',
});
