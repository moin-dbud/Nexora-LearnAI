// Quick diagnostic script to check environment variables
console.log("=== Environment Variable Check ===");
console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
console.log("GEMINI_API_KEY length:", process.env.GEMINI_API_KEY?.length || 0);
console.log("GEMINI_API_KEY preview:", process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...` : "NOT SET");
console.log("\nAll env vars starting with GEMINI:");
Object.keys(process.env)
    .filter(key => key.includes('GEMINI'))
    .forEach(key => {
        console.log(`  ${key}: ${process.env[key]?.substring(0, 10)}...`);
    });
console.log("\n=== End Check ===");
