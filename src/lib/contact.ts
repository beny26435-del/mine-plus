import { formatPhoneForDisplay, telHref as makeTelHref } from "@/lib/phone";

export type PublicContact = {
  phone: string;
  whatsappLink: string;
};

export const defaultContact: PublicContact = {
  phone: "09201863207",
  whatsappLink: "https://wa.me/989201863207"
};

export function cleanContact(phone?: string | null, whatsappLink?: string | null): PublicContact {
  return {
    phone: formatPhoneForDisplay(phone || defaultContact.phone),
    whatsappLink: whatsappLink?.trim() || defaultContact.whatsappLink
  };
}

export const phone = defaultContact.phone;
export const whatsappLink = defaultContact.whatsappLink;

export function telHref(value = defaultContact.phone) {
  return makeTelHref(value);
}
