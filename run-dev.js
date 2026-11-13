// run-dev.js – utility script to start backend and Vite concurrently without external package
// This file is optional; you can also use the npm "dev" script.
const { spawn } = require('child_process');

// Start backend (tsx server.ts) on fallback port 4000
const backend = spawn('npm', ['run', 'backend'], { stdio: 'inherit', shell: true });

// Start Vite dev server
const vite = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });

// Forward signals so both processes exit together
function shutdown() {
  backend.kill('SIGTERM');
  vite.kill('SIGTERM');
  process.exit();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

