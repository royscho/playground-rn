import { makeAutoObservable, observable } from 'mobx';
import { MetricStreamClient, MetricTick, Campaign } from '../types';
import { createMockMetricStreamClient } from '../api/tickerStream';
import { ALL_CAMPAIGNS } from '../constants';

// MobX's whole pitch vs Zustand/RTK: you never manually decide "did this
// tick affect totalSpendToday, should I recompute watchlistSorted" — that
// relevance-check logic (the `affectsSpend`/`affectsWatchlist` checks in the
// Zustand version) disappears entirely. `computed` getters below track
// exactly which observables they read, and only re-evaluate when one of
// THOSE specific observables actually changed — the same selective-recompute
// property we hand-wrote in Zustand's `_applyTick`, but automatic here.
class TickerStore {
  metrics = observable.map<string, MetricTick>();
  allCampaigns: Campaign[] = ALL_CAMPAIGNS;
  activeCampaigns: Campaign[] = ALL_CAMPAIGNS.slice(0, 2);
  watchlist = observable.set<string>();
  isConnected = false;

  private streamClient: MetricStreamClient | null = null;

  constructor() {
    // observable.map/observable.set above are already deeply observable;
    // makeAutoObservable wires up the rest (fields → observable, methods →
    // action, get accessors → computed) without listing each one by hand.
    makeAutoObservable(this, {
      metrics: false, // already made observable via observable.map() above
      watchlist: false, // already made observable via observable.set() above
    });
  }

  // computed — MobX memoizes this automatically: reading `totalSpendToday`
  // twice in a row without an interleaving change to `activeCampaigns` or
  // any of the specific `metrics` entries it touched returns the cached
  // value, no recomputation. No `affectsSpend` check needed anywhere.
  get totalSpendToday(): number {
    return this.activeCampaigns.reduce(
      (sum, c) => sum + (this.metrics.get(c.campaignId)?.spend ?? 0),
      0,
    );
  }

  get watchlistSorted(): Campaign[] {
    return Array.from(this.watchlist)
      .filter((id) => this.metrics.has(id))
      .sort(
        (a, b) => this.metrics.get(b)!.roas - this.metrics.get(a)!.roas,
      )
      .map((id) => this.allCampaigns.find((c) => c.campaignId === id))
      .filter((c): c is Campaign => c !== undefined);
  }

  connect = () => {
    if (this.isConnected) return; // same idempotency guard as the Zustand version
    this.streamClient = createMockMetricStreamClient();
    this.streamClient.connect((tick) => this.applyTick(tick));
    this.isConnected = true;
  };

  disconnect = () => {
    this.streamClient?.disconnect();
    this.streamClient = null;
    this.isConnected = false;
  };

  toggleWatchlist = (campaignId: string) => {
    if (this.watchlist.has(campaignId)) {
      this.watchlist.delete(campaignId);
    } else {
      this.watchlist.add(campaignId);
    }
    // No manual "recompute watchlistSorted" call — it's a computed getter,
    // it just re-evaluates next time something reads it.
  };

  applyTick = (tick: MetricTick) => {
    this.metrics.set(tick.campaignId, tick);
    // That's it. No `{...s.metrics, [id]: tick}` reference-preservation
    // dance, no `affectsSpend`/`affectsWatchlist` relevance checks. MobX's
    // observable.map tracks reads at the KEY level — a component that only
    // read `metrics.get('fb-summer-sale')` re-renders only when THAT key's
    // value changes, not on every .set() call to the map, same isolation
    // property Zustand needed the normalized-record trick for.
  };
}

export const tickerStore = new TickerStore();
