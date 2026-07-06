"use client";

import { Calculator, Cpu, DollarSign, Loader2, PlugZap, RotateCw, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { calculateMiningProfit, type MiningStats } from "@/lib/mining";

const nfFa = new Intl.NumberFormat("fa-IR");
const nfFaCompact = new Intl.NumberFormat("fa-IR", { notation: "compact", maximumFractionDigits: 2 });
const nfUsd = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

type StatsResponse = {
  success: boolean;
  message?: string;
  stats?: MiningStats;
};

const presetMiners = [
  { label: "Antminer S19 Pro", hashrateTH: 110, powerW: 3250 },
  { label: "Antminer S21", hashrateTH: 200, powerW: 3500 },
  { label: "Whatsminer M30S++", hashrateTH: 112, powerW: 3472 },
  { label: "Whatsminer M60", hashrateTH: 170, powerW: 3380 }
];

export function MiningCalculator() {
  const [stats, setStats] = useState<MiningStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [hashrateTH, setHashrateTH] = useState(200);
  const [powerW, setPowerW] = useState(3500);
  const [electricity, setElectricity] = useState(3000);
  const [usdToman, setUsdToman] = useState(62000);
  const [poolFee, setPoolFee] = useState(2);
  const [devicePrice, setDevicePrice] = useState(0);
  const [avgFee, setAvgFee] = useState(0);

  async function loadStats() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/mining/stats", { cache: "no-store" });
      const payload = (await response.json()) as StatsResponse;
      if (!response.ok || !payload.success || !payload.stats) {
        setError(payload.message || "داده زنده دریافت نشد.");
        setStats(null);
        return;
      }
      setStats(payload.stats);
    } catch {
      setError("ارتباط با سرویس داده زنده برقرار نشد.");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  const result = useMemo(() => {
    if (!stats) return null;
    return calculateMiningProfit({
      hashrateTH,
      powerW,
      electricityTomanPerKwh: electricity,
      usdToman,
      poolFeePercent: poolFee,
      devicePriceToman: devicePrice,
      avgFeeBtcPerBlock: avgFee,
      stats
    });
  }, [avgFee, devicePrice, electricity, hashrateTH, poolFee, powerW, stats, usdToman]);

  function applyPreset(index: number) {
    const preset = presetMiners[index];
    if (!preset) return;
    setHashrateTH(preset.hashrateTH);
    setPowerW(preset.powerW);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-3xl border border-silver bg-white p-5 shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-extrabold text-gold">ورودی دستگاه</p>
            <h2 className="mt-1 text-2xl font-extrabold text-graphite">مشخصات ماینر و هزینه برق</h2>
          </div>
          <button onClick={loadStats} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-silver px-4 py-2 text-sm font-extrabold text-graphite disabled:opacity-60">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RotateCw size={16} />}
            بروزرسانی داده
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-extrabold">
            مدل آماده
            <select onChange={(event) => applyPreset(Number(event.target.value))} defaultValue="1" className="min-h-12 rounded-xl border border-silver bg-white px-3 text-graphite outline-none focus:border-gold">
              {presetMiners.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
            </select>
          </label>
          <NumberField label="هش‌ریت" suffix="TH/s" value={hashrateTH} setValue={setHashrateTH} />
          <NumberField label="مصرف برق" suffix="وات" value={powerW} setValue={setPowerW} />
          <NumberField label="قیمت برق" suffix="تومان / kWh" value={electricity} setValue={setElectricity} />
          <NumberField label="نرخ دلار/تومان" suffix="تومان" value={usdToman} setValue={setUsdToman} />
          <NumberField label="کارمزد استخر" suffix="%" value={poolFee} setValue={setPoolFee} step={0.1} />
          <NumberField label="قیمت دستگاه" suffix="تومان" value={devicePrice} setValue={setDevicePrice} />
          <NumberField label="میانگین fee هر بلاک" suffix="BTC" value={avgFee} setValue={setAvgFee} step={0.01} />
        </div>

        <p className="mt-5 rounded-2xl bg-soft p-4 text-sm leading-8 text-steel">
          نرخ دلار/تومان و قیمت برق را خودتان وارد کنید تا عدد تومانی فیک نباشد. داده زنده شبکه و قیمت BTC از API دریافت می‌شود.
        </p>
      </section>

      <section className="rounded-3xl border border-gold/20 bg-gradient-to-br from-navy to-graphite p-5 text-white shadow-panel">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-extrabold text-gold">نتیجه زنده</p>
            <h2 className="mt-1 text-2xl font-extrabold">درآمد تقریبی ماینینگ</h2>
          </div>
          <Calculator className="text-gold" size={28} />
        </div>

        {loading ? (
          <div className="mt-8 flex min-h-72 items-center justify-center rounded-3xl border border-white/10 bg-white/5">
            <p className="inline-flex items-center gap-2 font-extrabold text-silver"><Loader2 className="animate-spin" /> دریافت داده زنده...</p>
          </div>
        ) : error || !result || !stats ? (
          <div className="mt-8 rounded-3xl border border-red-400/30 bg-red-500/10 p-5 text-red-100">
            <h3 className="font-extrabold">محاسبه واقعی فعلاً ممکن نیست</h3>
            <p className="mt-2 leading-8">{error || "داده زنده در دسترس نیست."}</p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Metric icon={<DollarSign size={19} />} label="درآمد روزانه" value={`$${nfUsd.format(result.revenueUsdDay)}`} sub={`${nfFa.format(Math.round(result.revenueTomanDay))} تومان`} />
              <Metric icon={<PlugZap size={19} />} label="هزینه برق روزانه" value={`${nfFa.format(Math.round(result.electricityCostTomanDay))}`} sub={`${nfFa.format(result.electricityKwhDay)} kWh در روز`} />
              <Metric icon={<Zap size={19} />} label="سود خالص روزانه" value={`${nfFa.format(Math.round(result.netTomanDay))}`} sub={`$${nfUsd.format(result.netUsdDay)}`} highlight={result.netTomanDay > 0} />
              <Metric icon={<Cpu size={19} />} label="سود خالص ماهانه" value={`${nfFa.format(Math.round(result.netTomanMonth))}`} sub={`${result.btcPerMonth.toFixed(8)} BTC`} highlight={result.netTomanMonth > 0} />
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.06] p-4">
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <Info label="BTC روزانه" value={result.btcPerDay.toFixed(8)} />
                <Info label="قیمت BTC" value={`$${nfUsd.format(stats.btcUsd)}`} />
                <Info label="سختی شبکه" value={nfFaCompact.format(stats.currentDifficulty)} />
                <Info label="هش‌ریت شبکه" value={`${nfFaCompact.format(stats.networkHashrate / 1e18)} EH/s`} />
                <Info label="ارتفاع بلاک" value={nfFa.format(stats.blockHeight)} />
                <Info label="پاداش بلاک" value={`${stats.blockSubsidy} BTC`} />
              </div>
              <p className="mt-4 text-xs leading-6 text-silver">
                آخرین بروزرسانی: {new Date(stats.fetchedAt).toLocaleString("fa-IR")} | منابع: {stats.sources.join("، ")}
              </p>
            </div>

            <div className="mt-5 rounded-3xl border border-gold/20 bg-gold/10 p-4">
              <h3 className="font-extrabold text-gold">زمان برگشت سرمایه</h3>
              <p className="mt-2 text-2xl font-extrabold">
                {result.breakEvenDays ? `${nfFa.format(Math.ceil(result.breakEvenDays))} روز` : "قابل محاسبه نیست"}
              </p>
              <p className="mt-2 text-sm leading-7 text-silver">اگر قیمت دستگاه وارد نشود یا سود خالص منفی باشد، برگشت سرمایه نمایش داده نمی‌شود.</p>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function NumberField({ label, suffix, value, setValue, step = 1 }: { label: string; suffix: string; value: number; setValue: (value: number) => void; step?: number }) {
  return (
    <label className="grid gap-2 text-sm font-extrabold text-graphite">
      {label}
      <div className="flex min-h-12 overflow-hidden rounded-xl border border-silver bg-white focus-within:border-gold">
        <input type="number" min="0" step={step} value={value} onChange={(event) => setValue(Number(event.target.value || 0))} className="min-w-0 flex-1 px-3 text-left outline-none" dir="ltr" />
        <span className="grid min-w-24 place-items-center border-r border-silver bg-soft px-3 text-xs text-steel">{suffix}</span>
      </div>
    </label>
  );
}

function Metric({ icon, label, value, sub, highlight = false }: { icon: ReactNode; label: string; value: string; sub: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${highlight ? "border-gold/35 bg-gold/10" : "border-white/10 bg-white/[0.06]"}`}>
      <div className="flex items-center gap-2 text-sm font-extrabold text-silver">{icon}{label}</div>
      <p className={`mt-3 text-2xl font-extrabold ${highlight ? "text-gold" : "text-white"}`}>{value}</p>
      <p className="mt-1 text-sm text-silver">{sub}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-black/15 p-3">
      <p className="text-xs text-silver">{label}</p>
      <p className="mt-1 font-extrabold text-white" dir="ltr">{value}</p>
    </div>
  );
}
