import { db } from "@/lib/firebase";

export async function explainTopic({ userId, topic, difficulty, type }) {
    try {
        // Fetch from API (API handles caching internally)
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

        return data;

    } catch (err) {
        console.error("Explain topic service error:", err);
        return {
            error: "Failed to fetch explanation. Please try again.",
            fallback: true
        };
    }
}
