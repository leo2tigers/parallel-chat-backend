import { Schema } from 'mongoose';

export const GroupSchema = new Schema({
    groupName: String,
    creator: { type: Schema.Types.ObjectId, ref: 'User'},
    members: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message'}],
});
