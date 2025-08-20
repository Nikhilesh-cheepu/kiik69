const twilio = require('twilio');
const nodemailer = require('nodemailer');

// Initialize Twilio client (for SMS)
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Initialize Nodemailer (for email fallback)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

/**
 * Send OTP via SMS using Twilio
 * @param {string} phone - Phone number with country code
 * @param {string} otp - 6-digit OTP
 * @returns {Promise<boolean>} - Success status
 */
const sendOTPViaSMS = async (phone, otp) => {
  if (!twilioClient) {
    console.log('⚠️ Twilio not configured, skipping SMS');
    return false;
  }

  try {
    await twilioClient.messages.create({
      body: `Your KIIK 69 verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    
    console.log(`✅ SMS OTP sent to ${phone}`);
    return true;
  } catch (error) {
    console.error('❌ SMS OTP failed:', error.message);
    return false;
  }
};

/**
 * Send OTP via Email
 * @param {string} email - Email address
 * @param {string} otp - 6-digit OTP
 * @returns {Promise<boolean>} - Success status
 */
const sendOTPViaEmail = async (email, otp) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.log('⚠️ Email not configured, skipping email');
    return false;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'KIIK 69 - Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">🎉 Welcome to KIIK 69 Sports Bar!</h2>
          <p>Your verification code is:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          <p><strong>This code is valid for 10 minutes.</strong></p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            KIIK 69 Sports Bar<br>
            Gachibowli, Hyderabad
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Email OTP failed:', error.message);
    return false;
  }
};

/**
 * Send OTP via multiple channels (SMS + Email)
 * @param {string} phone - Phone number
 * @param {string} email - Email address (optional)
 * @param {string} otp - 6-digit OTP
 * @returns {Promise<boolean>} - Success status
 */
const sendOTP = async (phone, otp, email = null) => {
  let success = false;
  
  // Try SMS first
  if (phone) {
    success = await sendOTPViaSMS(phone, otp);
  }
  
  // Try email as fallback or additional method
  if (email && !success) {
    success = await sendOTPViaEmail(email, otp);
  }
  
  // If both fail, log for development
  if (!success) {
    console.log(`📱 Development OTP for ${phone}: ${otp}`);
    console.log('💡 Configure Twilio or Email for production OTP delivery');
  }
  
  return success;
};

/**
 * Generate a random 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone number with +91
 */
const formatPhoneNumber = (phone) => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // If it's already 10 digits, add +91
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  
  // If it's 12 digits and starts with 91, add +
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  
  // If it's 13 digits and starts with +91, return as is
  if (digits.length === 13 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  
  // Default: assume 10 digits and add +91
  return `+91${digits.slice(-10)}`;
};

module.exports = {
  sendOTP,
  generateOTP,
  formatPhoneNumber,
  sendOTPViaSMS,
  sendOTPViaEmail
};
