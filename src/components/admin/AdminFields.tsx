"use client";

import { useState } from "react";

export function AdminImageUpload({ name = "image", defaultValue }: { name?: string; defaultValue?: string | null }) {
  const [value, setValue] = useState(defaultValue || "");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage("");
    setUploading(true);
    const body = new FormData();
    body.append("files", file);
    try {
      const response = await fetch("/api/admin/upload/product-image", { method: "POST", body });
      const payload = (await response.json()) as { success?: boolean; message?: string; file?: { url: string } };
      if (!response.ok || !payload.success || !payload.file?.url) throw new Error(payload.message || "آپلود تصویر انجام نشد.");
      setValue(payload.file.url);
      setMessage("تصویر آپلود شد.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "آپلود تصویر انجام نشد.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-xl border border-silver bg-soft p-3">
      <input type="hidden" name={name} value={value} />
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onChange} className="block w-full text-sm" />
      {value ? <input value={value} onChange={(event) => setValue(event.target.value)} className="mt-3 w-full rounded-lg border border-silver bg-white px-3 py-2 text-left text-xs" dir="ltr" /> : null}
      {message ? <p className={`mt-2 text-xs font-bold ${message.includes("شد") ? "text-green-700" : "text-red-700"}`}>{message}</p> : null}
      {uploading ? <p className="mt-2 text-xs font-bold text-steel">در حال آپلود...</p> : null}
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
