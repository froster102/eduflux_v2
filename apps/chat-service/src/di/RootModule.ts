import { chatModule } from "@di/ChatModule";
import { messageModule } from "@di/MessageModule";
import { infrastructureModule } from "@di/InfrastructureModule";
import { Container } from "inversify";
import { UserChatModule } from "@di/UserChatModule";

const container = new Container();

void (async () => {
  await container.load(
    chatModule,
    messageModule,
    infrastructureModule,
    UserChatModule,
  );
})();

export { container };
