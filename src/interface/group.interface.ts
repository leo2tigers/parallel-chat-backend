import { Document, Schema } from 'mongoose';

export interface Group extends Document {
    name: String;
    members: [Schema.Types.ObjectId];
}
