module.exports = {
  apps: [{
    name: "ebazer-backend",
    script: "./backend/server.js",
    instances: "max", // Uses all CPU cores
    exec_mode: "cluster", // Enables Load Balancing
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
