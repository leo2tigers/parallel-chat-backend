import { Document, Schema } from 'mongoose';

export interface Group extends Document {
    groupName: string;
    creatorId: string;
    members: Array<string>;
    messages: Array<string>;
}
