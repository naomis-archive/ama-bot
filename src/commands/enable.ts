import {
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";
import { toggleQuestionSubmission } from "../utils/updateDataRecord";

export const enable: Command = {
  data: new SlashCommandBuilder()
    .setName("enable")
    .setDescription("Open the AMA for question submissions.")
    .setDMPermission(false),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });
      const { guild, member } = interaction;

      if (!guild || !member) {
        await interaction.editReply("This command must be run in a server.");
        return;
      }

      if (
        !(member as GuildMember).permissions.has(
          PermissionFlagsBits.ManageGuild
        )
      ) {
        await interaction.editReply(
          "You must have the `Manage Server` permission to run this command."
        );
        return;
      }

      const success = await toggleQuestionSubmission(bot, guild.id, true);

      await interaction.editReply({
        content: success
          ? "AMA submissions enabled!"
          : "There was an error in updating your settings.",
      });
    } catch (err) {
      await errorHandler(bot, "enable command", err);
      await interaction.editReply({
        content: "There was an error while running this command!",
      });
    }
  },
};
