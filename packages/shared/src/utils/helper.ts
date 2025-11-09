export function calculateOffset(page: { number: number; size: number }) {
  const { number, size } = page;
  const offset = (number - 1) * size;
  return offset;
}

export function parseCookieHeader(header: string): Map<string, string> {
  const map = new Map<string, string>();

  if (!header?.trim()) {
    return map;
  }

  const cookies = header.split(/;(?=\s*[^\s])/);

  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (!trimmedCookie) {
      continue;
    }

    const equalIndex = trimmedCookie.indexOf('=');
    if (equalIndex === -1) {
      continue;
    }

    const key = trimmedCookie.substring(0, equalIndex).trim();
    let value = trimmedCookie.substring(equalIndex + 1).trim();

    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    try {
      map.set(decodeURIComponent(key), decodeURIComponent(value));
    } catch {
      continue;
    }
  }

  return map;
}
