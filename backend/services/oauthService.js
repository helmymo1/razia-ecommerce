const { OAuth2Client } = require('google-auth-library');
const appleSignin = require('apple-signin-auth');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify Google ID Token
 * @param {string} idToken - The ID token from Google Sign-In
 * @returns {Object} User info from Google
 */
exports.verifyGoogleToken = async (idToken) => {
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        
        return {
            google_id: payload.sub,
            email: payload.email,
            first_name: payload.given_name || payload.name?.split(' ')[0] || 'User',
            last_name: payload.family_name || payload.name?.split(' ')[1] || '',
            profile_pic: payload.picture || null,
            email_verified: payload.email_verified
        };
    } catch (error) {
        console.error('Google Token Verification Error:', error);
        throw new Error('Invalid Google token');
    }
};

/**
 * Verify Apple ID Token
 * @param {string} idToken - The ID token from Apple Sign-In
 * @returns {Object} User info from Apple
 */
exports.verifyAppleToken = async (idToken) => {
    try {
        const payload = await appleSignin.verifyIdToken(idToken, {
            audience: process.env.APPLE_CLIENT_ID,
            ignoreExpiration: false, // Strict verification
        });
        
        return {
            apple_id: payload.sub,
            email: payload.email || null,
            first_name: null, // Apple only provides name on first authorization
            last_name: null,
            email_verified: payload.email_verified
        };
    } catch (error) {
        console.error('Apple Token Verification Error:', error);
        throw new Error('Invalid Apple token');
    }
};
