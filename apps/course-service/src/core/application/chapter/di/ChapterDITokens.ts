export class ChapterDITokens {
  // Use cases
  static readonly CreateChapterUseCase: unique symbol = Symbol(
    'CreateChapterUseCase',
  );
  static readonly UpdateChapterUseCase: unique symbol = Symbol(
    'UpdateChapterUseCase',
  );
  static readonly DeleteChapterUseCase: unique symbol = Symbol(
    'DeleteChapterUseCase',
  );
  static readonly GetChapterUseCase: unique symbol =
    Symbol('GetChapterUseCase');
  static readonly GetCourseChaptersUseCase: unique symbol = Symbol(
    'GetCourseChaptersUseCase',
  );
  static readonly ReorderChaptersUseCase: unique symbol = Symbol(
    'ReorderChaptersUseCase',
  );

  // Repository
  static readonly ChapterRepository: unique symbol =
    Symbol('ChapterRepository');

  // Controller
  static readonly ChapterController: unique symbol =
    Symbol('ChapterController');
}
