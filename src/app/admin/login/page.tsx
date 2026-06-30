import { loginAction } from "@/app/admin/actions";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const query = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center bg-navy p-5 text-white">
      <form action={loginAction} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow">
        <Logo />
        <h1 className="mt-8 text-2xl font-extrabold">ورود به پنل Mine Plus</h1>
        <label className="mt-6 grid gap-2 text-sm font-bold">ایمیل<input name="email" type="email" required className="rounded-xl border border-white/10 bg-white px-3 py-3 text-graphite" /></label>
        <label className="mt-4 grid gap-2 text-sm font-bold">رمز عبور<input name="password" type="password" required className="rounded-xl border border-white/10 bg-white px-3 py-3 text-graphite" /></label>
        {query.error ? <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm font-bold text-red-200">ایمیل یا رمز عبور درست نیست.</p> : null}
        <button className="mt-6 w-full rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">ورود</button>
      </form>
    </main>
  );
}
