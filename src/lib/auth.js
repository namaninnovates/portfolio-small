import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// Get the key dynamically to prevent crashing on module load
export const getJwtKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is required. Generate one with: openssl rand -base64 64'
    );
  }
  return new TextEncoder().encode(secret);
};

/**
 * Verifies the admin session cookie contains a valid, non-expired JWT.
 * Call this at the top of every admin-only server action.
 * @throws {Error} if the session is missing or invalid
 */
export async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session');

  if (!token) {
    throw new Error('Unauthorized: No session found');
  }

  try {
    const key = getJwtKey();
    await jwtVerify(token.value, key);
  } catch (error) {
    throw new Error('Unauthorized: Invalid or expired session');
  }
}
