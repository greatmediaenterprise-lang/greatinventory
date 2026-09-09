import jwt, { JwtPayload } from 'jsonwebtoken';
import type { UserRecord } from '@/lib/db';

export const JWT_SECRET = process.env.JWT_SECRET || 'greatpay-dev-secret-change-me';

export function signToken(user: UserRecord) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      department: user.department
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
