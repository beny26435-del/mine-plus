import { NextResponse } from "next/server";
import { uploadLeadFiles } from "@/lib/upload";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((file): file is File => file instanceof File && file.size > 0);
    if (!files.length) {
      return NextResponse.json({ success: false, message: "هیچ فایلی انتخاب نشده است." }, { status: 400 });
    }
    const uploaded = await uploadLeadFiles(files);
    return NextResponse.json({ success: true, files: uploaded });
  } catch (error) {
    const message = error instanceof Error ? error.message : "آپلود فایل انجام نشد.";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
