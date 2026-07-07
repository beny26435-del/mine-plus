import { NextResponse } from "next/server";
import { getBitcoinBlockSubsidy } from "@/lib/mining";

export const dynamic = "force-dynamic";

type CoinGeckoResponse = {
  bitcoin?: { usd?: number };
};

type MempoolHashrateResponse = {
  currentDifficulty?: number;
  currentHashrate?: number;
};

type TgjuDollarResponse = {
  data?: Array<Array<string>>;
};

function parseMarketNumber(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") return 0;
  return Number(String(value).replace(/[^\d.]/g, ""));
}

async function fetchJson<T>(url: string) {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    next: { revalidate: 300 }
  });
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  return (await response.json()) as T;
}

async function fetchText(url: string) {
  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  return response.text();
}

async function fetchUsdToman() {
  try {
    const tgju = await fetchJson<TgjuDollarResponse>("https://api.tgju.org/v1/market/indicator/today-table-data/price_dollar_rl?lang=fa");
    const rial = parseMarketNumber(tgju.data?.[0]?.[0]);
    const toman = Math.round(rial / 10);
    return toman > 1000 ? toman : null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const [price, hashrate, heightText, usdToman] = await Promise.all([
      fetchJson<CoinGeckoResponse>("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"),
      fetchJson<MempoolHashrateResponse>("https://mempool.space/api/v1/mining/hashrate/3d"),
      fetchText("https://mempool.space/api/blocks/tip/height"),
      fetchUsdToman()
    ]);

    const btcUsd = Number(price.bitcoin?.usd || 0);
    const currentDifficulty = Number(hashrate.currentDifficulty || 0);
    const networkHashrate = Number(hashrate.currentHashrate || 0);
    const blockHeight = Number(heightText);

    if (!btcUsd || !currentDifficulty || !networkHashrate || !blockHeight) {
      return NextResponse.json({ success: false, message: "داده زنده کامل دریافت نشد." }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      stats: {
        btcUsd,
        usdToman,
        blockHeight,
        blockSubsidy: getBitcoinBlockSubsidy(blockHeight),
        currentDifficulty,
        networkHashrate,
        fetchedAt: new Date().toISOString(),
        sources: ["CoinGecko BTC/USD", "mempool.space network hashrate and block height", "TGJU USD/IRR when available"]
      }
    });
  } catch {
    return NextResponse.json({ success: false, message: "داده زنده ماشین‌حساب فعلاً در دسترس نیست." }, { status: 502 });
  }
}
