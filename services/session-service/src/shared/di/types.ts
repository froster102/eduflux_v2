export const TYPES = {
  //Use cases
  BookSessionUseCase: Symbol.for('BookSessionUseCase'),
  UpdateInstructorWeeklyAvailabilityUseCase: Symbol.for(
    'UpdateInstructorWeeklyAvailabilityUseCase',
  ),
  GetInstructorScheduleTemplateUseCase: Symbol.for(
    'GetInstructorScheduleTemplateUseCase',
  ),

  //Repositories
  SessionRepository: Symbol.for('SessionRepository'),
  ScheduleSettingRepository: Symbol.for('ScheduleSettingRepository'),
  SlotRepository: Symbol.for('SlotRepository'),

  //Database client
  DatabaseClient: Symbol.for('DatabaseClient'),

  //Routes
  ScheduleRoutes: Symbol.for('ScheduleRoutes'),

  //Mappers
  SessionMapper: Symbol.for('SessionMapper'),
  SlotMapper: Symbol.for('SlotMapper'),
  ScheduleSettingMapper: Symbol.for('ScheduleSettingMapper'),
};
