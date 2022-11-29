import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";

import ConfigModel from "../database/models/ConfigModel";
import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const ask: Command = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask a question for the current AMA~!")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question you want to ask.")
        .setRequired(true)
        .setMaxLength(4000)
    )
    .addBooleanOption((option) =>
      option
        .setName("anonymous")
        .setDescription("Whether or not you want to remain anonymous.")
        .setRequired(true)
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

      const record = await ConfigModel.findOne({ serverId: guild.id });

      if (!record || !record.questionChannel || !record.enabled) {
        await interaction.editReply(
          "It does not look like the AMA is enabled at this time."
        );
        return;
      }

      const question = interaction.options.getString("question", true);
      const anonymous = interaction.options.getBoolean("anonymous", true);

      const channel = await guild.channels.fetch(record.questionChannel);

      if (!channel || !("send" in channel)) {
        await interaction.editReply(
          "I can't seem to find the configured question channel."
        );
        return;
      }

      const embed = new EmbedBuilder();
      embed.setTitle("New Question");
      embed.setDescription(question);
      embed.setFooter({
        text: `Find the bot helpful? Consider donating to support its development! https://donate.naomi.lgbt`,
        iconURL: "https://cdn.nhcarrigan.com/profile.png",
      });

      if (!anonymous) {
        embed.setAuthor({
          name: (member as GuildMember).user.tag,
          iconURL: (member as GuildMember).user.displayAvatarURL(),
        });
      }

      const acknowledgeButton = new ButtonBuilder()
        .setCustomId("acknowledge")
        .setLabel("Acknowledge without answering")
        .setStyle(ButtonStyle.Success);
      const answerButton = new ButtonBuilder()
        .setCustomId("answer")
        .setLabel("Answer this question")
        .setStyle(ButtonStyle.Success);
      const rejectButton = new ButtonBuilder()
        .setCustomId("reject")
        .setLabel("Reject this question")
        .setStyle(ButtonStyle.Danger);
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        acknowledgeButton,
        answerButton,
        rejectButton
      );

      await channel.send({ embeds: [embed], components: [row] });
      await interaction.editReply("Question submitted!");
    } catch (err) {
      await errorHandler(bot, "ask command", err);
      await interaction.editReply({
        content: "There was an error while running this command!",
      });
    }
  },
};
