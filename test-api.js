// Test script to verify the explainTopic API is working
async function testExplainAPI() {
    console.log("🧪 Testing /api/explainTopic endpoint...\n");

    try {
        const response = await fetch("http://localhost:3000/api/explainTopic", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                topic: "Photosynthesis",
                difficulty: "medium",
                type: "study",
                userId: "test-user-123"
            })
        });

        const data = await response.json();

        console.log("Response Status:", response.status);
        console.log("Response Data:", JSON.stringify(data, null, 2));

        if (data.error) {
            console.log("\n❌ ERROR:", data.error);
            console.log("This means the GEMINI_API_KEY is still not loaded.");
            console.log("Please restart the dev server manually:");
            console.log("  1. Press Ctrl+C in the terminal running 'npm run dev'");
            console.log("  2. Run 'npm run dev' again");
        } else if (data.explanation) {
            console.log("\n✅ SUCCESS! API is working correctly.");
            console.log("Explanation preview:", data.explanation.substring(0, 100) + "...");
        }

    } catch (error) {
        console.error("\n❌ Test failed:", error.message);
        console.log("Make sure the dev server is running on http://localhost:3000");
    }
}

testExplainAPI();
