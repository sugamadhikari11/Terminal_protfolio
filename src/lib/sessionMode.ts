const MODE_KEY = "sa-portfolio-mode";
const GUI_VISITED_KEY = "sa-portfolio-gui-visited";
const GUI_GUIDE_KEY = "sa-portfolio-gui-guide-dismissed";

export type PortfolioMode = "terminal" | "gui";

export function readSessionMode(): PortfolioMode {
  if (typeof window === "undefined") return "terminal";
  try {
    const v = sessionStorage.getItem(MODE_KEY);
    return v === "gui" ? "gui" : "terminal";
  } catch {
    return "terminal";
  }
}

export function writeSessionMode(mode: PortfolioMode) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(MODE_KEY, mode);
  } catch {
    // private mode / quota
  }
}

export function readGuiVisited(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(GUI_VISITED_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeGuiVisited(visited: boolean) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(GUI_VISITED_KEY, visited ? "1" : "0");
  } catch {
    // ignore
  }
}

export function readGuiGuideDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(GUI_GUIDE_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeGuiGuideDismissed() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(GUI_GUIDE_KEY, "1");
  } catch {
    // ignore
  }
}
