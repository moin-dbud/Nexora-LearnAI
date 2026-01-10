// Simple sync test
const https = require('https');

console.log("Testing API endpoint...\n");

const data = JSON.stringify({
    topic: "Test Topic",
    difficulty: "medium",
    type: "study",
    userId: "test-123"
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/explainTopic',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = require('http').request(options, (res) => {
    let body = '';

    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', body);

        try {
            const json = JSON.parse(body);
            if (json.error) {
                console.log('\n❌ API returned error:', json.error);
                console.log('The GEMINI_API_KEY is likely not loaded yet.');
            } else if (json.explanation) {
                console.log('\n✅ SUCCESS! Explanation received.');
            }
        } catch (e) {
            console.log('Parse error:', e.message);
        }
    });
});

req.on('error', (e) => {
    console.error('Request failed:', e.message);
    console.log('Make sure dev server is running on port 3000');
});

req.write(data);
req.end();
