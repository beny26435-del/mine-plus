import Link from "next/link";
import { MessageCircle, PhoneCall } from "lucide-react";
import { telHref } from "@/lib/contact";
import { getPublicContact } from "@/lib/site-contact";

export default async function ContactPage() {
  const contact = await getPublicContact();
  return (
    <section className="py-12">
      <div className="container">
        <div className="mx-auto max-w-3xl rounded-2xl border border-silver bg-white p-8 text-center shadow-panel">
          <p className="font-extrabold text-gold">تماس</p>
          <h1 className="mt-2 text-4xl font-extrabold text-graphite">ارتباط با ماین پلاس</h1>
          <p className="mt-4 leading-8 text-steel">برای خرید ماینر، تهیه قطعه، تعمیر دستگاه یا مشاوره فارم، مدل دستگاه و نیازتان را کوتاه بنویسید. اگر عکس یا ویدیو هم دارید، در واتساپ بفرستید تا دقیق‌تر راهنمایی شوید.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={telHref(contact.phone)} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-silver px-5 py-3 font-extrabold text-graphite">
              <PhoneCall size={18} />
              <bdi dir="ltr">{contact.phone}</bdi>
            </a>
            <Link href={contact.whatsappLink} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">
              <MessageCircle size={18} />
              واتساپ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
