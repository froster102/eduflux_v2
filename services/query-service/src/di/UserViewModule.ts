import { UserViewDITokens } from "@core/application/user-view/di/UserViewDITokens";
import type { UserUpdatedEventHandler } from "@core/application/user-view/handler/UserUpdatedEventHandler";
import { UserUpdatedEventHandlerService } from "@core/application/user-view/service/handler/UserUpdatedEventHandlerService";
import { ContainerModule } from "inversify";

export const UserViewModule: ContainerModule = new ContainerModule(
  (options) => {
    options
      .bind<UserUpdatedEventHandler>(UserViewDITokens.UserUpdatedEventHandler)
      .to(UserUpdatedEventHandlerService);
  },
);
