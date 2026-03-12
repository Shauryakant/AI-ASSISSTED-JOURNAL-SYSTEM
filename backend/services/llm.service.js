const Groq = require("groq-sdk");
require("dotenv").config();

const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Using a prompt that explicitly requests valid JSON
const analyzeEmotion = async (text) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{
                role: "system",
                content: "You are an emotion analyzer. Respond ONLY with a valid JSON object without markdown formatting, using these EXACT keys: 'emotion' (string, single word), 'keywords' (array of 3 to 5 strings), 'summary' (string, brief 1-sentence summary)."
            }, {
                role: "user",
                content: text
            }],
            model: GROQ_MODEL,
            temperature: 0.1,
            max_tokens: 300,
            response_format: { type: "json_object" }
        });

        const content = chatCompletion.choices[0]?.message?.content || "";
        const cleanedStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonResult = JSON.parse(cleanedStr);

        return {
            emotion: jsonResult.emotion || 'neutral',
            keywords: jsonResult.keywords || [],
            summary: jsonResult.summary || 'No summary generated.'
        };
    } catch (error) {
        console.error("LLM Service Error:", error);
        throw new Error(error?.message || "Failed to analyze emotion from groq");
    }
};

module.exports = {
    analyzeEmotion
};
