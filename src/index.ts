import { AdvancedConfig, ConfigObject, create, STATE } from '@open-wa/wa-automate';

import { makeMessageHandler } from './message-handler';

const launchConfig: AdvancedConfig | ConfigObject = {
  // Kills the session if the QR code is not scanned within 30 seconds.
  authTimeout: 30,

  autoRefresh: true,

  cacheEnabled: true,

  headless: true,

  maxQr: 10,

  qrTimeout: 30,

  sessionId: 'puszkarek',
  useChrome: true, // Kills the session if the session hasn't authentication 30 seconds (e.g If the session has the right credentials but the phone is off).
} as const;

export const settings = {
  maxCachedMessages: 100,
} as const;

const startServer = async (): Promise<void> => {
  const client = await create(launchConfig);
  // Generate message handler
  const onMessageReceived = makeMessageHandler();

  console.log('[!] Server Started!');

  // * When the client status change
  await client.onStateChanged(async state => {
    console.log('[Client State]', state);

    if (state === STATE.CONFLICT || state === STATE.UNLAUNCHED) {
      await client.forceRefocus();
    }
  });

  // * When the user send a message
  await client.onMessage(async message => {
    const messagesLoaded = await client.getAmountOfLoadedMessages();

    /** Skip the new messages if we have too much in cache to load */
    if (messagesLoaded >= settings.maxCachedMessages) {
      await client.cutMsgCache();
    }

    await onMessageReceived(client, message);
  });
};

// * Node do not support top level async
// eslint-disable-next-line @typescript-eslint/no-floating-promises
startServer();
