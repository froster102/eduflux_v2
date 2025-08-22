/* eslint-disable */
/* prettier-ignore */

/** An IntrospectionQuery representation of your schema.
 *
 * @remarks
 * This is an introspection of your schema saved as a file by GraphQLSP.
 * It will automatically be used by `gql.tada` to infer the types of your GraphQL documents.
 * If you need to reuse this data or update your `scalars`, update `tadaOutputLocation` to
 * instead save to a .ts instead of a .d.ts file.
 */
export type introspection = {
  name: never;
  query: 'Query';
  mutation: never;
  subscription: never;
  types: {
    'Boolean': unknown;
    'Filters': { kind: 'OBJECT'; name: 'Filters'; fields: { 'name': { name: 'name'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'options': { name: 'options'; type: { kind: 'LIST'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'ID': unknown;
    'Int': unknown;
    'Pagination': { kind: 'OBJECT'; name: 'Pagination'; fields: { 'currentPage': { name: 'currentPage'; type: { kind: 'SCALAR'; name: 'Int'; ofType: null; } }; 'totalPages': { name: 'totalPages'; type: { kind: 'SCALAR'; name: 'Int'; ofType: null; } }; }; };
    'Query': { kind: 'OBJECT'; name: 'Query'; fields: { 'sessions': { name: 'sessions'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'SessionConnection'; ofType: null; }; } }; }; };
    'Session': { kind: 'OBJECT'; name: 'Session'; fields: { 'endTime': { name: 'endTime'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'instructor': { name: 'instructor'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'User'; ofType: null; }; } }; 'learner': { name: 'learner'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'User'; ofType: null; }; } }; 'startTime': { name: 'startTime'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'status': { name: 'status'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'ENUM'; name: 'SessionStatus'; ofType: null; }; } }; }; };
    'SessionConnection': { kind: 'OBJECT'; name: 'SessionConnection'; fields: { 'pagination': { name: 'pagination'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Pagination'; ofType: null; }; } }; 'sessions': { name: 'sessions'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Session'; ofType: null; }; }; }; } }; }; };
    'SessionFilters': { kind: 'INPUT_OBJECT'; name: 'SessionFilters'; inputFields: [{ name: 'status'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; }; defaultValue: null }]; };
    'SessionStatus': { name: 'SessionStatus'; enumValues: 'PENDING_PAYMENT' | 'BOOKED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW' | 'INSTRUCTOR_NO_SHOW' | 'PAYMENT_EXPIRED'; };
    'String': unknown;
    'User': { kind: 'OBJECT'; name: 'User'; fields: { 'email': { name: 'email'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'firstName': { name: 'firstName'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'image': { name: 'image'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'lastName': { name: 'lastName'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; }; };
  };
};

import * as gqlTada from 'gql.tada';

declare module 'gql.tada' {
  interface setupSchema {
    introspection: introspection
  }
}