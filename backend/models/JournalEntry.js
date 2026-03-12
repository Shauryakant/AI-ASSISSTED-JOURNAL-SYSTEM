const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
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

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
