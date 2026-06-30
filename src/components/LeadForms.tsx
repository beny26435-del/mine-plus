"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, Send, X } from "lucide-react";
import { submitFarmSetupRequest, submitRepairRequest } from "@/lib/actions";
import { validateLeadFiles } from "@/lib/upload-rules";

const initialState = { ok: false, message: "", values: {}, fieldErrors: {} };

type UploadedFile = { url: string; type: "image" | "video"; filename: string; size: number };
type UploadedItem = UploadedFile & { originalName: string };

function SubmitButton({ label, disabled, busy }: { label: string; disabled?: boolean; busy?: boolean }) {
  return (
    <button
      disabled={disabled}
      className={`relative inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite transition disabled:cursor-not-allowed disabled:opacity-75 ${busy ? "animate-pulse shadow-glow" : "hover:bg-gold/90"}`}
    >
      {busy ? <span className="absolute inset-0 -translate-x-full animate-[shine_1.4s_infinite] bg-gradient-to-l from-transparent via-white/35 to-transparent" /> : null}
      {busy ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
      {label}
    </button>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs font-bold text-red-600">{message}</p> : null;
}

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
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
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedItem[]>([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const percent = new Intl.NumberFormat("fa-IR").format(progress);
  const fileCount = new Intl.NumberFormat("fa-IR").format(selectedFiles.length);

  useEffect(() => {
    setSaving(false);
    if (state.ok) {
      formRef.current?.reset();
      setClientError("");
      setProgress(0);
      setSelectedFiles([]);
      setUploadedFiles([]);
      setUploadMessage("");
      if (fileRef.current) fileRef.current.value = "";
    }
  }, [state]);

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    setUploadedFiles([]);
    setProgress(0);
    setUploadMessage(files.length ? `${new Intl.NumberFormat("fa-IR").format(files.length)} فایل آماده آپلود است.` : "");
    const validation = validateLeadFiles(files);
    setClientError(validation);
    if (validation || !files.length) return;

    try {
      setUploading(true);
      setUploadMessage("در حال آپلود فایل‌ها...");
      const uploaded = await uploadWithProgress(files, setProgress);
      setUploadedFiles(uploaded.map((file, index) => ({ ...file, originalName: files[index]?.name || file.filename })));
      setUploadMessage("فایل‌ها آپلود شدند. اگر لازم بود می‌توانید قبل از ثبت، فایل را حذف کنید.");
    } catch (error) {
      setUploadedFiles([]);
      setClientError(error instanceof Error ? error.message : "آپلود فایل انجام نشد.");
      setUploadMessage("");
    } finally {
      setUploading(false);
    }
  }

  function removeUploadedFile(index: number) {
    setUploadedFiles((files) => files.filter((_, fileIndex) => fileIndex !== index));
    setUploadMessage("فایل از درخواست حذف شد. برای ارسال فایل جدید دوباره انتخاب کنید.");
    if (fileRef.current) fileRef.current.value = "";
    setSelectedFiles([]);
    setProgress(0);
  }

  async function handleAction(_formData: FormData) {
    setClientError("");
    const submitData = new FormData(formRef.current || undefined);
    submitData.delete("files");
    submitData.delete("mediaLink");
    if (uploading) {
      setClientError("لطفاً تا پایان آپلود فایل صبر کنید.");
      return;
    }
    if (uploadedFiles.length) {
      submitData.set("uploadedFiles", JSON.stringify(uploadedFiles.map(({ originalName: _originalName, ...file }) => file)));
      setUploadMessage("فایل‌ها آماده‌اند. در حال ثبت درخواست...");
    }
    setSaving(true);
    action(submitData);
  }

  const busy = isPending || uploading || saving;
  return (
    <form ref={formRef} action={handleAction} className={`grid gap-4 rounded-2xl border border-silver bg-white p-5 shadow-panel transition ${busy ? "ring-2 ring-gold/40" : ""} md:grid-cols-2`}>
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
      <div className="md:col-span-2 rounded-xl border border-dashed border-silver bg-soft p-4">
        <label className="font-extrabold text-graphite">ارسال عکس یا ویدیو خطا</label>
        <p className="mt-1 text-sm leading-7 text-steel">ارسال عکس یا ویدیو از صفحه وضعیت، خطا، صدای فن یا وضعیت هش‌ریت اختیاری است.</p>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
          onChange={onFileChange}
          disabled={busy}
          className="mt-3 block w-full text-sm disabled:cursor-not-allowed disabled:opacity-60"
        />
        {selectedFiles.length ? (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-bold text-steel">
              <span>{uploadMessage || `${fileCount} فایل انتخاب شده است.`}</span>
              <span>{uploading ? `${percent}٪` : uploadedFiles.length ? "آپلود شد" : "آماده"}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-silver">
              <div className="h-full bg-gold transition-all duration-300" style={{ width: `${uploading || progress === 100 ? progress : 0}%` }} />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(uploadedFiles.length ? uploadedFiles : selectedFiles.map((file) => ({ originalName: file.name, filename: file.name, size: file.size, url: "", type: file.type.startsWith("video/") ? "video" : "image" }))).map((file, index) => (
                <span key={`${file.filename}-${file.size}-${index}`} className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-steel">
                  <span className="truncate">{file.originalName || file.filename}</span>
                  <span className="shrink-0 text-[10px] text-steel/70">{formatBytes(file.size)}</span>
                  {uploadedFiles.length ? (
                    <button type="button" onClick={() => removeUploadedFile(index)} className="shrink-0 rounded-full bg-red-50 p-1 text-red-600 hover:bg-red-100" aria-label="حذف فایل">
                      <X size={12} />
                    </button>
                  ) : null}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="md:col-span-2">
        <textarea name="description" defaultValue={state.values?.description} rows={5} placeholder="علائم، خطاها و توضیحات دستگاه" className="w-full rounded-xl border border-silver bg-soft px-4 py-3 outline-none focus:border-gold" />
        <FieldError message={state.fieldErrors?.description} />
      </div>
      <div className="md:col-span-2"><SubmitButton label={uploading ? `در حال آپلود... ${percent}٪` : busy ? "در حال ثبت درخواست..." : "ثبت درخواست تعمیر"} disabled={busy || Boolean(clientError)} busy={busy} /></div>
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
      <div className="md:col-span-2"><SubmitButton label={isPending ? "در حال ثبت درخواست..." : "درخواست تماس مشاوره"} disabled={isPending} busy={isPending} /></div>
      {state.message ? <p className={`md:col-span-2 rounded-xl p-3 text-sm font-bold ${state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{state.message}</p> : null}
    </form>
  );
}
