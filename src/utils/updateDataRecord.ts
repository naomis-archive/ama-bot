import ConfigModel from "../database/models/ConfigModel";
import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";

/**
 * Sets whether question submissions are open or not.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {string} serverId The server ID.
 * @param {boolean} value Whether questions can be submitted or not.
 * @returns {boolean} True on successful update.
 */
export const toggleQuestionSubmission = async (
  bot: ExtendedClient,
  serverId: string,
  value: boolean
): Promise<boolean> => {
  try {
    const record =
      (await ConfigModel.findOne({ serverId })) ||
      (await ConfigModel.create({
        serverId,
        questionChannel: "",
        enabled: false,
      }));

    record.enabled = value;

    await record.save();

    return true;
  } catch (err) {
    await errorHandler(bot, "update data record", err);
    return false;
  }
};

/**
 * Sets the question channel for the server.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {string} serverId The server ID.
 * @param {string} value The channel ID to post questions in.
 * @returns {boolean} True on successful update.
 */
export const setQuestionChannel = async (
  bot: ExtendedClient,
  serverId: string,
  value: string
): Promise<boolean> => {
  try {
    const record =
      (await ConfigModel.findOne({ serverId })) ||
      (await ConfigModel.create({
        serverId,
        questionChannel: "",
        enabled: false,
      }));

    record.questionChannel = value;

    await record.save();

    return true;
  } catch (err) {
    await errorHandler(bot, "update data record", err);
    return false;
  }
};
