export enum WebSocketEvents {
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  CHAT_JOIN = 'chat:join',
  CHAT_LEAVE = 'chat:leave',
  MESSAGE_SEND = 'message:send',
  MESSAGE_NEW = 'message:new',
  MESSAGE_READ = 'message:read',
  MESSAGE_DELIVERED = 'message:delivered',
  MESSAGE_STATUS_UPDATE = 'message:status:update',
  MESSAGE_ERROR = 'message:error',
  ERROR = 'error',
}
