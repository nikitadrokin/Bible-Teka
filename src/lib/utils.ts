import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Locale } from '@/store/locale-store';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const padNumber = (num: number): string => {
  return num.toString().padStart(2, '0');
};

export const formatDateTime = (date: Date, locale: Locale): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Intl.DateTimeFormat(
    locale === 'en' ? 'en-US' : 'ru-RU',
    options,
  ).format(date);
};
