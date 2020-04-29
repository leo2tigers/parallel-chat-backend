import { Document, Schema } from 'mongoose';

export interface Group extends Document {
    groupName: string;
    userId: string;
    members: Array<string>;
    messages: Array<string>;
}
