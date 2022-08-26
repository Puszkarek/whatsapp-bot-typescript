import { makeMessageHandler } from "./message-handler";
import {
  create,
  Client,
  ConfigObject,
  AdvancedConfig,
  STATE,
} from "@open-wa/wa-automate";

const launchConfig: AdvancedConfig | ConfigObject = {
  useChrome: true,
  autoRefresh: true,
  cacheEnabled: true,
  sessionId: "puszkarek",
  headless: true,
  maxQr: 10,
  qrTimeout: 30, //kills the session if the QR code is not scanned within 30 seconds.
  authTimeout: 30, //kills the session if the session hasn't authentication 30 seconds (e.g If the session has the right credentials but the phone is off).
};

const onServerStarted = (client: Client) => {
  // Generate message handler
  const onMessageReceived = makeMessageHandler();

  console.log("[!] Server Started!");

  // * When the client status change
  client.onStateChanged((state) => {
    console.log("[Client State]", state);

    if (state === STATE.CONFLICT || state === STATE.UNLAUNCHED)
      client.forceRefocus();
  });

  // * When the user send a message
  client.onMessage(async (message) => {
    const messagesLoaded = await client.getAmountOfLoadedMessages();

    /** Skip the new messages if we have too much in cache to load */
    if (messagesLoaded >= 100) {
      client.cutMsgCache();
    }

    onMessageReceived(client, message);
  });

  /*  client.onMessageDeleted() */
};

create(launchConfig).then(onServerStarted);
