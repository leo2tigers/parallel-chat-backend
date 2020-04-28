import { Document, Schema } from 'mongoose';

export interface User extends Document {
    name: string;
    username: string;
    password: string;
    groupMembership: [
        {
            id: Schema.Types.ObjectId;
            message: [Schema.Types.ObjectId];
        },
    ];
}
