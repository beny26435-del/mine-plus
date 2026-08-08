import { cleanContact, defaultContact } from "@/lib/contact";
import { prisma } from "@/lib/prisma";

export async function getPublicContact() {
  const settings = await prisma.siteSettings
    .findUnique({ where: { id: 1 }, select: { phone: true, whatsappLink: true } })
    .catch(() => null);

  return settings ? cleanContact(settings.phone, settings.whatsappLink) : defaultContact;
}
