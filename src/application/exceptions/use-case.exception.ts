import { ApplicationException } from './application.exception.js';

export class UseCaseException extends ApplicationException {
  constructor(
    message: string,
    public readonly useCaseName?: string
  ) {
    super(message);
    this.name = 'UseCaseException';
    Object.setPrototypeOf(this, UseCaseException.prototype);
  }
}
