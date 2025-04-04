// config-overrides.js
module.exports = function override(config, env) {
    // Modify the devServer configuration
    if (config.devServer) {
        config.devServer.allowedHosts = [
            'all', // Allow requests from localhost
            // Add any other hosts you want to allow
        ];
    }
    return config;
};