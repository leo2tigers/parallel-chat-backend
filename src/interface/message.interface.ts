import { Document, Schema } from 'mongoose';

export interface Message extends Document {
    message: string;
    sender?: string;
    group: string;
    isJoinOrLeaveMessage?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
