import Groq from 'groq-sdk';

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

export const analyzeEmotion = async (text: string) => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not configured.');
    }

    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });

    const chatCompletion = await groq.chat.completions.create({
        messages: [{
            role: 'system',
            content: "You are an emotion analyzer. Respond ONLY with a valid JSON object without markdown formatting, using these EXACT keys: 'emotion' (string, single word), 'keywords' (array of 3 to 5 strings), 'summary' (string, brief 1-sentence summary)."
        }, {
            role: 'user',
            content: text
        }],
        model: GROQ_MODEL,
        temperature: 0.1,
        max_tokens: 300,
        response_format: { type: 'json_object' }
    });

    const content = chatCompletion.choices[0]?.message?.content || '';
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleaned);

    return {
        emotion: result.emotion || 'neutral',
        keywords: Array.isArray(result.keywords) ? result.keywords : [],
        summary: result.summary || 'No summary generated.'
    };
};
