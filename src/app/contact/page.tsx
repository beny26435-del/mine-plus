import Link from "next/link";
import { MessageCircle, PhoneCall } from "lucide-react";
import { phone, telHref, whatsappLink } from "@/lib/contact";

export default function ContactPage() {
  return (
    <section className="py-12">
      <div className="container">
        <div className="mx-auto max-w-3xl rounded-2xl border border-silver bg-white p-8 text-center shadow-panel">
          <p className="font-extrabold text-gold">تماس</p>
          <h1 className="mt-2 text-4xl font-extrabold text-graphite">ارتباط با Mine Plus</h1>
          <p className="mt-4 leading-8 text-steel">برای خرید ماینر، استعلام قطعه، ثبت تعمیر یا مشاوره فارم، مدل دستگاه و توضیح کوتاه نیازتان را آماده کنید و تماس بگیرید یا در واتساپ پیام بدهید.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={telHref()} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-silver px-5 py-3 font-extrabold text-graphite">
              <PhoneCall size={18} />
              <bdi dir="ltr">{phone}</bdi>
            </a>
            <Link href={whatsappLink} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">
              <MessageCircle size={18} />
              واتساپ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
