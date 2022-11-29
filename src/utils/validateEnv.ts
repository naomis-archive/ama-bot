import { WebhookClient } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

import { logHandler } from "./logHandler";

/**
 * Validates the environment variables.
 *
 * @returns {ExtendedClient["env"]} The bot's config values.
 */
export const validateEnv = (): ExtendedClient["env"] => {
  if (
    !process.env.DISCORD_TOKEN ||
    !process.env.MONGO_URI ||
    !process.env.DEBUG_HOOK
  ) {
    logHandler.log(
      "error",
      "Missing environment variables. Please check your .env file."
    );
    process.exit(1);
  }

  return {
    token: process.env.DISCORD_TOKEN,
    mongoUri: process.env.MONGO_URI,
    debugHook: new WebhookClient({
      url: process.env.DEBUG_HOOK,
    }),
  };
};
