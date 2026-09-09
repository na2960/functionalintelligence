// The marketplace of top-valued, specifically-named problems we work on.
// Curated (not user-submitted) — edit here to change what the marketplace shows.
// Each is a real, named problem with a concrete data source and an immediate
// source of value.

export type Domain = "Finance & Energy" | "Materials Design";

export type Problem = {
  id: string;
  domain: Domain;
  title: string;
  value: string; // one-line, concrete stakes
  detail: string; // one tight sentence: the anchor + the immediate value
};

export const PROBLEMS: Problem[] = [
  // ---------------- Finance & Energy ----------------
  {
    id: "renewable-imbalance",
    domain: "Finance & Energy",
    title: "Renewable imbalance in ERCOT",
    value:
      "A wind or solar fleet is settled on the gap between its day-ahead schedule and real-time delivery.",
    detail:
      "A calibrated distribution over fleet output — from EIA-930 and ERCOT prices — sets the cost-optimal bid; the deliverable is the avoided imbalance cost.",
  },
  {
    id: "scarcity-tail",
    domain: "Finance & Energy",
    title: "Scarcity-price tail risk",
    value:
      "ERCOT real-time prices jump from ~$30 to the $5,000/MWh cap in scarcity — a 100×-plus move.",
    detail:
      "We price the probability of the tail, not the mean, for hedging, dispatch, and battery bidding decisions.",
  },
  {
    id: "weather-power-gas",
    domain: "Finance & Energy",
    title: "Weather risk in power and gas",
    value:
      "Temperature drives most short-term energy demand and settles CME degree-day contracts.",
    detail:
      "The edge is in how forecasts revise toward delivery, not the weather itself — built on ERA5 / WeatherBench-2 with a leak-checked, out-of-sample P&L.",
  },
  {
    id: "gas-storage",
    domain: "Finance & Energy",
    title: "The weekly gas-storage print",
    value: "The EIA storage report moves Henry Hub the moment it lands.",
    detail:
      "We forecast the weekly build or draw and its uncertainty, then trade only the surprise versus consensus.",
  },

  // ---------------- Materials Design ----------------
  {
    id: "crystal-stability",
    domain: "Materials Design",
    title: "Stable-crystal discovery",
    value:
      "Rank 250k+ candidate crystals by calibrated probability of stability before spending on DFT.",
    detail:
      "On the Matbench Discovery / WBM benchmark this finds up to ~6× more stable materials per DFT calculation than random selection.",
  },
  {
    id: "battery-lifetime",
    domain: "Materials Design",
    title: "Battery lifetime from early cycles",
    value: "Predict a cell's cycle life from its first ~100 cycles.",
    detail:
      "Early-cycle features flag the doomed cells so a lab can stop them early and reclaim tester-months — value net of false stops.",
  },
  {
    id: "dft-triage",
    domain: "Materials Design",
    title: "Uncertainty-aware DFT triage",
    value: "Spend a fixed compute budget where it finds the most real materials.",
    detail:
      "Calibrated uncertainty — not just a predicted energy — turns a screening model into a budgeted discovery policy.",
  },
  {
    id: "catalyst-screening",
    domain: "Materials Design",
    title: "Catalyst and reaction screening",
    value: "Adsorption energies decide which catalysts are worth synthesizing.",
    detail:
      "Graph models with forces (Open Catalyst–style) predict the energetics that gate a reaction, flagging where the prediction can't yet be trusted.",
  },
];

export const DOMAINS: Domain[] = ["Finance & Energy", "Materials Design"];
