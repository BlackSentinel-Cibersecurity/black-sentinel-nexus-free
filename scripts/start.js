#!/usr/bin/env node

/**
 * BlackSentinel Nexus FREE - Cross-Platform Start Script
 * Works on Linux, macOS, and Windows
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

const ROOT = path.resolve(__dirname, '..');
const API_PORT = 3001;
const WEB_PORT = 3000;

function log(msg) {
  console.log(msg);
}

function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(true));
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    server.listen(port);
  });
}

function killPort(port) {
  try {
    if (process.platform === 'win32') {
      // Windows: use netstat + taskkill
      try {
        const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8', stdio: 'pipe' });
        const lines = output.split('\n').filter(l => l.includes('LISTENING'));
        for (const line of lines) {
          const pid = line.trim().split(/\s+/).pop();
          if (pid && !isNaN(pid)) {
            execSync(`taskkill /F /PID ${pid}`, { stdio: 'pipe' });
          }
        }
      } catch { /* port not in use */ }
    } else {
      // Linux/macOS: use lsof or fuser
      try {
        execSync(`kill $(lsof -ti:${port}) 2>/dev/null || true`, { stdio: 'pipe' });
      } catch {
        try {
          execSync(`fuser -k ${port}/tcp 2>/dev/null || true`, { stdio: 'pipe' });
        } catch { /* port not in use */ }
      }
    }
  } catch { /* ignore */ }
}

function copyEnvIfMissing() {
  const envPath = path.join(ROOT, 'apps', 'api', '.env');
  const envExamplePath = path.join(ROOT, '.env.example');

  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    log('Creating .env from .env.example...');
    fs.copyFileSync(envExamplePath, envPath);
  }
}

async function main() {
  log('==========================================');
  log('BlackSentinel Nexus FREE - Starting');
  log('==========================================\n');
  log('FREE VERSION LIMITS:');
  log('  - Max 3 users');
  log('  - 10 connector templates');
  log('  - 2 correlation rules');
  log('  - EN/ES languages only');
  log('  - No PDF export\n');

  copyEnvIfMissing();

  // Kill existing processes
  log('Stopping existing processes...');
  killPort(API_PORT);
  killPort(WEB_PORT);
  await new Promise(r => setTimeout(r, 1000));

  // Start API
  log('Starting API on port 3001...');
  const apiProcess = spawn('pnpm', ['--filter', '@bsn/api', 'dev'], {
    cwd: ROOT,
    stdio: 'inherit',
    shell: true,
    detached: false,
  });

  await new Promise(r => setTimeout(r, 3000));

  // Start Web
  log('Starting Web on port 3000...');
  const webProcess = spawn('pnpm', ['--filter', '@bsn/web', 'dev'], {
    cwd: ROOT,
    stdio: 'inherit',
    shell: true,
    detached: false,
  });

  log('');
  log('==========================================');
  log('BlackSentinel Nexus FREE is running!');
  log('==========================================\n');
  log('  Web:    http://localhost:3000');
  log('  API:    http://localhost:3001');
  log('  Docs:   http://localhost:3001/docs');
  log('  Health: http://localhost:3001/api/v1/health\n');
  log('  Login:  admin@blacksentinel.io / Admin@123\n');
  log('  Press Ctrl+C to stop\n');

  // Handle shutdown
  const shutdown = () => {
    log('\nShutting down...');
    killPort(API_PORT);
    killPort(WEB_PORT);
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  apiProcess.on('error', (err) => {
    console.error('API process error:', err.message);
  });

  webProcess.on('error', (err) => {
    console.error('Web process error:', err.message);
  });

  apiProcess.on('exit', () => {
    log('API process exited');
  });

  webProcess.on('exit', () => {
    log('Web process exited');
  });
}

main().catch(console.error);
