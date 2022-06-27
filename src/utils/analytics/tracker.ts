// Guide on how to send trackers
// https://developers.google.com/analytics/devguides/collection/upgrade/analyticsjs
// https://developers.google.com/analytics/devguides/migration/ua/analyticsjs-to-gtagjs#send_custom_dimensions_and_metrics

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
  if (!window.gtag) return;

  window.gtag('event', name, {
    label,
    category,
  });
};
