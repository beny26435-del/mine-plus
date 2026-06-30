export function normalizeIranPhone(value: string) {
  const digits = value.replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (/^09\d{9}$/.test(digits)) return digits;
  if (/^989\d{9}$/.test(digits)) return `0${digits.slice(2)}`;
  if (/^9\d{9}$/.test(digits)) return `0${digits}`;
  return value.trim();
}

export function isValidIranMobile(value: string) {
  return /^09\d{9}$/.test(normalizeIranPhone(value));
}

export function formatPhoneForDisplay(value: string) {
  return normalizeIranPhone(value);
}

export function telHref(value: string) {
  return `tel:${normalizeIranPhone(value)}`;
}
