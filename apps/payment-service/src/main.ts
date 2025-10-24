import 'reflect-metadata';
import { ServerApplication } from '@application/ServerApplication';

async function runApplication(): Promise<void> {
  const serverApplication = ServerApplication.new();
  await serverApplication.run();
  return Promise.resolve();
}

void runApplication();
