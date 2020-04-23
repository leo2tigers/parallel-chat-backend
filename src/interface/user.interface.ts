import { Document, Schema } from 'mongoose';

export interface User extends Document {
    name: String;
    groupMembership: [
        {
            id: Schema.Types.ObjectId;
            message: [Schema.Types.ObjectId];
        },
    ];
}
