export const TYPES = {
  //Use cases
  BookSessionUseCase: Symbol.for('BookSessionUseCase'),
  // UpdateInstructorWeeklyAvailabilityUseCase: Symbol.for(
  //   'UpdateInstructorWeeklyAvailabilityUseCase',
  // ),
  UpadteInstructorSessionSettingsUseCase: Symbol.for(
    'UpdateInstructorSessionSettingsUseCase',
  ),
  GetInstructorSessionSettingsUseCase: Symbol.for(
    'GetInstructorScheduleTemplateUseCase',
  ),
  HandleExpiredPendingPaymentsUseCase: Symbol.for(
    'HandleExpiredPendingPaymentsUseCase',
  ),
  ConfirmSessionBookingUseCase: Symbol.for('ConfirmSessionBookingUseCase'),
  GetInstructorAvailableSlotsUseCase: Symbol.for(
    'GetInstructorAvailableSlotsUseCase',
  ),
  GetUserBookingsUseCase: Symbol.for('GetUserBookingsUseCase'),
  EnableSessionUseCase: Symbol.for('EnableSessionUseCase'),

  //Domain services
  SessionBookingService: Symbol.for('SessionBookingService'),
  SlotGenerationService: Symbol.for('SlotGenerationService'),

  //Ports
  UserServiceGateway: Symbol.for('UserServiceGateway'),
  PaymentServiceGateway: Symbol.for('PaymentServiceGateway'),

  //Repositories
  SessionRepository: Symbol.for('SessionRepository'),
  SessionSettingsRepository: Symbol.for('ScheduleSettingRepository'),
  SlotRepository: Symbol.for('SlotRepository'),

  //Unit of work
  UnitOfWork: Symbol.for('UnitOfWork'),

  //Database client
  DatabaseClient: Symbol.for('DatabaseClient'),

  //Routes
  ScheduleRoutes: Symbol.for('ScheduleRoutes'),
  SettingsRoutes: Symbol.for('SettingsRoutes'),
  GraphqlRoutes: Symbol.for('GraphqlRoutes'),

  //Mappers
  SessionMapper: Symbol.for('SessionMapper'),
  SlotMapper: Symbol.for('SlotMapper'),
  ScheduleSettingMapper: Symbol.for('ScheduleSettingMapper'),

  //Cron
  CronServices: Symbol.for('CronServices'),

  //Consumers
  PaymentEventsConsumer: Symbol.for('PaymentEventsConsumer'),

  //Logger
  Logger: Symbol.for('Logger'),

  //Resolvers
  GraphqlResolver: Symbol.for('GraphqlResolver'),
};
