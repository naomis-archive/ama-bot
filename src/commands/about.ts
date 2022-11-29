import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const about: Command = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("Learn more about this bot~!")
    .setDMPermission(false),
  run: async (bot, interaction) => {
    try {
      const aboutEmbed = new EmbedBuilder();
      aboutEmbed.setTitle("Naomi's AMA Bot~!");
      aboutEmbed.setDescription(
        "This is a bot that helps you collect questions to run AMA events in your server."
      );

      const sourceCodeButton = new ButtonBuilder()
        .setLabel("View the Source Code")
        .setURL("https://github.com/nhcarrigan/ama-bot")
        .setStyle(ButtonStyle.Link);
      const inviteButton = new ButtonBuilder()
        .setLabel("Invite the Bot")
        .setURL(
          "https://discord.com/api/oauth2/authorize?client_id=1046933883641417882&permissions=0&scope=bot%20applications.commands"
        )
        .setStyle(ButtonStyle.Link);
      const donateButton = new ButtonBuilder()
        .setLabel("Support Naomi's Work")
        .setURL("https://naomi.lgbt/temple")
        .setStyle(ButtonStyle.Link);
      const supportButton = new ButtonBuilder()
        .setLabel("Join our Support Server")
        .setURL("https://discord.gg/nhcarrigan")
        .setStyle(ButtonStyle.Link);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        sourceCodeButton,
        inviteButton,
        donateButton,
        supportButton
      );

      await interaction.reply({ embeds: [aboutEmbed], components: [row] });
    } catch (err) {
      await errorHandler(bot, "about command", err);
    }
  },
};
