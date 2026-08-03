import { MetricStreamClient, MetricTick } from '../types';
import { ALL_CAMPAIGNS } from '../constants';

const generateFakeTick = (campaignIds: string[]): MetricTick | null => {
  if (campaignIds.length === 0) return null; // nothing to tick for yet
  const campaignId =
    campaignIds[Math.floor(Math.random() * campaignIds.length)];
  const spend = Math.round(Math.random() * 500 + 50);
  const revenue = Math.round(Math.random() * 2000 + 100);
  return {
    campaignId,
    spend,
    revenue,
    roas: revenue / spend,
    timestamp: Date.now(),
  };
};

// getCampaignIds is called on EVERY tick, not just once at connect time —
// this is what lets a campaign created after the stream is already running
// start appearing in ticks immediately, without needing to reconnect.
// Defaults to the static demo list so the MobX/RTK reference versions (which
// don't wire in TanStack Query) keep working unchanged.
export const createMockMetricStreamClient = (
  getCampaignIds: () => string[] = () => ALL_CAMPAIGNS.map(c => c.campaignId),
): MetricStreamClient => {
  let intervalId: ReturnType<typeof setInterval> | null = null;

  return {
    connect(onTick: (tick: MetricTick) => void) {
      intervalId = setInterval(() => {
        const tick = generateFakeTick(getCampaignIds());
        if (tick) onTick(tick);
      }, 300);
    },
    disconnect() {
      if (intervalId) clearInterval(intervalId);
      intervalId = null;
    },
  };
};
