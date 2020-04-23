import { Document, Schema } from "mongoose";

export interface Message extends Document {
    message: String;
    sender: Schema.Types.ObjectId;
    group: Schema.Types.ObjectId;
    timeSent: Date;
}
