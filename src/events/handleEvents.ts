import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";
import { registerCommands } from "../utils/registerCommands";
import { sendDebugMessage } from "../utils/sendDebugMessage";

import { button } from "./button";
import { chatInput } from "./chatInput";
import { modal } from "./modal";

/**
 * Mounts the event listeners for Discord.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const handleEvents = async (bot: ExtendedClient) => {
  try {
    bot.on("ready", async () => {
      await sendDebugMessage(bot, `Bot authenticated as ${bot.user?.tag}`);
      await registerCommands(bot);
    });

    bot.on("interactionCreate", async (interaction) => {
      if (interaction.isChatInputCommand()) {
        await chatInput(bot, interaction);
      }

      if (interaction.isButton()) {
        await button(bot, interaction);
      }

      if (interaction.isModalSubmit()) {
        await modal(bot, interaction);
      }
    });

    bot.on("guildCreate", async (guild) => {
      await sendDebugMessage(
        bot,
        `Joined guild ${guild.name} (${guild.id}) owned by ${
          (
            await guild.fetchOwner()
          ).user.tag
        } (${guild.ownerId})`
      );
    });

    bot.on("guildDelete", async (guild) => {
      await sendDebugMessage(
        bot,
        `Left guild ${guild.name} (${guild.id}) owned by ID (${guild.ownerId})`
      );
    });
  } catch (err) {
    await errorHandler(bot, "handle events", err);
  }
};
