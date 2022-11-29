import { Client } from "discord.js";

import { Intents } from "./config/Intents";
import { connectDb } from "./database/connectDb";
import { handleEvents } from "./events/handleEvents";
import { ExtendedClient } from "./interfaces/ExtendedClient";
import { loadCommands } from "./utils/loadCommands";
import { validateEnv } from "./utils/validateEnv";

(async () => {
  const bot = new Client({ intents: Intents }) as ExtendedClient;
  bot.env = validateEnv();
  bot.commands = await loadCommands(bot);
  await connectDb(bot);
  await handleEvents(bot);

  await bot.login(bot.env.token);
})();
