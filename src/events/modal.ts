/* eslint-disable camelcase */
import { Colors, GuildMember, ModalSubmitInteraction } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Logic to process modal interactions.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {ModalSubmitInteraction} interaction The interaction payload from Discord.
 */
export const modal = async (
  bot: ExtendedClient,
  interaction: ModalSubmitInteraction
) => {
  try {
    await interaction.deferReply({ ephemeral: true });

    const { guild, member, message } = interaction;
    if (!guild || !member) {
      await interaction.reply({
        content: "How did you click a button outside of a server???",
        ephemeral: true,
      });
      return;
    }

    if (!message) {
      await interaction.editReply({
        content: "This question does not exist???",
      });
      return;
    }
    const question = message.embeds[0];

    if (interaction.customId === "answer") {
      const answer = interaction.fields.getTextInputValue("answer-input");

      await message.edit({
        embeds: [
          {
            title: "Answered!",
            description:
              question.description || "Oopsie~! I lost the question.",
            color: Colors.Green,
            fields: [
              {
                name: "Answered by:",
                value: `<@${(member as GuildMember).id}>`,
              },
              {
                name: "Answer:",
                value: answer,
              },
            ],
            footer: {
              text: `Join our server: https://discord.gg/nhcarrigan`,
              icon_url: "https://cdn.nhcarrigan.com/profile.png",
            },
            author: question.author || undefined,
          },
        ],
        components: [],
      });

      await interaction.editReply({
        content: "Question answered!",
      });
    }

    if (interaction.customId === "reject") {
      const reason = interaction.fields.getTextInputValue("reason");

      await message.edit({
        embeds: [
          {
            title: "Rejected!",
            description:
              question.description || "Oopsie~! I lost the question.",
            color: Colors.Red,
            fields: [
              {
                name: "Rejected by:",
                value: `<@${(member as GuildMember).id}>`,
              },
              {
                name: "Reason:",
                value: reason,
              },
            ],
            footer: {
              text: `Join our server: https://discord.gg/nhcarrigan`,
              icon_url: "https://cdn.nhcarrigan.com/profile.png",
            },
            author: question.author || undefined,
          },
        ],
        components: [],
      });

      await interaction.editReply({
        content: "Question rejected!",
      });
    }
  } catch (err) {
    await errorHandler(bot, "modal", err);
    await interaction.editReply({
      content: "There was an error processing your interaction.",
    });
  }
};
