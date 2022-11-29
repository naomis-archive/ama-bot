import { ExtendedClient } from "../interfaces/ExtendedClient";

/**
 * Sends a log message to the worker log hook.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {string} message The message to send.
 */
export const sendDebugMessage = async (
  bot: ExtendedClient,
  message: string
) => {
  if (bot.env.debugHook) {
    await bot.env.debugHook.send({
      content: message,
      avatarURL: bot.user?.displayAvatarURL(),
      username: bot.user?.username,
    });
  }
};
