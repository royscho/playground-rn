import { MetricStreamClient, MetricTick } from '../types';
import { ALL_CAMPAIGNS } from '../constants';

const generateFakeTick = (): MetricTick => {
  const campaignId =
    ALL_CAMPAIGNS[Math.floor(Math.random() * ALL_CAMPAIGNS.length)]
      .campaignId;
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

export const createMockMetricStreamClient = (): MetricStreamClient => {
  let intervalId: ReturnType<typeof setInterval> | null = null;

  return {
    connect(onTick: (tick: MetricTick) => void) {
      intervalId = setInterval(() => onTick(generateFakeTick()), 300);
    },
    disconnect() {
      if (intervalId) clearInterval(intervalId);
      intervalId = null;
    },
  };
};
