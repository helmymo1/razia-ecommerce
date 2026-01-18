/**
 * Generates a unique 8-character referral code.
 * Format: First 3 letters of name (uppercase) + 4 Random Digits + 1 Random Letter
 * Example: HELMY-928X
 * If name is shorter than 3 chars, it uses 'REF' as prefix.
 * @param {string} name - The user's name
 * @returns {string} The formatted referral code
 */
const generateReferralCode = (name) => {
    let prefix = 'REF';
    if (name && name.length >= 3) {
        prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
    }
    
    // Ensure prefix is exactly 3 chars (padding with X if regex ate too much)
    prefix = prefix.padEnd(3, 'X');

    const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digits
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];

    return `${prefix}-${randomDigits}${randomLetter}`;
};

module.exports = { generateReferralCode };
