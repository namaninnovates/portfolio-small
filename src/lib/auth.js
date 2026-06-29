import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// Crash at module load if JWT_SECRET is missing — never fall back to a known value
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET environment variable is required. Generate one with: openssl rand -base64 64'
  );
}

export const jwtKey = new TextEncoder().encode(JWT_SECRET);

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
    await jwtVerify(token.value, jwtKey);
  } catch {
    throw new Error('Unauthorized: Invalid or expired session');
  }
}
