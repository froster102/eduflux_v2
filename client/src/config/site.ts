import { Role } from "@/shared/enums/Role";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {};

export const roleBasedRoutes: Record<Role, string> = {
  ADMIN: "/admin",
  LEARNER: "/",
  INSTRUCTOR: "/tutor",
};
