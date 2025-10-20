import { SVGProps } from "react";

declare global {
  export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
  };

  export type User = {
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    image?: string | null | undefined | undefined;
    roles: Role[];
    id: string;
  };

  export type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
    bio: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
  };

  export type BetterAuthError = {
    code?: string | undefined;
    message?: string | undefined;
    status: number;
    statusText: string;
  };

  export type PaginationQueryParameters = {
    page?: {
      number?: number;
      size?: number;
    };
  };

  export type CursorPaginationQueryParameters = {
    page?: {
      cursor: string | undefined;
      size?: number;
    };
  };

  export type DefaultFormProps<TFormData> = {
    onSubmitHandler(data: TFormData): void;
    isPending?: boolean;
    onCancel?: () => void;
    mode?: "create" | "edit";
    initialValue?: TFormData;
    submitText?: string;
    cancelText?: string;
  };

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

  export type Pagination = {
    totalCount: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
  };

  export interface JsonApiResponse<T> {
    data: T;
    meta?: {
      totalCount?: number;
      totalPages?: number;
      pageNumber?: number;
      pageSize?: number;
    };
    links?: {
      self: string;
      first: string;
      last?: string;
      next?: string;
      prev?: string | null;
    };
  }
}

export {};
