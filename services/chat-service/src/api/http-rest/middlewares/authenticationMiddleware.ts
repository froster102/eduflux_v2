import { UnauthorizedException } from "@core/common/exception/UnauthorizedException";
import type { JwtPayload } from "@shared/types/JwtPayload";
import { validateToken } from "@shared/utils/jwt.util";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

export type Env = {
  Variables: {
    user: JwtPayload;
  };
};

export const authenticaionMiddleware = createMiddleware<Env>(
  async (c, next) => {
    const token = getCookie(c, "user_jwt");
    if (!token) {
      throw new UnauthorizedException("Authentication Token Not Found");
    }
    const payload = await validateToken(token).catch(() => {
      throw new UnauthorizedException("Invalid token");
    });
    c.set("user", payload);
    await next();
  },
);
