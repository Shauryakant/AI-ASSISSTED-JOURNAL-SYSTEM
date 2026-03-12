const express = require('express');
const {
    createJournalEntry,
    getJournalEntries,
    analyzeEmotionHandler,
    getInsights
} = require('../controllers/journal.controller');
const { validateRequest } = require('../middleware/validate.middleware');
const { z } = require('zod');

const router = express.Router();

const journalEntrySchema = z.object({
    userId: z.string().min(1),
    ambience: z.enum(['forest', 'ocean', 'mountain']),
    text: z.string().min(1),
    emotion: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    summary: z.string().optional(),
});

const analyzeSchema = z.object({
    text: z.string().min(1)
});

router.post('/', validateRequest(journalEntrySchema), createJournalEntry);
router.get('/:userId', getJournalEntries);
router.post('/analyze', validateRequest(analyzeSchema), analyzeEmotionHandler);
router.get('/insights/:userId', getInsights);

module.exports = router;
