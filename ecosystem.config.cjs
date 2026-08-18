module.exports = {
  apps: [
    {
      name: 'supporthub-api',
      script: './artifacts/api-server/dist/index.mjs',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
