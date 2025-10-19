import type { Payment } from '@payment/entity/Payment';
import type { Course } from '@shared/types/Course';
import type { Session } from '@shared/types/Session';
import { envVariables } from '@shared/env/env-variables';
import type { CreateStripeCheckoutPayload } from '@payment/service/types/CreateStripeCheckoutPayload';

export class PrepareCheckout {
  static forCourse(
    payment: Payment,
    course: Course,
  ): CreateStripeCheckoutPayload {
    return {
      item: {
        name: course.title,
        description: course.description || 'Course purchase',
        images: [
          course.thumbnail || 'https://example.com/course-placeholder.jpg',
        ],
        amount: Math.round(course.price * 100),
      },
      metadata: {
        payment_id: payment.id,
        payment_type: payment.type,
        reference_id: payment.id,
      },
      successUrl: `${envVariables.COURSE_PAYMENT_SUCCESS_URL}/${course.id}?success=true`,
      cancelUrl: `${envVariables.COURSE_PAYMENT_SUCCESS_URL}?/${course.id}?success=false`,
      idempotencyKey: payment.idempotencyKey,
    };
  }

  static forSession(
    payment: Payment,
    session: Session,
  ): CreateStripeCheckoutPayload {
    return {
      item: {
        name: `A session with instructor`,
        description: `Session from ${session.startTime} to ${session.endTime}`,
        images: ['https://example.com/session-placeholder.jpg'],
        amount: Math.round(session.price * 100),
      },
      metadata: {
        payment_id: payment.id,
        payment_type: payment.type,
        reference_id: payment.id,
      },
      successUrl: `${envVariables.SESSION_PAYMENT_SUCCESS_URL}?success=true&sessionId=${session.id}`,
      cancelUrl: `${envVariables.SESSION_PAYMENT_SUCCESS_URL}?success=false`,
      idempotencyKey: payment.idempotencyKey,
    };
  }
}
