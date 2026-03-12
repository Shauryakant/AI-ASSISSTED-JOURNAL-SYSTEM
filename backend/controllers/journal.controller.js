const JournalEntry = require('../models/JournalEntry');
const { analyzeEmotion } = require('../services/llm.service');

// POST /api/journal
const createJournalEntry = async (req, res) => {
    try {
        const { userId, ambience, text, emotion, keywords, summary } = req.body;

        const entryData = {
            userId,
            ambience,
            text,
            emotion: emotion || "unknown",
            keywords: keywords || [],
            summary: summary || ""
        };

        const newEntry = await JournalEntry.create(entryData);
        res.status(201).json(newEntry);
    } catch (error) {
        console.error("Create entry error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/journal/:userId
const getJournalEntries = async (req, res) => {
    try {
        const { userId } = req.params;
        const entries = await JournalEntry.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(entries);
    } catch (error) {
        console.error("Get entries error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

// POST /api/journal/analyze
const analyzeEmotionHandler = async (req, res) => {
    try {
        const { text } = req.body;
        const analysis = await analyzeEmotion(text);
        res.status(200).json(analysis);
    } catch (error) {
        console.error("Analyze error:", error);
        res.status(500).json({ error: error.message || 'Failed to analyze text' });
    }
};

// GET /api/journal/insights/:userId
const getInsights = async (req, res) => {
    try {
        const { userId } = req.params;
        const entries = await JournalEntry.find({ userId });

        if (!entries || entries.length === 0) {
            return res.status(200).json({
                totalEntries: 0,
                topEmotion: "None",
                mostUsedAmbience: "None",
                recentKeywords: []
            });
        }

        const stats = {
            emotions: {},
            ambiences: {},
        };

        let allKeywords = [];

        entries.forEach(entry => {
            if (entry.emotion && entry.emotion !== 'unknown' && entry.emotion !== 'neutral') {
                stats.emotions[entry.emotion] = (stats.emotions[entry.emotion] || 0) + 1;
            }
            if (entry.ambience) {
                stats.ambiences[entry.ambience] = (stats.ambiences[entry.ambience] || 0) + 1;
            }
            if (entry.keywords && Array.isArray(entry.keywords)) {
                allKeywords.push(...entry.keywords);
            }
        });

        const getTop = (obj) => Object.keys(obj).sort((a, b) => obj[b] - obj[a])[0] || "None";

        // Count keywords
        const keywordCounts = {};
        allKeywords.forEach(kw => {
            if (typeof kw === 'string') {
                kw = kw.toLowerCase().trim();
                keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
            }
        });

        const recentKeywords = Object.keys(keywordCounts)
            .sort((a, b) => keywordCounts[b] - keywordCounts[a])
            .slice(0, 5); // top 5

        res.status(200).json({
            totalEntries: entries.length,
            topEmotion: getTop(stats.emotions),
            mostUsedAmbience: getTop(stats.ambiences),
            recentKeywords: recentKeywords
        });

    } catch (error) {
        console.error("Insights error:", error);
        res.status(500).json({ error: 'Server error computing insights' });
    }
}

module.exports = {
    createJournalEntry,
    getJournalEntries,
    analyzeEmotionHandler,
    getInsights
};
