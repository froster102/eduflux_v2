import type { GraphQLResolveInfo } from "graphql";
import type { SubgraphContext } from "../handler/graphqlHandler";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  _FieldSet: { input: any; output: any };
};

export type Chat = {
  __typename?: "Chat";
  createdAt: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  lastMessageAt: Scalars["String"]["output"];
  participants: Array<User>;
};

export type ChatConnection = {
  __typename?: "ChatConnection";
  chats: Array<Chat>;
  pagination: Pagination;
};

export type Pagination = {
  __typename?: "Pagination";
  currentPage?: Maybe<Scalars["Int"]["output"]>;
  totalPages?: Maybe<Scalars["Int"]["output"]>;
};

export type Query = {
  __typename?: "Query";
  chats: ChatConnection;
};

export type QueryChatsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  role?: InputMaybe<Role>;
};

export enum Role {
  Instructor = "INSTRUCTOR",
  Learner = "LEARNER",
}

export type User = {
  __typename?: "User";
  id: Scalars["ID"]["output"];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ReferenceResolver<TResult, TReference, TContext> = (
  reference: TReference,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

type ScalarCheck<T, S> = S extends true ? T : NullableCheck<T, S>;
type NullableCheck<T, S> =
  Maybe<T> extends T ? Maybe<ListCheck<NonNullable<T>, S>> : ListCheck<T, S>;
type ListCheck<T, S> = T extends (infer U)[]
  ? NullableCheck<U, S>[]
  : GraphQLRecursivePick<T, S>;
export type GraphQLRecursivePick<T, S> = {
  [K in keyof T & keyof S]: ScalarCheck<T[K], S[K]>;
};

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Chat: ResolverTypeWrapper<Chat>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  ChatConnection: ResolverTypeWrapper<ChatConnection>;
  Pagination: ResolverTypeWrapper<Pagination>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  Query: ResolverTypeWrapper<{}>;
  Role: Role;
  User: ResolverTypeWrapper<User>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Chat: Chat;
  String: Scalars["String"]["output"];
  ID: Scalars["ID"]["output"];
  ChatConnection: ChatConnection;
  Pagination: Pagination;
  Int: Scalars["Int"]["output"];
  Query: {};
  User: User;
  Boolean: Scalars["Boolean"]["output"];
};

export type ChatResolvers<
  ContextType = SubgraphContext,
  ParentType extends
    ResolversParentTypes["Chat"] = ResolversParentTypes["Chat"],
> = {
  __resolveReference?: ReferenceResolver<
    Maybe<ResolversTypes["Chat"]>,
    { __typename: "Chat" } & GraphQLRecursivePick<ParentType, { id: true }>,
    ContextType
  >;
  createdAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  lastMessageAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  participants?: Resolver<
    Array<ResolversTypes["User"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChatConnectionResolvers<
  ContextType = SubgraphContext,
  ParentType extends
    ResolversParentTypes["ChatConnection"] = ResolversParentTypes["ChatConnection"],
> = {
  chats?: Resolver<Array<ResolversTypes["Chat"]>, ParentType, ContextType>;
  pagination?: Resolver<ResolversTypes["Pagination"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaginationResolvers<
  ContextType = SubgraphContext,
  ParentType extends
    ResolversParentTypes["Pagination"] = ResolversParentTypes["Pagination"],
> = {
  currentPage?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  totalPages?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = SubgraphContext,
  ParentType extends
    ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = {
  chats?: Resolver<
    ResolversTypes["ChatConnection"],
    ParentType,
    ContextType,
    Partial<QueryChatsArgs>
  >;
};

export type UserResolvers<
  ContextType = SubgraphContext,
  ParentType extends
    ResolversParentTypes["User"] = ResolversParentTypes["User"],
> = {
  __resolveReference?: ReferenceResolver<
    Maybe<ResolversTypes["User"]>,
    { __typename: "User" } & GraphQLRecursivePick<ParentType, { id: true }>,
    ContextType
  >;

  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = SubgraphContext> = {
  Chat?: ChatResolvers<ContextType>;
  ChatConnection?: ChatConnectionResolvers<ContextType>;
  Pagination?: PaginationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};
