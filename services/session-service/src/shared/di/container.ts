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

//Ports
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

export { container };
