export const contentLimits = {
  FIRST_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 12,
  },
  LAST_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 12,
  },
  BIO: {
    MIN_LENGTH: 100,
    MAX_LENGTH: 500,
  },

  COURSE_TITLE: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 80,
  },

  COURSE_DESCRIPTION: {
    MIN_LENGTH: 200,
  },

  COURSE_FEEDBACK: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 1000,
  },

  CHAPTER_TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 80,
  },
  CHAPTER_DESCRIPTION: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 200,
  },

  LECTURE_TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 80,
  },
  LECTURE_DESCRIPTION: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 200,
  },

  NO_LEADING_SPECIAL_CHAR_REGEX: /^[a-zA-Z0-9].*/,

  COURSE_MIN_LECTURES_REQUIRED: 5,

  MIN_COURSE_PRICE: 10,
  MAX_COURSE_PRICE: 500,

  COURSE_LEVELS: ['beginner', 'intermediate', 'advanced'] as const,
  RESOURCE_TYPES: ['image', 'video', 'raw'] as const,
  CURRICULUM_CLASS_TYPES: ['chapter', 'lecture'] as const,
};
