export interface MetricTick {
  campaignId: string;
  spend: number;
  revenue: number;
  timestamp: number;
  roas: number; // revenue / spend, computed when the tick is applied
}

export interface Campaign {
  campaignId: string;
  name: string;
}

export interface MetricStreamClient {
  connect: (onTick: (tick: MetricTick) => void) => void;
  disconnect: () => void;
}

export interface TickerStoreState {
  metrics: Record<string, MetricTick>;
  allCampaigns: Campaign[]; // every campaign that exists — full list + name lookups
  activeCampaigns: Campaign[]; // the smaller subset counted toward totalSpend
  watchlist: Set<string>;
  totalSpendToday: number; // pre-aggregated
  watchlistSorted: Campaign[]; // pre-sorted by roas desc
  isConnected: boolean;
  connect: () => void; // idempotent — guarded by isConnected
  disconnect: () => void; // tears down the stream client
  toggleWatchlist: (campaignId: string) => void; // star/unstar
  _applyTick: (tick: MetricTick) => void; // internal — called by the stream callback only
  setCampaigns: (campaigns: Campaign[]) => void; // seeds allCampaigns/activeCampaigns once the initial Query resolves
  addCampaign: (campaign: Campaign) => void; // appends a newly created campaign so the stream can start ticking for it
  removeCampaignId: (campaignId: string) => void; // rollback path for a failed optimistic create
}
