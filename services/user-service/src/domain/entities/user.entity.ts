import { Role } from '@/shared/types/role';

export class User {
  private readonly _id: string;
  private _firstName: string;
  private _lastName: string;
  private _imageUrl?: string;
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
    roles: Role[],
    createdAt: Date,
    updatedAt: Date,
    imageUrl?: string,
    bio?: string,
    socialLinks?: {
      platform: string;
      url: string;
    }[],
  ) {
    this._id = id;
    this._firstName = firstName;
    this._lastName = lastName;
    this._roles = roles;
    this._imageUrl = imageUrl;
    this._bio = bio;
    this._socialLinks = socialLinks;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  public static create(
    id: string,
    firstName: string,
    lastName: string,
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
    roles: Role[],
    createdAt: Date,
    updatedAt: Date,
    imageUrl?: string,
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
      roles,
      createdAt,
      updatedAt,
      imageUrl,
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

  public get imageUrl(): string | undefined {
    return this._imageUrl;
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

  public updateImageUrl(imageUrl?: string): void {
    this._imageUrl = imageUrl;
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

  public update(
    dto: Partial<{
      firstName: string;
      lastName: string;
      imageUrl?: string;
      bio?: string | null;
      socialLinks?: { platform: string; url: string }[];
    }>,
  ): void {
    let updated = false;

    if (dto.firstName !== undefined) {
      if (!dto.firstName) {
        throw new Error('First name cannot be empty.');
      }
      this._firstName = dto.firstName;
      updated = true;
    }

    if (dto.lastName !== undefined) {
      if (!dto.lastName) {
        throw new Error('Last name cannot be empty.');
      }
      this._lastName = dto.lastName;
      updated = true;
    }

    if (dto.imageUrl !== undefined) {
      this._imageUrl = dto.imageUrl;
      updated = true;
    }

    if (dto.bio !== undefined) {
      this._bio = dto.bio;
      updated = true;
    }

    if (dto.socialLinks !== undefined) {
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
      imageUrl: this.imageUrl,
      bio: this.bio,
      socialLinks: this.socialLinks,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
