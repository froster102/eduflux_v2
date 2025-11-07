import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { SessionStatus } from '@/shared/enums/SessionStatus';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
}

export function testLoadingWithPromise(duration: number) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve('');
    }, duration),
  );
}

export function isLowPowerDevice() {
  return navigator.hardwareConcurrency < 6;
}

export function roomOptionsStringifyReplacer(key: string, val: unknown) {
  if (key === 'processor' && val && typeof val === 'object' && 'name' in val) {
    return val.name;
  }
  if (key === 'e2ee' && val) {
    return 'e2ee-enabled';
  }

  return val;
}

export function encodePassphrase(passphrase: string) {
  return encodeURIComponent(passphrase);
}

export function decodePassphrase(base64String: string) {
  return decodeURIComponent(base64String);
}

const sessionSuccessState = ['BOOKED', 'CONFIRMED', 'COMPLETED'];
const sessionWarnStates = ['IN_PROGRESS', 'PENDING_PAYMENT'];
const sessionFailureStates = ['PAYMENT_EXPIRED'];

export const getSessionStatusColor = (status: SessionStatus) => {
  if (sessionSuccessState.includes(status)) {
    return 'success';
  }
  if (sessionWarnStates.includes(status)) {
    return 'warning';
  }
  if (sessionFailureStates.includes(status)) {
    return 'danger';
  }

  return 'success';
};
