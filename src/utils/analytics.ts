import ReactGA from "react-ga4";

export function initalizeAnalytics() {
  ReactGA.initialize(import.meta.env.VITE_GA_ID);
}

export function trackPageView(page: string) {
  ReactGA.send({ hitType: "pageview", page });
}
