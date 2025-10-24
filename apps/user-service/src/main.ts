import 'reflect-metadata';
import { ServerApplication } from 'src/app/ServerApplication';

async function runApplication(): Promise<void> {
  const serverApplication = ServerApplication.new();
  await serverApplication.run();
}

void runApplication();
