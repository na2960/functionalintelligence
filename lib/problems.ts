// The marketplace of top-valued, specifically-named problems we work on.
// Curated (not user-submitted) — edit here to change what the marketplace shows.

export type Domain = "Finance & Energy" | "Materials Design";

export type Problem = {
  id: string;
  domain: Domain;
  title: string;
  value: string; // one-line stakes
  detail: string; // 2–3 sentences: the problem + the physics-AI angle + the deliverable
};

export const PROBLEMS: Problem[] = [
  // ---------------- Finance & Energy ----------------
  {
    id: "weather-power-gas",
    domain: "Finance & Energy",
    title: "Weather risk in power and gas",
    value:
      "Temperature settles CME degree-day contracts and drives most short-term energy demand.",
    detail:
      "The tradable edge is in how forecasts revise as the delivery date approaches — not in the weather itself. We build calibrated revision-path models on ERA5 / WeatherBench-2 data and turn them into positions with an auditable P&L: leak-checked, shuffle-tested, and deflated for the number of variants tried.",
  },
  {
    id: "renewable-imbalance",
    domain: "Finance & Energy",
    title: "Renewable generation and imbalance cost",
    value:
      "A wind or solar fleet pays for every gap between its day-ahead schedule and real-time delivery.",
    detail:
      "A calibrated distribution over fleet output — not a point forecast — sets the newsvendor-optimal bid given the real-time/day-ahead penalty asymmetry. The deliverable is the avoided imbalance cost, attributed to where the uncertainty estimate actually paid.",
  },
  {
    id: "gas-storage",
    domain: "Finance & Energy",
    title: "The weekly gas-storage surprise",
    value:
      "The EIA storage report moves Henry Hub; the money is in beating consensus on the change.",
    detail:
      "We forecast the weekly build or draw and its uncertainty, then trade only the surprise versus consensus. Every claim is stated as a rule, a cost, a capacity, and an out-of-sample confidence interval.",
  },
  {
    id: "scarcity-pricing",
    domain: "Finance & Energy",
    title: "Scarcity pricing and grid tail risk",
    value:
      "Real-time power prices can spike a hundredfold in scarcity — the tail is the whole trade.",
    detail:
      "Physics-aware probabilistic models price the tail of the distribution, not the mean, for hedging and dispatch decisions in markets like ERCOT. The output is a calibrated risk, not a single number.",
  },

  // ---------------- Materials Design ----------------
  {
    id: "crystal-stability",
    domain: "Materials Design",
    title: "Stable-crystal discovery",
    value:
      "Screening 250k+ candidate crystals for thermodynamic stability before spending on DFT.",
    detail:
      "On the Matbench Discovery / WBM benchmark, an uncertainty-aware model ranks candidates by calibrated probability of stability. Ranking by P(stable) rather than by predicted energy finds more real discoveries at a fixed compute budget — a discovery-acceleration factor up to ~6.5×.",
  },
  {
    id: "battery-lifetime",
    domain: "Materials Design",
    title: "Battery lifetime from early cycles",
    value:
      "Predict a cell's cycle life from its first ~100 cycles and stop the doomed ones early.",
    detail:
      "Early-cycle features — like the variance of the voltage–capacity curve — predict end-of-life. A confident lower bound lets a lab halt short-lived cells and reclaim tester-months; the value is the saved test time net of false stops.",
  },
  {
    id: "dft-triage",
    domain: "Materials Design",
    title: "Uncertainty-aware DFT triage",
    value: "Spend a fixed compute budget where it finds the most real materials.",
    detail:
      "The question is not only 'what is the predicted energy' but 'where is the model confident enough to be worth a DFT calculation.' Calibrated uncertainty turns a screening model into a budgeted discovery policy.",
  },
  {
    id: "catalyst-screening",
    domain: "Materials Design",
    title: "Catalyst and reaction screening",
    value: "Adsorption energies decide which catalysts are worth synthesizing.",
    detail:
      "Graph models with autograd forces (Open Catalyst–style) predict the energetics that gate a reaction, with uncertainty that flags where the prediction cannot yet be trusted.",
  },
];

export const DOMAINS: Domain[] = ["Finance & Energy", "Materials Design"];
