import {
  ChannelType,
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";
import { setQuestionChannel } from "../utils/updateDataRecord";

export const channel: Command = {
  data: new SlashCommandBuilder()
    .setName("channel")
    .setDescription("Set the channel where the AMA questions should be posted.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel where the AMA questions should be posted.")
        .setRequired(true)
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.GuildAnnouncement,
          ChannelType.PublicThread,
          ChannelType.PrivateThread
        )
    )
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

      const channel = interaction.options.getChannel("channel", true);

      if (!("send" in channel)) {
        await interaction.editReply(
          "The channel you provided is not a text channel."
        );
        return;
      }

      const success = await setQuestionChannel(bot, guild.id, channel.id);

      await interaction.editReply({
        content: success
          ? `Questions will post in <#${channel.id}>!`
          : "There was an error in updating your settings.",
      });
    } catch (err) {
      await errorHandler(bot, "channel command", err);
      await interaction.editReply({
        content: "There was an error while running this command!",
      });
    }
  },
};
