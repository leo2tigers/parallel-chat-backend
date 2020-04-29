import { Schema } from 'mongoose';

export const GroupSchema = new Schema({
    groupName: String,
    creatorId: Schema.Types.ObjectId,
    members: [Schema.Types.ObjectId],
    messages: [Schema.Types.ObjectId],
});
