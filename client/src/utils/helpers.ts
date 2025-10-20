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

export function buildJsonApiQueryString(params: Record<string, any>): string {
  const urlSearchParams = new URLSearchParams();

  if (params.page) {
    if (params.page.number !== undefined)
      urlSearchParams.append("page[number]", String(params.page.number));
    if (params.page.size !== undefined)
      urlSearchParams.append("page[size]", String(params.page.size));
  }

  if (params.sort) {
    urlSearchParams.append("sort", String(params.sort));
  }

  if (params.filter && typeof params.filter === "object") {
    Object.entries(params.filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlSearchParams.append(`filter[${key}]`, String(value));
      }
    });
  }

  const queryString = urlSearchParams.toString();

  return queryString ? `?${queryString}` : "";
}

export const timeToString = (time: Time) =>
  `${time.hour.toString().padStart(2, "0")}:${time.minute.toString().padStart(2, "0")}`;

import { PaymentSummaryGroup } from "@/shared/enums/PaymentSummaryGroup";

export interface PaymentSummaryItem {
  period: string;
  instructorRevenue: number;
  platformFee: number;
  totalAmount: number;
  completedPayments: number;
}

export interface ChartDataItem {
  label: string;
  instructorRevenue: number;
  platformFee: number;
  totalAmount: number;
  completedPayments: number;
}

export function mapPaymentSummaryToChartData(
  summary: PaymentSummaryItem[],
  groupBy: PaymentSummaryGroup,
): ChartDataItem[] {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (groupBy === PaymentSummaryGroup.MONTH) {
    // create a map for faster lookup
    const summaryMap = new Map(
      summary.map((item) => {
        const monthIndex = parseInt(item.period.split("-")[1], 10) - 1;

        return [monthIndex, item];
      }),
    );

    return monthNames.map((month, index) => {
      const item = summaryMap.get(index);

      return {
        label: month,
        instructorRevenue: item?.instructorRevenue ?? 0,
        platformFee: item?.platformFee ?? 0,
        totalAmount: item?.totalAmount ?? 0,
        completedPayments: item?.completedPayments ?? 0,
      };
    });
  }

  // For YEAR or CUSTOM, keep original mapping
  return summary.map((item) => {
    let label = item.period;

    if (groupBy === PaymentSummaryGroup.CUSTOM) {
      const date = new Date(item.period);

      label = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    return {
      label,
      instructorRevenue: item.instructorRevenue,
      platformFee: item.platformFee,
      totalAmount: item.totalAmount,
      completedPayments: item.completedPayments,
    };
  });
}
