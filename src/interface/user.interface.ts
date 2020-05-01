import { Document, Schema } from 'mongoose';

export interface User extends Document {
    name: string;
    username: string;
    password: string;
    groupMembership: Array<{
        group: string;
        lastAccess?: Date;
    }>;
}
