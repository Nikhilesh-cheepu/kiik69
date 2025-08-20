const crypto = require('crypto');

/**
 * Generate a unique session ID
 * @returns {string} - Unique session ID
 */
const generateSessionId = () => {
  return `session_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
};

/**
 * Format phone number with India country code (+91)
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  
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

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} - Is valid email
 */
const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number
 * @returns {boolean} - Is valid phone
 */
const validatePhone = (phone) => {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10;
};

module.exports = {
  generateSessionId,
  formatPhoneNumber,
  validateEmail,
  validatePhone
};
