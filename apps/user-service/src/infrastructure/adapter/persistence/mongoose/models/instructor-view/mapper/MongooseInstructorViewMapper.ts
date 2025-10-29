import { InstructorView } from '@application/views/instructor-view/entity/InstructorView';
import type { SessionPricingDetails } from '@application/views/instructor-view/entity/types/SessionPricingDetails';
import type { UserProfile } from '@domain/user/events/types/UserProfile';
import type { MongooseInstructorView } from '@infrastructure/adapter/persistence/mongoose/models/instructor-view/MongooseInstructorView';

export class MongooseInstructorViewMapper {
  static toDomain(document: MongooseInstructorView): InstructorView {
    const profile: UserProfile = {
      name: document.profile.name,
      image: document.profile.image,
      bio: document.profile.bio,
    };

    const pricing: SessionPricingDetails = {
      price: document.pricing.price,
      currency: document.pricing.currency,
      duration: document.pricing.duration,
      timeZone: document.pricing.timeZone,
      isSchedulingEnabled: document.pricing.isSchedulingEnabled,
    };

    return InstructorView.new({
      id: document._id,
      profile,
      sessionsConducted: document.sessionsConducted,
      totalCourses: document.totalCourses,
      totalLearners: document.totalLearners,
      pricing,
    });
  }

  static toPersistence(
    entity: InstructorView,
  ): Partial<MongooseInstructorView> {
    return {
      _id: entity.id,
      profile: {
        name: entity.profile.name,
        image: entity.profile.image,
        bio: entity.profile.bio || '',
      },
      sessionsConducted: entity.sessionsConducted,
      totalCourses: entity.totalCourses,
      totalLearners: entity.totalLearners,
      pricing: {
        price: entity.pricing.price,
        currency: entity.pricing.currency,
        duration: entity.pricing.duration,
        timeZone: entity.pricing.timeZone,
        isSchedulingEnabled: entity.pricing.isSchedulingEnabled,
      },
    };
  }

  static toDomainEntities(
    documents: MongooseInstructorView[],
  ): InstructorView[] {
    return documents.map((document) => this.toDomain(document));
  }
}
