import { ApplicationException } from './application.exception.js';

export class ForbiddenException extends ApplicationException {
  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenException';
    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }
}
