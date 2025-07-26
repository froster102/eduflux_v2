export function getAllTimeZones() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const timeZones = (Intl as any).supportedValuesOf('timeZone') as string[];

  return new Set(
    timeZones.filter((timeZone) => {
      return timeZone !== 'UTC';
    }),
  );
}
