import { InfrastructureException } from './infrastructure.exception.js';

export class ExternalServiceException extends InfrastructureException {
  constructor(
    message: string,
    public readonly serviceName?: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'ExternalServiceException';
    Object.setPrototypeOf(this, ExternalServiceException.prototype);
  }
}
