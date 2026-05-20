const axios = require('axios');

const CLERK_API_URL = 'https://api.clerk.com/v1';
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

async function getClerkUserMetadata(clerkId) {
  if (!CLERK_SECRET_KEY) {
    throw new Error('CLERK_SECRET_KEY not configured');
  }

  try {
    const response = await axios.get(`${CLERK_API_URL}/users/${clerkId}`, {
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
      },
    });

    const user = response.data;
    return {
      publicMetadata: user.public_metadata || {},
      privateMetadata: user.private_metadata || {},
    };
  } catch (error) {
    console.error('Error fetching Clerk user metadata:', error.message);
    throw error;
  }
}

function extractRoleFromClerk(userMetadata) {
  const privateRole = userMetadata.privateMetadata?.role;
  const publicRole = userMetadata.publicMetadata?.role;

  const role = privateRole || publicRole || 'user';

  if (role !== 'admin' && role !== 'user') {
    return 'user';
  }

  return role;
}

module.exports = {
  getClerkUserMetadata,
  extractRoleFromClerk,
};