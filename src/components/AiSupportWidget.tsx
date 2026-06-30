"use client";

import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type FieldErrors = {
  fullName?: string;
  phone?: string;
};

const leadStorageKey = "mineplus-support-lead";

export function AiSupportWidget() {
  const [enabled, setEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [leadId, setLeadId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/support/config")
      .then((response) => response.json())
      .then((payload: { enabled?: boolean; quickReplies?: string[] }) => {
        if (!mounted) return;
        setEnabled(Boolean(payload.enabled));
        setQuickReplies(payload.quickReplies || []);
      })
      .catch(() => setEnabled(false))
      .finally(() => mounted && setLoaded(true));

    const cached = window.localStorage.getItem(leadStorageKey);
    if (cached) setLeadId(cached);

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const activated = Boolean(leadId);
  const title = useMemo(() => (activated ? "پشتیبانی هوشمند Mine Plus" : "شروع پشتیبانی"), [activated]);

  if (!loaded || !enabled) return null;

  async function startSupport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setFieldErrors({});
    try {
      const response = await fetch("/api/support/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone })
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        setFieldErrors(payload.fieldErrors || {});
        setError(payload.message || "شروع گفت‌وگو انجام نشد.");
        return;
      }
      setLeadId(payload.leadId);
      window.localStorage.setItem(leadStorageKey, payload.leadId);
      setMessages([{ role: "assistant", text: payload.message }]);
      setDraft("");
    } catch {
      setError("ارتباط با پشتیبانی برقرار نشد. دوباره تلاش کنید.");
    } finally {
      setBusy(false);
    }
  }

  async function sendMessage(message = draft) {
    const trimmed = message.trim();
    if (!trimmed || busy || !leadId) return;
    setBusy(true);
    setError("");
    setDraft("");
    setMessages((items) => [...items, { role: "user", text: trimmed }]);
    try {
      const response = await fetch("/api/support/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, message: trimmed })
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        setError(payload.message || "پاسخ دریافت نشد.");
        return;
      }
      setMessages((items) => [...items, { role: "assistant", text: payload.message }]);
    } catch {
      setError("ارتباط با پشتیبانی برقرار نشد.");
    } finally {
      setBusy(false);
    }
  }

  function resetSupport() {
    window.localStorage.removeItem(leadStorageKey);
    setLeadId("");
    setMessages([]);
    setFullName("");
    setPhone("");
    setDraft("");
    setError("");
    setFieldErrors({});
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 sm:bottom-5 sm:left-5">
      {open ? (
        <section className="mb-3 flex h-[min(72vh,560px)] w-[calc(100vw-32px)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-gold/20 bg-white text-graphite shadow-[0_24px_70px_rgba(11,18,32,0.28)]">
          <header className="flex items-center justify-between gap-3 bg-navy px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gold text-graphite">
                <Bot size={20} />
              </span>
              <div>
                <h2 className="text-sm font-extrabold">{title}</h2>
                <p className="text-xs text-silver">پاسخ‌گویی اولیه بدون هزینه</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-gold" aria-label="بستن پشتیبانی">
              <X size={18} />
            </button>
          </header>

          {!activated ? (
            <form onSubmit={startSupport} className="grid gap-3 p-4">
              <p className="rounded-2xl bg-soft p-3 text-sm leading-7 text-steel">
                برای اینکه مشاوره گم نشود، اول نام و شماره تماس را وارد کنید. بعد از آن دستیار فعال می‌شود.
              </p>
              <label className="grid gap-1 text-sm font-extrabold">
                نام و نام خانوادگی
                <input value={fullName} onChange={(event) => setFullName(event.target.value)} className="min-h-11 rounded-xl border border-silver bg-white px-3 outline-none focus:border-gold" />
                {fieldErrors.fullName ? <span className="text-xs text-red-600">{fieldErrors.fullName}</span> : null}
              </label>
              <label className="grid gap-1 text-sm font-extrabold">
                شماره تماس
                <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="09121234567" dir="ltr" className="min-h-11 rounded-xl border border-silver bg-white px-3 text-left outline-none focus:border-gold" />
                {fieldErrors.phone ? <span className="text-xs text-red-600">{fieldErrors.phone}</span> : null}
              </label>
              {error ? <p className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{error}</p> : null}
              <button disabled={busy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gold px-4 py-2 font-extrabold text-graphite disabled:cursor-not-allowed disabled:opacity-70">
                {busy ? <Loader2 size={17} className="animate-spin" /> : <MessageCircle size={17} />}
                فعال کردن ساپورت
              </button>
            </form>
          ) : (
            <>
              <div ref={messagesRef} className="flex-1 space-y-3 overflow-y-auto bg-soft p-4">
                {messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}>
                    <p className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-7 ${message.role === "user" ? "bg-gold text-graphite" : "bg-white text-steel shadow-sm"}`}>
                      {message.text}
                    </p>
                  </div>
                ))}
                {busy ? <p className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-bold text-steel"><Loader2 size={14} className="animate-spin" /> در حال پاسخ...</p> : null}
              </div>
              <div className="border-t border-silver bg-white p-3">
                {messages.length <= 1 ? (
                  <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                    {quickReplies.map((item) => (
                      <button key={item} type="button" onClick={() => sendMessage(item)} className="shrink-0 rounded-full border border-silver px-3 py-1.5 text-xs font-bold text-steel">
                        {item}
                      </button>
                    ))}
                  </div>
                ) : null}
                {error ? <p className="mb-2 rounded-xl bg-red-50 p-2 text-xs font-bold text-red-700">{error}</p> : null}
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    sendMessage();
                  }}
                  className="flex gap-2"
                >
                  <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="سوال خود را بنویسید..." className="min-h-11 flex-1 rounded-xl border border-silver bg-white px-3 text-sm outline-none focus:border-gold" />
                  <button disabled={busy || !draft.trim()} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold text-graphite disabled:cursor-not-allowed disabled:opacity-60" aria-label="ارسال پیام">
                    <Send size={18} />
                  </button>
                </form>
                <button type="button" onClick={resetSupport} className="mt-2 text-xs font-bold text-steel hover:text-graphite">شروع گفت‌وگوی جدید</button>
              </div>
            </>
          )}
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-gold px-4 py-3 font-extrabold text-graphite shadow-[0_18px_45px_rgba(242,211,53,0.28)] transition hover:-translate-y-0.5"
      >
        <Bot size={20} />
        ساپورت AI
      </button>
    </div>
  );
}
