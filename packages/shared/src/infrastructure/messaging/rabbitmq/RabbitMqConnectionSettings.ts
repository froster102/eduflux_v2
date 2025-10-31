export type RabbitMQConnectionSettings = {
  username: string;
  password: string;
  vhost: string;
  connection: {
    secure: boolean;
    hostname: string;
    port: number;
  };
  maxRetries: number;
};
