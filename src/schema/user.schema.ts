import { Schema } from 'mongoose';

export const UserSchema = new Schema({
    name: String,
    username: String,
    password: String,
    groupMembership: [
        {
            group: { type: Schema.Types.ObjectId, ref: 'Group' },
            lastAccess: { type: Date, default: new Date(0) },
        },
    ],
});
