module.exports = {
    apps: [
      {
        name: "app",
        script: "./index.js",
        exec_mode: "cluster",  // Enables clustering mode
        instances: 2,  // Runs 2 instances of the app for load balancing
        watch: true,  // Watches for changes and restarts automatically
        env: {
          NODE_ENV: "development",
          PORT: 5050  // Setting the port to 5050 in development mode
        },
        env_production: {
          NODE_ENV: "production",
          PORT: 5050  // Setting the port to 5050 in production mode
        }
      }
    ]
};
