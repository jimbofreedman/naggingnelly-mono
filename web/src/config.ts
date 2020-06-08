const config = {
    apiUrl: process.env.REACT_APP_API_HOST,
    sentryDSN: process.env.REACT_APP_SENTRY_DSN,
    google: {
        webClientId: process.env.REACT_APP_GOOGLE_WEB_CLIENT_ID || "",
    }
};

console.log("Config", config);

export default config;
