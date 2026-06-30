"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { submitFarmSetupRequest, submitRepairRequest } from "@/lib/actions";
import { validateLeadFiles } from "@/lib/upload-rules";

const initialState = { ok: false, message: "", values: {}, fieldErrors: {} };

type UploadedFile = { url: string; type: "image" | "video"; filename: string; size: number };

function SubmitButton({ label, disabled }: { label: string; disabled?: boolean }) {
  return (
    <button disabled={disabled} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite disabled:cursor-not-allowed disabled:opacity-60">
      <Send size={18} />
      {label}
    </button>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs font-bold text-red-600">{message}</p> : null;
}

function uploadWithProgress(files: File[], onProgress: (percent: number) => void) {
  return new Promise<UploadedFile[]>((resolve, reject) => {
    const body = new FormData();
    files.forEach((file) => body.append("files", file, file.name));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload/lead");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      const payload = JSON.parse(xhr.responseText || "{}") as { success?: boolean; message?: string; files?: UploadedFile[] };
      if (xhr.status >= 200 && xhr.status < 300 && payload.success && payload.files) resolve(payload.files);
      else reject(new Error(payload.message || "آپلود فایل انجام نشد."));
    };
    xhr.onerror = () => reject(new Error("ارتباط با سرور آپلود برقرار نشد."));
    xhr.send(body);
  });
}

export function RepairForm() {
  const [state, action, isPending] = useActionState(submitRepairRequest, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [clientError, setClientError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const percent = new Intl.NumberFormat("fa-IR").format(progress);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setClientError("");
      setProgress(0);
    }
  }, [state.ok]);

  async function handleAction(formData: FormData) {
    setClientError("");
    setProgress(0);
    const files = Array.from(fileRef.current?.files || []);
    if (files.length) {
      const validation = validateLeadFiles(files);
      if (validation) {
        setClientError(validation);
        return;
      }
      try {
        setUploading(true);
        const uploaded = await uploadWithProgress(files, setProgress);
        formData.set("uploadedFiles", JSON.stringify(uploaded));
      } catch (error) {
        setClientError(error instanceof Error ? error.message : "آپلود فایل انجام نشد.");
        return;
      } finally {
        setUploading(false);
      }
    }
    action(formData);
  }

  const busy = isPending || uploading;
  return (
    <form ref={formRef} action={handleAction} className="grid gap-4 rounded-2xl border border-silver bg-white p-5 shadow-panel md:grid-cols-2">
      <div>
        <input name="name" defaultValue={state.values?.name} placeholder="نام" className="min-h-12 w-full rounded-xl border border-silver bg-soft px-4 outline-none focus:border-gold" />
        <FieldError message={state.fieldErrors?.name} />
      </div>
      <div>
        <input name="phone" defaultValue={state.values?.phone} placeholder="09121234567" dir="ltr" className="min-h-12 w-full rounded-xl border border-silver bg-soft px-4 outline-none focus:border-gold" />
        <FieldError message={state.fieldErrors?.phone} />
      </div>
      <div>
        <input name="city" defaultValue={state.values?.city} placeholder="شهر" className="min-h-12 w-full rounded-xl border border-silver bg-soft px-4 outline-none focus:border-gold" />
        <FieldError message={state.fieldErrors?.city} />
      </div>
      <div>
        <input name="deviceModel" defaultValue={state.values?.deviceModel} placeholder="مدل دستگاه" className="min-h-12 w-full rounded-xl border border-silver bg-soft px-4 outline-none focus:border-gold" />
        <FieldError message={state.fieldErrors?.deviceModel} />
      </div>
      <div className="md:col-span-2">
        <input name="issueType" defaultValue={state.values?.issueType} placeholder="نوع مشکل" className="min-h-12 w-full rounded-xl border border-silver bg-soft px-4 outline-none focus:border-gold" />
        <FieldError message={state.fieldErrors?.issueType} />
      </div>
      <input name="mediaLink" defaultValue={state.values?.mediaLink} placeholder="لینک دستی عکس/ویدیو اختیاری" className="min-h-12 rounded-xl border border-silver bg-soft px-4 outline-none focus:border-gold md:col-span-2" />
      <div className="md:col-span-2 rounded-xl border border-dashed border-silver bg-soft p-4">
        <label className="font-extrabold text-graphite">ارسال عکس یا ویدیو خطا</label>
        <p className="mt-1 text-sm leading-7 text-steel">ارسال عکس یا ویدیو از صفحه وضعیت، خطا، صدای فن یا وضعیت هش‌ریت اختیاری است.</p>
        <input ref={fileRef} name="files" type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm" className="mt-3 block w-full text-sm" />
        {uploading ? (
          <div className="mt-3">
            <div className="h-2 overflow-hidden rounded-full bg-silver"><div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} /></div>
            <p className="mt-2 text-sm font-bold text-graphite">در حال آپلود فایل‌ها... {percent}٪</p>
          </div>
        ) : null}
      </div>
      <div className="md:col-span-2">
        <textarea name="description" defaultValue={state.values?.description} rows={5} placeholder="علائم، خطاها و توضیحات دستگاه" className="w-full rounded-xl border border-silver bg-soft px-4 py-3 outline-none focus:border-gold" />
        <FieldError message={state.fieldErrors?.description} />
      </div>
      <div className="md:col-span-2"><SubmitButton label={busy ? "در حال ثبت..." : "ثبت درخواست تعمیر"} disabled={busy} /></div>
      {clientError ? <p className="md:col-span-2 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{clientError}</p> : null}
      {state.message ? <p className={`md:col-span-2 rounded-xl p-3 text-sm font-bold ${state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{state.message}</p> : null}
    </form>
  );
}

export function FarmForm() {
  const [state, action, isPending] = useActionState(submitFarmSetupRequest, initialState);
  return (
    <form action={action} className="grid gap-4 rounded-2xl border border-silver bg-white p-5 shadow-panel md:grid-cols-2">
      <input type="hidden" name="city" value="ثبت نشده" />
      <input type="hidden" name="capacity" value="مشاوره اولیه" />
      <input type="hidden" name="powerStatus" value="نیازمند تماس" />
      <input type="hidden" name="location" value="نیازمند تماس" />
      <input type="hidden" name="description" value="درخواست تماس برای مشاوره خرید یا راه‌اندازی فارم" />
      <div>
        <input name="name" defaultValue={state.values?.name} placeholder="نام و نام خانوادگی" className="min-h-12 w-full rounded-xl border border-silver bg-soft px-4 outline-none focus:border-gold" />
        <FieldError message={state.fieldErrors?.name} />
      </div>
      <div>
        <input name="phone" defaultValue={state.values?.phone} placeholder="09121234567" dir="ltr" className="min-h-12 w-full rounded-xl border border-silver bg-soft px-4 outline-none focus:border-gold" />
        <FieldError message={state.fieldErrors?.phone} />
      </div>
      <p className="rounded-xl bg-soft p-4 text-sm leading-7 text-steel md:col-span-2">
        همین دو مورد کافی است. برای جزئیات خرید، فارم یا شرایط نصب، بعد از ثبت درخواست با شما هماهنگ می‌شود.
      </p>
      <div className="md:col-span-2"><SubmitButton label={isPending ? "در حال ثبت..." : "درخواست تماس مشاوره"} disabled={isPending} /></div>
      {state.message ? <p className={`md:col-span-2 rounded-xl p-3 text-sm font-bold ${state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{state.message}</p> : null}
    </form>
  );
}
