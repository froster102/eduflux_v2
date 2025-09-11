import { Time } from "@internationalized/date";
import { UAParser } from "ua-parser-js";

export function getDeviceName(userAgent: string) {
  const parser = new UAParser();

  parser.setUA(userAgent);
  const result = parser.getResult();

  const deviceType = result.device.type || "desktop"; // Default to 'desktop' if no device type is found
  const osName = result.os.name?.toLowerCase() || "unknown";
  // const browserName = result.browser.name?.toLowerCase() || "unknown";

  let deviceCategory: string;

  if (deviceType === "mobile") {
    if (osName.includes("android")) {
      deviceCategory = "Mobile (Android)";
    } else if (osName.includes("ios")) {
      deviceCategory = "Mobile (iOS)";
    } else {
      deviceCategory = "Mobile (Other)";
    }
  } else if (deviceType === "tablet") {
    if (osName.includes("android")) {
      deviceCategory = "Tablet (Android)";
    } else if (osName.includes("ios")) {
      deviceCategory = "Tablet (iOS)";
    } else {
      deviceCategory = "Tablet (Other)";
    }
  } else if (deviceType === "desktop") {
    if (osName.includes("windows")) {
      deviceCategory = "Desktop (Windows)";
    } else if (osName.includes("linux")) {
      deviceCategory = "Desktop (Linux)";
    } else if (osName.includes("mac")) {
      deviceCategory = "Desktop (macOS)";
    } else {
      deviceCategory = "Desktop (Other)";
    }
  } else {
    deviceCategory = "Unknown";
  }

  return {
    deviceCategory,
    os: result.os,
    browser: result.browser,
    device: result.device,
  };
}

export function buildQueryUrlParams(params: Record<string, any>): string {
  const urlSearchParams = new URLSearchParams();

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];

      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          urlSearchParams.append(key, value.join(","));
        } else if (typeof value === "object") {
          try {
            urlSearchParams.append(key, JSON.stringify(value));
          } catch {
            console.error(`Could not stringify value for key: ${key}`);
          }
        } else {
          urlSearchParams.append(key, String(value));
        }
      }
    }
  }

  const queryString = urlSearchParams.toString();

  return queryString ? `?${queryString}` : "";
}

export const timeToString = (time: Time) =>
  `${time.hour.toString().padStart(2, "0")}:${time.minute.toString().padStart(2, "0")}`;
