export interface SummaryMetric {
  id: string;
  label: string;
  value: number;
  deltaPercent: number; // e.g. 34.2 or -8.1 — sign carries direction
  sparkline: number[]; // historical points for the trend line
  time: Date;
}
