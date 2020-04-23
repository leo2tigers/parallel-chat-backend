import { Schema } from 'mongoose';

export const UserSchema = new Schema({
    name: String,
    groupMembership: [
        {
            id: Schema.Types.ObjectId,
            message: [Schema.Types.ObjectId],
        },
    ],
});
