import { BaseEntity } from 'luminor';

export class User extends BaseEntity {
  private _email: string;
  private _name: string;
  private _passwordHash: string;

  constructor(email: string, name: string, passwordHash: string, id?: string) {
    super(id);
    this._email = email;
    this._name = name;
    this._passwordHash = passwordHash;
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  updateName(name: string): void {
    this._name = name;
    this.updateTimestamp();
  }

  updateEmail(email: string): void {
    this._email = email;
    this.updateTimestamp();
  }
}

