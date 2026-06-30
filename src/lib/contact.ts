import { formatPhoneForDisplay, telHref as makeTelHref } from "@/lib/phone";

export const phone = formatPhoneForDisplay(process.env.MINE_PLUS_PHONE || "09127023327");
export const whatsappLink = process.env.MINE_PLUS_WHATSAPP_LINK || "https://wa.me/989127023327";

export function telHref(value = phone) {
  return makeTelHref(value);
}
