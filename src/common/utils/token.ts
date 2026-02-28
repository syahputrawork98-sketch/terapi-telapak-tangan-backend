import { createHmac, timingSafeEqual } from 'crypto';
import { ENV } from '../../config/env';

interface TokenPayload {
  sub: string;
  role: string;
  email: string;
  exp: number;
}

function encode(data: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(data)).toString('base64url');
}

function sign(unsignedToken: string): string {
  return createHmac('sha256', ENV.JWT_SECRET).update(unsignedToken).digest('base64url');
}

export function signToken(payload: { sub: string; role: string; email: string }): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const body: TokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ENV.TOKEN_EXPIRES_SECONDS,
  };

  const encodedHeader = encode(header);
  const encodedBody = encode(body);
  const unsignedToken = `${encodedHeader}.${encodedBody}`;

  return `${unsignedToken}.${sign(unsignedToken)}`;
}

export function verifyToken(token: string): TokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedBody, signature] = parts;
  const unsignedToken = `${encodedHeader}.${encodedBody}`;
  const expected = sign(unsignedToken);

  const sigA = Buffer.from(signature);
  const sigB = Buffer.from(expected);

  if (sigA.length !== sigB.length || !timingSafeEqual(sigA, sigB)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedBody, 'base64url').toString('utf8')) as TokenPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
