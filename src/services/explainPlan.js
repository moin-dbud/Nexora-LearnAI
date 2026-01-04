export async function explainDayPlan(payload) {
    try {
        const res = await fetch("/api/explainPlan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        // ✅ Return the full data object (includes text, cached, fallback, etc.)
        if (!res.ok) {
            return {
                text: data.text || null,
                error: data.error || "Failed to fetch explanation",
                fallback: true,
                quotaExceeded: data.quotaExceeded || false
            };
        }

        // ✅ Return full response object
        return data;

    } catch (err) {
        console.error("explainDayPlan service error:", err);
        return {
            text: null,
            error: "Failed to fetch explanation",
            fallback: true
        };
    }
}
