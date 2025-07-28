import { Role } from '@/shared/types/role';

export interface SessionPricing {
  price: number;
  currency: string;
  durationMinutes: number;
}

export class User {
  private readonly _id: string;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _sessionPricing: SessionPricing | null;
  private _image?: string;
  private _roles: Role[];
  private _bio?: string;
  private _socialLinks?: {
    platform: string;
    url: string;
  }[];
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    sessionPricing: SessionPricing | null,
    roles: Role[],
    createdAt: Date,
    updatedAt: Date,
    image?: string,
    bio?: string,
    socialLinks?: {
      platform: string;
      url: string;
    }[],
  ) {
    this._id = id;
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
    this._sessionPricing = sessionPricing;
    this._roles = roles;
    this._image = image;
    this._bio = bio;
    this._socialLinks = socialLinks;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  public static create(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    roles: Role[],
    bio?: string,
    socialLinks?: {
      platform: string;
      url: string;
    }[],
  ): User {
    const now = new Date();
    return new User(
      id,
      firstName,
      lastName,
      email,
      null,
      roles,
      now,
      now,
      undefined,
      bio,
      socialLinks,
    );
  }

  public static fromPersistence(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    sessionPricing: SessionPricing | null,
    roles: Role[],
    createdAt: Date,
    updatedAt: Date,
    image?: string,
    bio?: string,
    socialLinks?: {
      platform: string;
      url: string;
    }[],
  ): User {
    return new User(
      id,
      firstName,
      lastName,
      email,
      sessionPricing,
      roles,
      createdAt,
      updatedAt,
      image,
      bio,
      socialLinks,
    );
  }

  public get id(): string {
    return this._id;
  }

  public get firstName(): string {
    return this._firstName;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public get email(): string {
    return this._email;
  }

  public get sessionPricing(): SessionPricing | null {
    return this._sessionPricing;
  }

  public get image(): string | undefined {
    return this._image;
  }

  public get bio(): string | undefined {
    return this._bio;
  }

  public get socialLinks(): { platform: string; url: string }[] | undefined {
    return this._socialLinks;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get roles(): Role[] {
    return this._roles;
  }

  public updateFirstName(firstName: string): void {
    if (!firstName) {
      throw new Error('First name cannot be empty.');
    }
    this._firstName = firstName;
    this._updatedAt = new Date();
  }

  public updateLastName(lastName: string): void {
    if (!lastName) {
      throw new Error('Last name cannot be empty.');
    }
    this._lastName = lastName;
    this._updatedAt = new Date();
  }

  public updateImageUrl(image?: string): void {
    this._image = image;
    this._updatedAt = new Date();
  }

  public updateBio(bio?: string): void {
    this._bio = bio;
    this._updatedAt = new Date();
  }

  public updateSocialLinks(
    socialLinks?: { platform: string; url: string }[],
  ): void {
    this._socialLinks = socialLinks;
    this._updatedAt = new Date();
  }

  public getFullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  public setSessionPrice(price: number): void {
    this._sessionPricing = {
      currency: 'USD',
      durationMinutes: 60,
      price,
    };
  }

  public update(
    dto: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      roles: Role[];
      image: string;
      bio: string | null;
      socialLinks: { platform: string; url: string }[];
    }>,
  ): void {
    let updated = false;

    if (dto.firstName) {
      this._firstName = dto.firstName;
      updated = true;
    }

    if (dto.lastName) {
      this._lastName = dto.lastName;
      updated = true;
    }

    if (dto.email) {
      this._email = dto.email;
      updated = true;
    }

    if (dto.roles && dto.roles.length > 0) {
      this._roles = dto.roles;
      updated = true;
    }

    if (dto.image) {
      this._image = dto.image;
      updated = true;
    }

    if (dto.bio) {
      this._bio = dto.bio;
      updated = true;
    }

    if (dto.socialLinks) {
      this._socialLinks = dto.socialLinks;
      updated = true;
    }

    if (updated) {
      this._updatedAt = new Date();
    }
  }

  public toJSON(): object {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      sessionPricing: this.sessionPricing,
      image: this.image,
      email: this.email,
      bio: this.bio,
      socialLinks: this.socialLinks,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
