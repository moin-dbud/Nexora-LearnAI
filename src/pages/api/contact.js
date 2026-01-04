import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, subject, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Please fill all required fields" });
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to admin (you)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: "moinsheikh1303@gmail.com",
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .field {
              margin-bottom: 20px;
              padding: 15px;
              background: white;
              border-radius: 8px;
              border-left: 4px solid #667eea;
            }
            .label {
              font-weight: bold;
              color: #667eea;
              margin-bottom: 5px;
            }
            .value {
              color: #333;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 New Contact Form Submission</h1>
              <p>Nexora LearnAI</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Name:</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value">${email}</div>
              </div>
              
              ${phone ? `
              <div class="field">
                <div class="label">📱 Phone:</div>
                <div class="value">${phone}</div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">📝 Subject:</div>
                <div class="value">${subject}</div>
              </div>
              
              <div class="field">
                <div class="label">💬 Message:</div>
                <div class="value">${message}</div>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from the Nexora LearnAI contact form</p>
              <p>Reply directly to this email to respond to ${name}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      replyTo: email,
    };

    // Thank you email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting Nexora LearnAI! 🎓",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 40px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .logo {
              font-size: 48px;
              margin-bottom: 10px;
            }
            .content {
              background: #f9f9f9;
              padding: 40px;
              border-radius: 0 0 10px 10px;
            }
            .message-box {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #667eea;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              margin: 20px 0;
              font-weight: bold;
            }
            .contact-info {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .contact-item {
              margin: 10px 0;
              padding: 10px;
              border-bottom: 1px solid #eee;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎓</div>
              <h1>Thank You for Reaching Out!</h1>
              <p>Nexora LearnAI</p>
            </div>
            <div class="content">
              <h2>Hi ${name}! 👋</h2>
              <p>Thank you for contacting us. We've received your message and our team will get back to you as soon as possible.</p>
              
              <div class="message-box">
                <h3>📝 Your Message Summary:</h3>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong> ${message}</p>
              </div>
              
              <p>We typically respond within 24 hours during business days. For urgent matters, feel free to call us directly.</p>
              
              <div class="contact-info">
                <h3>📞 Contact Information:</h3>
                <div class="contact-item">
                  <strong>📧 Email:</strong> moinsheikh1303@gmail.com
                </div>
                <div class="contact-item">
                  <strong>📱 Phone:</strong> +91 7249339058
                </div>
                <div class="contact-item">
                  <strong>📍 Location:</strong> India
                </div>
              </div>
              
              <center>
                <a href="https://nexora-learnai.vercel.app" class="button">Visit Our Website</a>
              </center>
              
              <p style="margin-top: 30px;">In the meantime, feel free to explore our AI-powered study planning features to help you ace your exams!</p>
            </div>
            <div class="footer">
              <p><strong>Nexora LearnAI</strong> - Your AI-Powered Study Companion</p>
              <p>Helping students succeed with personalized study plans</p>
              <p style="margin-top: 10px;">
                <a href="mailto:moinsheikh1303@gmail.com" style="color: #667eea; text-decoration: none;">moinsheikh1303@gmail.com</a> | 
                <a href="tel:+917249339058" style="color: #667eea; text-decoration: none;">+91 7249339058</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    return res.status(200).json({ 
      success: true, 
      message: "Message sent successfully" 
    });

  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ 
      error: "Failed to send message. Please try again later." 
    });
  }
}
