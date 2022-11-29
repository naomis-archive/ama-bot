import { ChatInputCommandInteraction } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Logic to process slash command interactions.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {ChatInputCommandInteraction} interaction The interaction payload from Discord.
 */
export const chatInput = async (
  bot: ExtendedClient,
  interaction: ChatInputCommandInteraction
) => {
  try {
    const targetCommand = bot.commands.find(
      (c) => c.data.name === interaction.commandName
    );
    if (!targetCommand) {
      await interaction.reply({
        content:
          "This command does not exist??? Please reach out in our support server: https://discord.gg/nhcarrigan",
        ephemeral: true,
      });
      return;
    }
    await targetCommand.run(bot, interaction);
  } catch (err) {
    await errorHandler(bot, "chat input command listener", err);
    await interaction.reply({
      content: "There was an error processing your interaction.",
      ephemeral: true,
    });
  }
};
