import { Document, model, Schema } from "mongoose";

export interface Config extends Document {
  serverId: string;
  questionChannel: string;
  enabled: boolean;
}

export const ConfigSchema = new Schema<Config>({
  serverId: {
    type: String,
    required: true,
    unique: true,
  },
  questionChannel: {
    type: String,
    default: "",
  },
  enabled: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default model<Config>("Config", ConfigSchema);
