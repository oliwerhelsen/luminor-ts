import { DomainException } from './domain.exception.js';

export class EntityNotFoundException extends DomainException {
  constructor(
    public readonly entityName: string,
    public readonly entityId: string | number
  ) {
    super(`${entityName} with id ${entityId} not found`);
    this.name = 'EntityNotFoundException';
    Object.setPrototypeOf(this, EntityNotFoundException.prototype);
  }
}
