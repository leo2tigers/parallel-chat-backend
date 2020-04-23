import { Schema } from "mongoose";

export const MessageSchema = new Schema({
    message: String,
    sender: Schema.Types.ObjectId,
    group: Schema.Types.ObjectId,
    timeSent: { type: Date, default: Date.now()}
})
