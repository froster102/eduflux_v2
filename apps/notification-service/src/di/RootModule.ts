import { InfrastructureModule } from "@di/InfrastructureModule";
import { NotificationModule } from "@di/NotificationModule";
import { Container } from "inversify";

const container = new Container();
void (async () => {
  await container.load(NotificationModule, InfrastructureModule);
})();

export { container };
