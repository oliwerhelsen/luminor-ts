import { DomainException } from './domain.exception.js';

export class BusinessRuleViolationException extends DomainException {
  constructor(
    message: string,
    public readonly rule?: string
  ) {
    super(message);
    this.name = 'BusinessRuleViolationException';
    Object.setPrototypeOf(this, BusinessRuleViolationException.prototype);
  }
}
