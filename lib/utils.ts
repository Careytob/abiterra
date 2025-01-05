import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: string | number,
  options: { currency?: string; locale?: string; minimumFractionDigits?: number; maximumFractionDigits?: number } = {}
): string {
  const {
    currency = '₦',
    locale = 'en-NG',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options;

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numericPrice)) {
    return `${currency}0`;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currencyDisplay: 'symbol',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numericPrice);
}