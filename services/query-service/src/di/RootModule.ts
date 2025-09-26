import { InfrastructureModule } from "@di/InfrastructureModule";
import { UserChatModule } from "@di/UserChatModule";
import { UserSessionModule } from "@di/UserSessionModule";
import { Container } from "inversify";

const container = new Container();
void (async () => {
  await container.load(UserSessionModule, UserChatModule, InfrastructureModule);
})();

export { container };
