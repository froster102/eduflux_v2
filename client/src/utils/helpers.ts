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
