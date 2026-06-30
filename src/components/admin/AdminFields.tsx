"use client";

import { useState } from "react";
import { validateProductImage } from "@/lib/upload-rules";

type AdminUploadedFile = { url: string };

function toPersianNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function uploadAdminImageWithProgress(file: File, onProgress: (percent: number) => void) {
  return new Promise<AdminUploadedFile>((resolve, reject) => {
    const body = new FormData();
    body.append("files", file, file.name);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload/product-image");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      let payload: { success?: boolean; message?: string; file?: AdminUploadedFile } = {};
      try {
        payload = JSON.parse(xhr.responseText || "{}");
      } catch {
        reject(new Error("پاسخ سرور آپلود معتبر نیست."));
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300 && payload.success && payload.file?.url) {
        onProgress(100);
        resolve(payload.file);
        return;
      }
      reject(new Error(payload.message || "آپلود تصویر انجام نشد."));
    };
    xhr.onerror = () => reject(new Error("ارتباط با سرور آپلود برقرار نشد."));
    xhr.send(body);
  });
}

export function AdminImageUpload({ name = "image", defaultValue }: { name?: string; defaultValue?: string | null }) {
  const [value, setValue] = useState(defaultValue || "");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const percent = toPersianNumber(progress);

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage("");
    setProgress(0);
    const validation = validateProductImage([file]);
    if (validation) {
      setMessage(validation);
      event.target.value = "";
      return;
    }
    setUploading(true);
    try {
      const uploaded = await uploadAdminImageWithProgress(file, setProgress);
      setValue(uploaded.url);
      setMessage("تصویر آپلود شد.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "آپلود تصویر انجام نشد.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="rounded-xl border border-silver bg-soft p-3">
      <input type="hidden" name={name} value={value} />
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onChange} disabled={uploading} className="block w-full text-sm disabled:cursor-not-allowed disabled:opacity-60" />
      {uploading ? (
        <div className="mt-3">
          <div className="h-2 overflow-hidden rounded-full bg-silver">
            <div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs font-extrabold text-graphite">در حال آپلود تصویر... {percent}٪</p>
        </div>
      ) : null}
      {value ? <input value={value} onChange={(event) => setValue(event.target.value)} className="mt-3 w-full rounded-lg border border-silver bg-white px-3 py-2 text-left text-xs" dir="ltr" /> : null}
      {message ? <p className={`mt-2 text-xs font-bold ${message.includes("شد") ? "text-green-700" : "text-red-700"}`}>{message}</p> : null}
    </div>
  );
}

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className="rounded-lg border border-silver px-3 py-2 text-xs font-extrabold"
    >
      {copied ? "کپی شد" : "کپی لینک"}
    </button>
  );
}
