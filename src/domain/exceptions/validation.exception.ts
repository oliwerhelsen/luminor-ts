import { DomainException } from './domain.exception.js';

export class ValidationException extends DomainException {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ValidationException';
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}
