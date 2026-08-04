export type EasterEgg = {
  id: string;
  label: string;
  detail: string;
  /** Near the right-side flight corridor */
  position: [number, number, number];
  href?: string;
};

export const easterEggs: EasterEgg[] = [
  {
    id: "kathmandu",
    label: "Kathmandu node",
    detail: "Built between late-night commits and momos in Kathmandu, Nepal.",
    position: [3.2, 2.0, 1.0],
  },
  {
    id: "web3",
    label: "On-chain whisper",
    detail: "NovaChain, lottery DApps, NFT auctions — contracts before coffee.",
    position: [4.0, 1.2, -1.5],
  },
  {
    id: "panda",
    label: "Terminal panda",
    detail: "The braille panda was the first thing that loaded. Old habits.",
    position: [2.4, 0.6, 2.2],
  },
  {
    id: "resume",
    label: "Paper plane",
    detail: "Prefer PDF? Grab the resume anytime.",
    position: [3.6, 1.6, -0.2],
    href: "/resume.pdf",
  },
  {
    id: "bcu",
    label: "Data science badge",
    detail: "BSc (Hons) Data Science — Birmingham City University pathway.",
    position: [2.8, 0.9, -2.4],
  },
  {
    id: "secret",
    label: "Hidden runway",
    detail: "You found a cloud pocket. Type 'help' back in the terminal sometime.",
    position: [4.4, 2.2, 0.5],
  },
];
