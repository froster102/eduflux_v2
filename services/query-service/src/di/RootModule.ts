import { InfrastructureModule } from "@di/InfrastructureModule";
import { InstructorViewModule } from "@di/InstructorViewModule";
import { UserChatModule } from "@di/UserChatModule";
import { UserSessionModule } from "@di/UserSessionModule";
import { UserViewModule } from "@di/UserViewModule";
import { Container } from "inversify";

const container = new Container();
void (async () => {
  await container.load(
    UserSessionModule,
    UserChatModule,
    InstructorViewModule,
    InfrastructureModule,
    UserViewModule,
  );
})();

export { container };
