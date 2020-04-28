import { Document, Schema } from 'mongoose';

export interface Message extends Document {
    message: string;
    sender: Schema.Types.ObjectId;
    group: Schema.Types.ObjectId;
    timeSent: Date;
}
