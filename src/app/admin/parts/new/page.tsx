import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";

export default async function NewPartPage() {
  await requireAdmin();
  return <AdminShell><h1 className="mb-6 text-3xl font-extrabold">قطعه جدید</h1><ProductForm kind="part" /></AdminShell>;
}
