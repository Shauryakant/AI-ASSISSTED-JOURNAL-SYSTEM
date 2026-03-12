import mongoose, { Model, Schema } from 'mongoose';

export type JournalEntryDocument = {
    userId: string;
    ambience: 'forest' | 'ocean' | 'mountain';
    text: string;
    emotion?: string;
    keywords?: string[];
    summary?: string;
    createdAt: Date;
    updatedAt: Date;
};

const journalEntrySchema = new Schema<JournalEntryDocument>({
    userId: {
        type: String,
        required: true,
    },
    ambience: {
        type: String,
        required: true,
        enum: ['forest', 'ocean', 'mountain'],
    },
    text: {
        type: String,
        required: true,
    },
    emotion: {
        type: String,
    },
    keywords: [{
        type: String,
    }],
    summary: {
        type: String,
    },
}, { timestamps: true });

const JournalEntry = (mongoose.models.JournalEntry as Model<JournalEntryDocument>) || mongoose.model<JournalEntryDocument>('JournalEntry', journalEntrySchema);

export default JournalEntry;
