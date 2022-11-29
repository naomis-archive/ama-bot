import { connect } from "mongoose";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Instantiates the MongoDB connection.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const connectDb = async (bot: ExtendedClient) => {
  try {
    await connect(bot.env.mongoUri);
  } catch (err) {
    await errorHandler(bot, "connect to database", err);
  }
};
