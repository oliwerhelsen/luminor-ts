import { injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email?: string;
  [key: string]: any;
}

export interface AuthConfig {
  secret: string;
  expiresIn?: string | number;
}

@injectable()
export class AuthService {
  constructor(private config: AuthConfig) {
    if (!config.secret) {
      throw new Error('JWT secret is required');
    }
  }

  generateToken(payload: JwtPayload): string {
    const options: jwt.SignOptions = {};
    if (this.config.expiresIn) {
      options.expiresIn = this.config.expiresIn;
    }

    return jwt.sign(payload, this.config.secret, options);
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.config.secret) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }
}

