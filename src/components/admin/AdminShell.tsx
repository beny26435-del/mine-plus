import { LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";

const links = [
  ["داشبورد", "/admin"],
  ["ماینرها", "/admin/miners"],
  ["قطعات", "/admin/parts"],
  ["مقالات", "/admin/posts"],
  ["نمونه‌کارها", "/admin/case-studies"],
  ["درخواست تعمیر", "/admin/repair-requests"],
  ["درخواست فارم", "/admin/farm-requests"],
  ["تنظیمات", "/admin/settings"]
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell min-h-screen bg-soft text-graphite">
      <aside className="fixed inset-y-0 right-0 hidden w-64 border-l border-white/10 bg-navy p-5 text-white lg:block">
        <Logo />
        <nav className="mt-8 grid gap-2 text-sm font-bold">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="rounded-xl px-3 py-2 text-silver transition hover:bg-white/10 hover:text-gold">
              {label}
            </a>
          ))}
        </nav>
        <a href="/admin/logout" className="absolute bottom-5 right-5 inline-flex items-center gap-2 text-sm font-bold text-gold">
          <LogOut size={16} />
          خروج
        </a>
      </aside>
      <main className="lg:pr-64">
        <div className="border-b border-silver bg-white p-4 lg:hidden">
          <div className="flex flex-wrap gap-2 text-sm font-bold">
            {links.map(([label, href]) => (
              <a key={href} href={href} className="rounded-lg bg-soft px-3 py-2">
                {label}
              </a>
            ))}
          </div>
        </div>
        <div className="p-5 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
