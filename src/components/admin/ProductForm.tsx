import { AdminImageUpload } from "@/components/admin/AdminFields";
import { saveProductAction } from "@/app/admin/actions";

type ProductInput = {
  id?: string;
  title?: string;
  slug?: string;
  category?: string;
  kind?: string;
  shortDescription?: string;
  description?: string;
  image?: string | null;
  priceText?: string | null;
  stockStatus?: string;
  featured?: boolean;
  status?: string;
  sortOrder?: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

export function ProductForm({ product, kind }: { product?: ProductInput | null; kind: "miner" | "part" }) {
  return (
    <form action={saveProductAction} className="grid gap-4 rounded-2xl border border-silver bg-white p-5 shadow-panel md:grid-cols-2">
      <input type="hidden" name="id" defaultValue={product?.id} />
      <input type="hidden" name="kind" defaultValue={kind} />
      <label className="grid gap-1 font-bold">عنوان<input name="title" required defaultValue={product?.title} className="rounded-xl border border-silver px-3 py-2" /></label>
      <label className="grid gap-1 font-bold">اسلاگ<input name="slug" defaultValue={product?.slug} className="rounded-xl border border-silver px-3 py-2 text-left" dir="ltr" /></label>
      <label className="grid gap-1 font-bold">دسته<input name="category" required defaultValue={product?.category || (kind === "part" ? "قطعات" : "ماینر")} className="rounded-xl border border-silver px-3 py-2" /></label>
      <label className="grid gap-1 font-bold">قیمت نمایشی<input name="priceText" defaultValue={product?.priceText || "استعلامی"} className="rounded-xl border border-silver px-3 py-2" /></label>
      <label className="grid gap-1 font-bold">وضعیت موجودی<select name="stockStatus" defaultValue={product?.stockStatus || "inquiry"} className="rounded-xl border border-silver px-3 py-2"><option value="available">موجود</option><option value="inquiry">استعلامی</option><option value="unavailable">ناموجود</option></select></label>
      <label className="grid gap-1 font-bold">وضعیت انتشار<select name="status" defaultValue={product?.status || "published"} className="rounded-xl border border-silver px-3 py-2"><option value="published">منتشر شده</option><option value="draft">پیش‌نویس</option></select></label>
      <label className="grid gap-1 font-bold md:col-span-2">توضیح کوتاه<input name="shortDescription" required defaultValue={product?.shortDescription} className="rounded-xl border border-silver px-3 py-2" /></label>
      <label className="grid gap-1 font-bold md:col-span-2">توضیح کامل<textarea name="description" required rows={8} defaultValue={product?.description} className="rounded-xl border border-silver px-3 py-2" /></label>
      <div className="md:col-span-2">
        <p className="mb-1 font-bold">تصویر محصول</p>
        <p className="mb-3 text-sm leading-7 text-steel">از این بخش می‌توانید تصویر محصول را آپلود کنید یا لینک تصویر فعلی را با تصویر جدید جایگزین کنید.</p>
        <AdminImageUpload defaultValue={product?.image} />
      </div>
      <label className="grid gap-1 font-bold">ترتیب نمایش<input name="sortOrder" type="number" defaultValue={product?.sortOrder || 0} className="rounded-xl border border-silver px-3 py-2" /></label>
      <label className="flex items-center gap-2 font-bold"><input name="featured" type="checkbox" defaultChecked={product?.featured} /> نمایش در صفحه اصلی</label>
      <label className="grid gap-1 font-bold md:col-span-2">Meta title<input name="metaTitle" defaultValue={product?.metaTitle || ""} className="rounded-xl border border-silver px-3 py-2" /></label>
      <label className="grid gap-1 font-bold md:col-span-2">Meta description<textarea name="metaDescription" rows={3} defaultValue={product?.metaDescription || ""} className="rounded-xl border border-silver px-3 py-2" /></label>
      <button className="md:col-span-2 rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">ذخیره</button>
    </form>
  );
}
