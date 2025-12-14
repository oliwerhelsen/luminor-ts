import { describe, it, expect } from 'vitest';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  const authService = new AuthService({
    secret: 'test-secret-key',
    expiresIn: '1h',
  });

  it('should generate a token', () => {
    const payload = { userId: '123', email: 'test@example.com' };
    const token = authService.generateToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should verify a valid token', () => {
    const payload = { userId: '123', email: 'test@example.com' };
    const token = authService.generateToken(payload);
    const verified = authService.verifyToken(token);
    expect(verified.userId).toBe('123');
    expect(verified.email).toBe('test@example.com');
  });

  it('should throw error for invalid token', () => {
    expect(() => {
      authService.verifyToken('invalid-token');
    }).toThrow();
  });

  it('should extract token from Bearer header', () => {
    const token = authService.extractTokenFromHeader('Bearer test-token');
    expect(token).toBe('test-token');
  });

  it('should return null for invalid header format', () => {
    const token = authService.extractTokenFromHeader('Invalid test-token');
    expect(token).toBeNull();
  });

  it('should return null for missing header', () => {
    const token = authService.extractTokenFromHeader(undefined);
    expect(token).toBeNull();
  });
});

