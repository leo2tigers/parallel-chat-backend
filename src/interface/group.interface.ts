import { Document, Schema } from 'mongoose';

export interface Group extends Document {
    name: string;
    members: [Schema.Types.ObjectId];
}
