import ReactGA from "react-ga";

export function initalizeAnalytics() {
  ReactGA.initialize(import.meta.env.VITE_GA_ID);
}

export function trackPageView(page: string) {
  ReactGA.pageview(page);
}
