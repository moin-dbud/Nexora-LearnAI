import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function handler(req, res) {
    console.log("🔥 /api/explainPlan HIT", req.body);

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { user, dayPlan } = req.body;

        // Validate input first
        if (!dayPlan || !Array.isArray(dayPlan.tasks)) {
            return res.status(400).json({ error: "Invalid day plan" });
        }

        // Check if explanation is already in dayPlan object
        if (dayPlan.explanation) {
            console.log("✅ Explanation already in dayPlan object");
            return res.status(200).json({ text: dayPlan.explanation, cached: true });
        }

        // ✅ CHECK FIRESTORE CACHE FIRST
        if (user?.uid && dayPlan.date) {
            const planKey = `plan_${dayPlan.date}`;
            const cacheRef = doc(db, "users", user.uid, "planExplanations", planKey);
            const cacheSnap = await getDoc(cacheRef);

            if (cacheSnap.exists()) {
                const cached = cacheSnap.data();
                console.log("✅ Cache HIT for plan:", dayPlan.date);
                return res.status(200).json({ 
                    text: cached.explanation, 
                    cached: true 
                });
            }

            console.log("❌ Cache MISS for plan:", dayPlan.date, "- calling Gemini");
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ 
                error: "Explanation unavailable right now. Cached explanations will be used when available.",
                fallback: true 
            });
        }

        const taskSummary = dayPlan.tasks
            .map(
                (t) =>
                    `• ${t.topic} (${t.type}, ${t.duration} mins, ${t.priority} priority)`
            )
            .join("\n");

        const prompt = `
You are Nexora, an AI study mentor.

Explain TODAY'S study plan in a calm, motivating way.

Student:
- Name: ${user?.displayName || "Student"}
- Exam Date: ${user?.examDate || "N/A"}
- Daily Study Hours: ${user?.dailyStudyHours || "N/A"}

Today's Plan:
${taskSummary}

Rules:
- Do NOT repeat the tasks
- Explain WHY this mix was chosen
- Mention balance (focus + revision)
- Max 6–8 lines
- Friendly, supportive tone
`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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
            console.error("Gemini Explain Error:", data);
            
            // Check for quota exceeded
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

        const text =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            null;

        if (!text) {
            return res.status(200).json({ 
                error: "Explanation unavailable right now. Cached explanations will be used when available.",
                fallback: true 
            });
        }

        // ✅ CACHE THE EXPLANATION IN FIRESTORE
        if (user?.uid && dayPlan.date) {
            const planKey = `plan_${dayPlan.date}`;
            const cacheRef = doc(db, "users", user.uid, "planExplanations", planKey);
            
            await setDoc(cacheRef, {
                explanation: text,
                date: dayPlan.date,
                day: dayPlan.day,
                taskCount: dayPlan.tasks.length,
                generatedAt: new Date().toISOString()
            });

            console.log("✅ Cached plan explanation for:", dayPlan.date);
        }

        return res.status(200).json({ text, cached: false });
    } catch (err) {
        console.error("Explain API error:", err);
        return res.status(200).json({ 
            error: "Explanation unavailable right now. Cached explanations will be used when available.",
            fallback: true 
        });
    }
}
