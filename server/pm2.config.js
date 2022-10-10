module.exports = {
  apps: [
    {
      name: "Project",
      script: "npm",
      args: "start",
      env_production: {
        PORT: 3000,
        NODE_ENV: "production",
      },
    },
  ],
};
