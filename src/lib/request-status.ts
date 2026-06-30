export const requestStatusOptions = [
  { value: "new", label: "جدید" },
  { value: "reviewing", label: "در حال بررسی" },
  { value: "reviewed", label: "بررسی" },
  { value: "contacted", label: "تماس حاصل گردید" },
  { value: "diagnosing", label: "عیب‌یابی" },
  { value: "quoted", label: "اعلام هزینه" },
  { value: "repairing", label: "در حال تعمیر" },
  { value: "done", label: "انجام شده" },
  { value: "canceled", label: "لغو شده" }
];

export const farmRequestStatusOptions = [
  { value: "new", label: "جدید" },
  { value: "reviewing", label: "در حال بررسی" },
  { value: "reviewed", label: "بررسی" },
  { value: "contacted", label: "تماس حاصل گردید" },
  { value: "done", label: "انجام شده" },
  { value: "canceled", label: "لغو شده" }
];

export const dashboardHiddenRequestStatuses = ["reviewed", "contacted", "done", "canceled"];

export function requestStatusLabel(status: string) {
  return [...requestStatusOptions, ...farmRequestStatusOptions].find((item) => item.value === status)?.label || status;
}
