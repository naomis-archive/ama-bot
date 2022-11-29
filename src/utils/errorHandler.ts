import { ExtendedClient } from "../interfaces/ExtendedClient";

import { logHandler } from "./logHandler";

/**
 * Handles logging the error to the terminal and sending it to the debug webhook.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {string} context A brief description of where the error occurred.
 * @param {Error} err The error object.
 */
export const errorHandler = async (
  bot: ExtendedClient,
  context: string,
  err: unknown
) => {
  const error = err as Error;
  logHandler.log("error", `${context}: ${error.message}`);
  logHandler.log("error", JSON.stringify(error.stack, null, 2));
  if (bot.env.debugHook) {
    await bot.env.debugHook.send({
      content: `${context}: ${error.message}`,
      avatarURL: bot.user?.displayAvatarURL(),
      username: bot.user?.username,
    });
    await bot.env.debugHook.send({
      content: "```\n" + JSON.stringify(error.stack, null, 2) + "\n```",
      avatarURL: bot.user?.displayAvatarURL(),
      username: bot.user?.username,
    });
  }
};
