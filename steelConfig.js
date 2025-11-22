// steelConfig.js
export const steelConfig = {
  stealth: {
    mode: "max",
    fingerprint: "stable",
    proxy: {
      type: "residential",
      region: "us"
    },
    viewport: {
      width: 1280,
      height: 800
    },
    timezone: "America/New_York",
    language: "en-US",
    userAgent: "random-realistic"
  },
  persistence: "sticky",
  geolocation: "us",
  headless: false,
  session_name: "client_fub_primary"
};
