import { InfrastructureException } from './infrastructure.exception.js';

export class DatabaseException extends InfrastructureException {
  constructor(
    message: string,
    public readonly operation?: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'DatabaseException';
    Object.setPrototypeOf(this, DatabaseException.prototype);
  }
}
