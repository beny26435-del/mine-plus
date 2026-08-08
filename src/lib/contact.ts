import { formatPhoneForDisplay, telHref as makeTelHref } from "@/lib/phone";

const previousPhone = "09127023327";
const previousWhatsApp = "https://wa.me/989127023327";
const configuredPhone = process.env.NEXT_PUBLIC_MINE_PLUS_PHONE;
const configuredWhatsApp = process.env.NEXT_PUBLIC_MINE_PLUS_WHATSAPP_LINK;

export const phone = formatPhoneForDisplay(configuredPhone && configuredPhone !== previousPhone ? configuredPhone : "09201863207");
export const whatsappLink = configuredWhatsApp && configuredWhatsApp !== previousWhatsApp ? configuredWhatsApp : "https://wa.me/989201863207";

export function telHref(value = phone) {
  return makeTelHref(value);
}
