const config = {
    apiUrl: process.env.REACT_APP_API_HOST,
    sentryDSN: process.env.REACT_APP_SENTRY_DSN,
};

console.log("Config", config);

export default config;
