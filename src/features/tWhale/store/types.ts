import { Campaign, MetricTick } from '../types';

export interface ImmerTickerState {
  metrics: Record<string, MetricTick>;
  allCampaigns: Campaign[];
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  _applyTick: (tick: MetricTick) => void;
  setCampaigns: (campaigns: Campaign[]) => void;
  addCampaign: (campaign: Campaign) => void;
  removeCampaignId: (campaignId: string) => void;
}
