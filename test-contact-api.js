// Test script for contact API
const testContactAPI = async () => {
  console.log('🧪 Testing Contact API...\n');

  const testData = {
    name: "Test User",
    email: "test@example.com",
    phone: "+91 9876543210",
    subject: "Test Contact Form",
    message: "This is a test message to verify the contact form and email functionality is working correctly."
  };

  try {
    console.log('📤 Sending test contact form submission...');
    console.log('Data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('\n📥 Response Status:', response.status);
    
    const data = await response.json();
    console.log('Response Data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ SUCCESS! Contact form submission worked!');
      console.log('\n📧 Check these inboxes:');
      console.log('1. Admin inbox: moinsheikh1303@gmail.com');
      console.log('2. User inbox: test@example.com');
      console.log('\nYou should receive:');
      console.log('- Admin: Contact form submission notification');
      console.log('- User: Thank you email with professional design');
    } else {
      console.log('\n❌ FAILED! Error:', data.error);
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.log('\nMake sure:');
    console.log('1. Development server is running (npm run dev)');
    console.log('2. .env.local file has EMAIL_USER and EMAIL_PASS');
    console.log('3. Gmail App Password is correct');
  }
};

// Run the test
testContactAPI();
