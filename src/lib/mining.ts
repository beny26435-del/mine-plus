export type MiningStats = {
  btcUsd: number;
  blockHeight: number;
  blockSubsidy: number;
  currentDifficulty: number;
  networkHashrate: number;
  fetchedAt: string;
  sources: string[];
};

export function getBitcoinBlockSubsidy(height: number) {
  const halvings = Math.floor(height / 210000);
  if (halvings >= 33) return 0;
  return 50 / 2 ** halvings;
}

export function calculateMiningProfit(input: {
  hashrateTH: number;
  powerW: number;
  electricityTomanPerKwh: number;
  usdToman: number;
  poolFeePercent: number;
  devicePriceToman: number;
  stats: MiningStats;
}) {
  const blocksPerDay = 144;
  const hashrate = input.hashrateTH * 1e12;
  const poolMultiplier = Math.max(0, 1 - input.poolFeePercent / 100);
  const btcPerDayBeforePool = (hashrate / input.stats.networkHashrate) * blocksPerDay * input.stats.blockSubsidy;
  const btcPerDay = btcPerDayBeforePool * poolMultiplier;
  const revenueUsdDay = btcPerDay * input.stats.btcUsd;
  const revenueTomanDay = revenueUsdDay * input.usdToman;
  const electricityKwhDay = (input.powerW / 1000) * 24;
  const electricityCostTomanDay = electricityKwhDay * input.electricityTomanPerKwh;
  const netTomanDay = revenueTomanDay - electricityCostTomanDay;
  const netUsdDay = input.usdToman > 0 ? netTomanDay / input.usdToman : 0;
  const breakEvenDays = netTomanDay > 0 && input.devicePriceToman > 0 ? input.devicePriceToman / netTomanDay : null;

  return {
    btcPerDay,
    btcPerMonth: btcPerDay * 30,
    revenueUsdDay,
    revenueTomanDay,
    electricityKwhDay,
    electricityCostTomanDay,
    netTomanDay,
    netTomanMonth: netTomanDay * 30,
    netUsdDay,
    breakEvenDays
  };
}
