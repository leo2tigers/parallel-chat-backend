import { Schema } from 'mongoose';

export const MessageSchema = new Schema(
    {
        message: String,
        sender: { type: Schema.Types.ObjectId, ref: 'User' },
        group: { type: Schema.Types.ObjectId, ref: 'Group' },
        isJoinOrLeaveMessage: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);
