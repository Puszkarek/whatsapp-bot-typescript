import {
  create,
  Client,
  ConfigObject,
  AdvancedConfig,
} from "@open-wa/wa-automate";

const launchConfig: AdvancedConfig | ConfigObject = {
  useChrome: true,
  autoRefresh: true,
  cacheEnabled: false,
  sessionId: "hr",
  headless: true,
  maxQr: 10,
  qrTimeout: 30, //kills the session if the QR code is not scanned within 30 seconds.
  authTimeout: 30, //kills the session if the session hasn't authentication 30 seconds (e.g If the session has the right credentials but the phone is off).
};

const start = (client: Client) => {
  client.onMessage(async (message) => {
    if (message.body === "Hi") {
      await client.sendText(message.from, "👋 Hello!");
    }
  });
};

create(launchConfig).then(start);
