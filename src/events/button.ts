import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
} from "@discordjs/builders";
import {
  ButtonInteraction,
  Colors,
  GuildMember,
  PermissionFlagsBits,
  TextInputStyle,
} from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Logic to process button interactions.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {ButtonInteraction} interaction The interaction payload from Discord.
 */
export const button = async (
  bot: ExtendedClient,
  interaction: ButtonInteraction
) => {
  try {
    const { guild, member } = interaction;
    if (!guild || !member) {
      await interaction.reply({
        content: "How did you click a button outside of a server???",
        ephemeral: true,
      });
      return;
    }

    if (
      !(member as GuildMember).permissions.has(PermissionFlagsBits.ManageGuild)
    ) {
      await interaction.reply({
        content:
          "You must have the `Manage Server` permission to run this command.",
        ephemeral: true,
      });
      return;
    }

    if (interaction.customId === "acknowledge") {
      const embed = interaction.message.embeds[0];
      await interaction.message.edit({
        embeds: [
          {
            title: "Answered!",
            description: embed.description || "Oopsie~! I lost the question.",
            color: Colors.Green,
            fields: [
              {
                name: "Answered by:",
                value: `<@${(member as GuildMember).id}>`,
              },
            ],
            footer: {
              text: `Find the bot helpful? Consider donating to support its development! https://donate.naomi.lgbt`,
              // eslint-disable-next-line camelcase
              icon_url: "https://cdn.nhcarrigan.com/profile.png",
            },
            author: embed.author || undefined,
          },
        ],
      });
      await interaction.reply({
        content: "Question marked as answered!",
        ephemeral: true,
      });
    }

    if (interaction.customId === "answer") {
      const input = new TextInputBuilder()
        .setLabel("What's the answer?")
        .setPlaceholder("Answer here...")
        .setCustomId("answer-input")
        .setMaxLength(1000)
        .setStyle(TextInputStyle.Paragraph);
      const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);

      const modal = new ModalBuilder();
      modal.setTitle("Answer Question");
      modal.setCustomId("answer");
      modal.addComponents(row);

      await interaction.showModal(modal);
    }

    if (interaction.customId === "reject") {
      const input = new TextInputBuilder()
        .setLabel("Why are you rejecting this question?")
        .setPlaceholder("Reason here...")
        .setCustomId("reason")
        .setMaxLength(1000)
        .setStyle(TextInputStyle.Paragraph);
      const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);

      const modal = new ModalBuilder();
      modal.setTitle("Reject Question");
      modal.setCustomId("reject");
      modal.addComponents(row);

      await interaction.showModal(modal);
    }
  } catch (err) {
    await errorHandler(bot, "button interaction listener", err);
    await interaction.reply({
      content: "There was an error processing your interaction.",
      ephemeral: true,
    });
  }
};
