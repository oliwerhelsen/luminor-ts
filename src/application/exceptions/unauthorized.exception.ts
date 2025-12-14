import { ApplicationException } from './application.exception.js';

export class UnauthorizedException extends ApplicationException {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedException';
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}
