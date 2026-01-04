import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { topic, difficulty, type, userId } = req.body;

        if (!topic || !userId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // ✅ CHECK FIRESTORE CACHE FIRST
        const topicKey = topic.toLowerCase().replace(/[^a-z0-9]/g, "_");
        const cacheRef = doc(db, "users", userId, "explanations", topicKey);
        const cacheSnap = await getDoc(cacheRef);

        if (cacheSnap.exists()) {
            const cached = cacheSnap.data();
            console.log("✅ Cache HIT for topic:", topic);
            return res.status(200).json({
                explanation: cached.explanation,
                topic: cached.topic,
                cached: true
            });
        }

        console.log("❌ Cache MISS for topic:", topic, "- calling Gemini");

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ 
                error: "Explanation unavailable right now. Cached explanations will be used when available.",
                fallback: true 
            });
        }

        const prompt = `
You are Nexora, an AI study mentor helping students prepare for exams.

Explain this topic in a clear, exam-focused way:

Topic: ${topic}
Difficulty: ${difficulty || "medium"}
Study Type: ${type || "study"}

Provide:
1. Brief overview (2-3 lines)
2. Key concepts to remember (3-5 bullet points)
3. Common exam patterns or questions
4. One memory tip or mnemonic

Rules:
- Keep it concise and exam-focused
- Use simple, clear language
- Focus on what students need to know for exams
- Make it practical and actionable
- Max 10-12 lines total
`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: prompt }],
                        },
                    ],
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini Topic Explain Error:", data);
            
            if (data.error?.message?.includes("quota") || data.error?.message?.includes("limit")) {
                return res.status(200).json({ 
                    error: "Explanation unavailable right now. Cached explanations will be used when available.",
                    quotaExceeded: true,
                    fallback: true
                });
            }
            
            return res.status(200).json({ 
                error: "Explanation unavailable right now. Cached explanations will be used when available.",
                fallback: true 
            });
        }

        const explanation =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            null;

        if (!explanation) {
            return res.status(200).json({ 
                error: "Explanation unavailable right now. Cached explanations will be used when available.",
                fallback: true 
            });
        }

        // ✅ CACHE THE EXPLANATION IN FIRESTORE
        await setDoc(cacheRef, {
            topic,
            explanation,
            difficulty: difficulty || "medium",
            type: type || "study",
            generatedAt: new Date().toISOString()
        });

        console.log("✅ Cached explanation for topic:", topic);

        return res.status(200).json({ 
            explanation,
            topic,
            cached: false
        });

    } catch (err) {
        console.error("Explain Topic API error:", err);
        return res.status(200).json({ 
            error: "Explanation unavailable right now. Cached explanations will be used when available.",
            fallback: true 
        });
    }
}
