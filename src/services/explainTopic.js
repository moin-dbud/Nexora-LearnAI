import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function explainTopic({ userId, topic, difficulty, type }) {
    try {
        // Check cache first
        const topicKey = topic.toLowerCase().replace(/[^a-z0-9]/g, "_");
        const cacheRef = doc(db, "users", userId, "explanations", topicKey);
        const cacheSnap = await getDoc(cacheRef);

        if (cacheSnap.exists()) {
            const cached = cacheSnap.data();
            return {
                explanation: cached.explanation,
                topic: cached.topic,
                cached: true
            };
        }

        // Fetch from API
        const res = await fetch("/api/explainTopic", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic, difficulty, type, userId }),
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                error: data.error || "Failed to generate explanation",
                fallback: data.fallback || false,
                quotaExceeded: data.quotaExceeded || false
            };
        }

        // Cache the explanation
        if (data.explanation) {
            await setDoc(cacheRef, {
                topic,
                explanation: data.explanation,
                difficulty,
                type,
                createdAt: new Date().toISOString()
            });
        }

        return data;

    } catch (err) {
        console.error("Explain topic service error:", err);
        return {
            error: "Failed to fetch explanation. Please try again.",
            fallback: true
        };
    }
}
