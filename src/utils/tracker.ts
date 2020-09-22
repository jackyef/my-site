// Guide on how to send trackers
// https://developers.google.com/analytics/devguides/collection/upgrade/analyticsjs

declare global {
  interface Window { gtag?: (type: string, name: string, params?: any) => void; }
}

interface EventParams {
  name: string;
  label: string;
  category: string;
}

// example of an event would be
// name: "play" // think of it as action
// category: "video"
// label: "funny cats vids"

export const sendEventTracker = ({ name, label, category }: EventParams) => {
  if (window.gtag) {
    window.gtag('event', name, { event_label: label, event_category: category });
  }
};

interface TimingParams {
  name: string;
  value: number;
  label: string;
  category: string;
}

// example of timing would be
// name: "load"
// value: 2000 // milliseconds
// category: "LCP" | "JS Dependencies"
// label: "Google CDN" // optional

export const sendTimingTracker = ({
  name,
  value,
  label,
  category,
}: TimingParams) => {
  if (window.gtag) {
    window.gtag('event', 'timing_complete', {
      name,
      value,
      event_label: label,
      event_category: category,
    });
  }
};

interface PageViewParams {
  url: string;
}

export const sendPageView = ({ url }: PageViewParams) => {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_title: document.title,
      page_location: location.href,
    });
  }
};
