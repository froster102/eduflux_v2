export interface JsonApiResponseOptions<T> {
  data: T;
  pageNumber?: number;
  pageSize?: number;
  totalCount?: number;
}

export function jsonApiResponse<T>(options: JsonApiResponseOptions<T>) {
  const { data, pageNumber, pageSize, totalCount } = options;

  const response: {
    data: T;
    meta?: {
      totalCount: number;
      totalPages: number;
      pageNumber: number;
      pageSize: number;
    };
    links?: {
      self: string;
      first: string;
      last?: string;
      next?: string;
      prev?: string;
    };
  } = {
    data,
  };

  if (
    pageNumber !== undefined &&
    pageSize !== undefined &&
    totalCount !== undefined
  ) {
    const totalPages = Math.ceil(totalCount / pageSize);

    response.meta = {
      totalCount,
      totalPages,
      pageNumber,
      pageSize,
    };

    response.links = {
      self: `?page[number]=${pageNumber}&page[size]=${pageSize}`,
      first: `?page[number]=1&page[size]=${pageSize}`,
      last: totalPages
        ? `?page[number]=${totalPages}&page[size]=${pageSize}`
        : undefined,
      next:
        pageNumber < totalPages
          ? `?page[number]=${pageNumber + 1}&page[size]=${pageSize}`
          : undefined,
      prev:
        pageNumber > 1
          ? `?page[number]=${pageNumber - 1}&page[size]=${pageSize}`
          : undefined,
    };
  }

  return response;
}

export interface JsonApiError {
  id?: string;
  status: string;
  code?: string;
  title: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
  };
  meta?: Record<string, any>;
}

export interface JsonApiErrorResponse {
  errors: JsonApiError[];
}

export const createJsonApiError = (
  status: number,
  code: string,
  title: string,
  detail?: string,
  meta?: Record<string, any>,
  source?: { pointer?: string; parameter?: string },
): JsonApiErrorResponse => {
  return {
    errors: [
      {
        status: String(status),
        code,
        title,
        detail,
        meta,
        source,
      },
    ],
  };
};

export function parseJsonApiQuery(rawQuery: Record<string, string>) {
  const parsed: Record<string, any> = {};

  for (const key in rawQuery) {
    const value = rawQuery[key];

    // Match keys like filter[title] or sort[price]
    const match = key.match(/^(\w+)\[(\w+)\]$/);
    if (match) {
      const [, parentKey, childKey] = match;
      parsed[parentKey] ??= {};
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      parsed[parentKey][childKey] = value;
    } else {
      parsed[key] = value;
    }
  }

  return parsed;
}
