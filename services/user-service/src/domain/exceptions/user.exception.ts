import { DomainException } from './domain.exception';

export class UserNotFoundException extends DomainException {
  constructor(userId: string) {
    super(`User with ${userId} not found.`, 'USER_NOT_FOUND');
    this.name = 'UserNotFoundException';
  }
}

export class UserAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`User with ${email} already exists`, 'USER_ALREADY_EXISTS');
    this.name = 'UserAlreadyExistsException';
  }
}
