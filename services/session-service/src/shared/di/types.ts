export const TYPES = {
  //Use cases
  BookSessionUseCase: Symbol.for('BookSessionUseCase'),
  UpdateInstructorWeeklyAvailabilityUseCase: Symbol.for(
    'UpdateInstructorWeeklyAvailabilityUseCase',
  ),
  GetInstructorScheduleTemplateUseCase: Symbol.for(
    'GetInstructorScheduleTemplateUseCase',
  ),
  HandleExpiredPendingPaymentsUseCase: Symbol.for(
    'HandleExpiredPendingPaymentsUseCase',
  ),
  ConfirmSessionBookingUseCase: Symbol.for('ConfirmSessionBookingUseCase'),
  GetInstructorAvailableSlotsUseCase: Symbol.for(
    'GetInstructorAvailableSlotsUseCase',
  ),

  //Domain services
  SessionBookingService: Symbol.for('SessionBookingService'),

  //Ports
  UserServiceGateway: Symbol.for('UserServiceGateway'),
  PaymentServiceGateway: Symbol.for('PaymentServiceGateway'),

  //Repositories
  SessionRepository: Symbol.for('SessionRepository'),
  ScheduleSettingRepository: Symbol.for('ScheduleSettingRepository'),
  SlotRepository: Symbol.for('SlotRepository'),

  //Unit of work
  UnitOfWork: Symbol.for('UnitOfWork'),

  //Database client
  DatabaseClient: Symbol.for('DatabaseClient'),

  //Routes
  ScheduleRoutes: Symbol.for('ScheduleRoutes'),

  //Mappers
  SessionMapper: Symbol.for('SessionMapper'),
  SlotMapper: Symbol.for('SlotMapper'),
  ScheduleSettingMapper: Symbol.for('ScheduleSettingMapper'),

  //Cron
  CronServices: Symbol.for('CronServices'),

  //Consumers
  PaymentEventsConsumer: Symbol.for('PaymentEventsConsumer'),
};
