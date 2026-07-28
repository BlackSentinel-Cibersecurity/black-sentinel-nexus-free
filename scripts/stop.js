#!/usr/bin/env node

/**
 * BlackSentinel Nexus FREE - Cross-Platform Stop Script
 * Works on Linux, macOS, and Windows
 */

const { execSync } = require('child_process');

const API_PORT = 3001;
const WEB_PORT = 3000;

function killPort(port, name) {
  try {
    if (process.platform === 'win32') {
      try {
        const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8', stdio: 'pipe' });
        const lines = output.split('\n').filter(l => l.includes('LISTENING'));
        let found = false;
        for (const line of lines) {
          const pid = line.trim().split(/\s+/).pop();
          if (pid && !isNaN(pid)) {
            execSync(`taskkill /F /PID ${pid}`, { stdio: 'pipe' });
            found = true;
          }
        }
        if (found) console.log(`  ${name} stopped (port ${port})`);
        else console.log(`  ${name} not running`);
      } catch {
        console.log(`  ${name} not running`);
      }
    } else {
      try {
        execSync(`kill $(lsof -ti:${port}) 2>/dev/null`, { stdio: 'pipe' });
        console.log(`  ${name} stopped (port ${port})`);
      } catch {
        console.log(`  ${name} not running`);
      }
    }
  } catch {
    console.log(`  ${name} not running`);
  }
}

console.log('Stopping BlackSentinel Nexus FREE...\n');

killPort(API_PORT, 'API');
killPort(WEB_PORT, 'Web');

console.log('\nBlackSentinel Nexus FREE stopped.');
