import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { uploadProductImage } from "@/lib/upload";

export async function POST(request: Request) {
  await requireAdmin();
  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((file): file is File => file instanceof File && file.size > 0);
    const uploaded = await uploadProductImage(files);
    return NextResponse.json({ success: true, file: uploaded[0], files: uploaded });
  } catch (error) {
    const message = error instanceof Error ? error.message : "آپلود تصویر انجام نشد.";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
