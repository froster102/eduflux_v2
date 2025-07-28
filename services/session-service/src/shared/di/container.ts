import { Container } from 'inversify';
import { TYPES } from './types';
import { DatabaseClient } from '@/infrastructure/database/setup';
import { GetInstructorScheduleTemplateUseCase } from '@/application/use-cases/get-instructor-schedule-template.use-case';
import { UpdateInstructorWeeklyAvailabilityUseCase } from '@/application/use-cases/update-instructor-weekly-availablity.use-case';
import { ScheduleRoutes } from '@/interface/routes/schedule.routes';
import { SlotMapper } from '@/infrastructure/mapper/slot.mapper';
import { SessionMapper } from '@/infrastructure/mapper/session.mapper';
import { ScheduleSettingMapper } from '@/infrastructure/mapper/schedule-setting.mapper';
import { MongoSessionRepository } from '@/infrastructure/database/repositories/session.repository';
import { MongoSlotRepository } from '@/infrastructure/database/repositories/slot.repository';
import { MongoScheduleSettingRepository } from '@/infrastructure/database/repositories/schedule-setting';
import { MongoUnitOfWork } from '@/infrastructure/unit-of-work/mongo-unit-of-work';
import { HandleExpiredPendingPaymentsUseCase } from '@/application/use-cases/handle-expired-pending-payments.use-case';
import { CronServices } from '@/infrastructure/cron/cron-services';
import { SessionBookingService } from '@/domain/services/session-booking.service';
import { ConfirmSessionBookingUseCase } from '@/application/use-cases/confirm-session-booking.use-case';
import { BookSessionUseCase } from '@/application/use-cases/book-session.use-case';
import { GrpcUserServiceClient } from '@/infrastructure/grpc/client/user-service-client.grpc';
import { GrpcPaymentServiceClient } from '@/infrastructure/grpc/client/payment-service.grpc';
import { GetInstructorAvailableSlotsUseCase } from '@/application/use-cases/get-instructor-available-slots.use-case';
import { PaymentEventsConsumer } from '@/interface/consumer/payment-events.consumer';

const container = new Container();

//database
container.bind(TYPES.DatabaseClient).to(DatabaseClient).inSingletonScope();

//Repositories
container.bind(TYPES.SessionRepository).to(MongoSessionRepository);
container.bind(TYPES.SlotRepository).to(MongoSlotRepository);
container
  .bind(TYPES.ScheduleSettingRepository)
  .to(MongoScheduleSettingRepository);

//Unit of work
container.bind(TYPES.UnitOfWork).to(MongoUnitOfWork).inTransientScope();

//Use Cases
container
  .bind(TYPES.GetInstructorScheduleTemplateUseCase)
  .to(GetInstructorScheduleTemplateUseCase);
container
  .bind(TYPES.UpdateInstructorWeeklyAvailabilityUseCase)
  .to(UpdateInstructorWeeklyAvailabilityUseCase);
container
  .bind(TYPES.HandleExpiredPendingPaymentsUseCase)
  .to(HandleExpiredPendingPaymentsUseCase);
container
  .bind(TYPES.ConfirmSessionBookingUseCase)
  .to(ConfirmSessionBookingUseCase);
container.bind(TYPES.BookSessionUseCase).to(BookSessionUseCase);
container
  .bind(TYPES.GetInstructorAvailableSlotsUseCase)
  .to(GetInstructorAvailableSlotsUseCase);

//Domain service
container.bind(TYPES.SessionBookingService).to(SessionBookingService);

//Ports
container.bind(TYPES.UserServiceGateway).to(GrpcUserServiceClient);
container.bind(TYPES.PaymentServiceGateway).to(GrpcPaymentServiceClient);
// container
//   .bind(TYPES.MessageBrokerGateway)
//   .to(KafkaProducerAdapter)
//   .inSingletonScope();

// container.bind(TYPES.UserEventsConsumer).to(UserEventsConsumer);
// container.bind(TYPES.EnrollmentEventsConsumer).to(EnrollmentEventsConsumer);

//Http Routes
container.bind(TYPES.ScheduleRoutes).to(ScheduleRoutes);

//Services

//Grpc
// container.bind(TYPES.UserGrpcService).to(UserGrpcService);
// container.bind(TYPES.GrpcServer).to(GrpcServer);

//Mapper
container.bind(TYPES.SlotMapper).to(SlotMapper);
container.bind(TYPES.SessionMapper).to(SessionMapper);
container.bind(TYPES.ScheduleSettingMapper).to(ScheduleSettingMapper);

//Consumers
container.bind(TYPES.PaymentEventsConsumer).to(PaymentEventsConsumer);

//Cron
container.bind(TYPES.CronServices).to(CronServices);

export { container };
