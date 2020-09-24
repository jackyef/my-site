interface AnalyticsModule {
  init: () => void;
  gaAll: Function;
}

let analyticsModule: AnalyticsModule;

export const baseAnalytics = async () => {
  if (!analyticsModule) {
    analyticsModule = await import('./base.js');
  }

  return analyticsModule;
};
