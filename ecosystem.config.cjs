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
        PORT: 5005,
      },
    },
    {
      name: 'supporthub-dashboard',
      script: './node_modules/vite/bin/vite.js',
      args: 'preview --port 3000 --host 0.0.0.0',
      cwd: './artifacts/dashboard',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
