import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";
import { sendDebugMessage } from "./sendDebugMessage";

/**
 * Registers the commands for the bot.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @returns {boolean} True on successful registration.
 */
export const registerCommands = async (
  bot: ExtendedClient
): Promise<boolean> => {
  try {
    if (!bot.user?.id) {
      await sendDebugMessage(
        bot,
        "Cannot register commands as bot has not authenticated to Discord."
      );
      return false;
    }
    const rest = new REST({ version: "10" }).setToken(bot.env.token);
    const commandData = bot.commands.map((command) => command.data.toJSON());

    if (!commandData.length) {
      await sendDebugMessage(bot, "No commands found to register.");
      return false;
    }

    await sendDebugMessage(bot, "Registering commands to guild.");
    await rest.put(Routes.applicationCommands(bot.user.id), {
      body: commandData,
    });
    return true;
  } catch (err) {
    await errorHandler(bot, "register commands", err);
    return false;
  }
};
