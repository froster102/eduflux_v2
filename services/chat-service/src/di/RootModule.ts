import { chatModule } from "@di/ChatModule";
import { messageModule } from "@di/MessageModule";
import { infrastructureModule } from "@di/InfrastructureModule";
import { Container } from "inversify";

const container = new Container();

void (async () => {
  await container.load(chatModule, messageModule, infrastructureModule);
})();

export { container };
