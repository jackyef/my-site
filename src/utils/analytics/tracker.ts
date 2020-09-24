import { baseAnalytics } from './base.lazy';

// Guide on how to send trackers
// https://developers.google.com/analytics/devguides/collection/upgrade/analyticsjs

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
  baseAnalytics().then(({ gaAll }) => {
    gaAll('send', 'event', category, name, label);
  });
};
