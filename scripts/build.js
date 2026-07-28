#!/usr/bin/env node

/**
 * BlackSentinel Nexus FREE - Cross-Platform Build Script
 * Works on Linux, macOS, and Windows
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function run(cmd, options = {}) {
  console.log(`> ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit', cwd: ROOT, ...options });
  } catch (e) {
    console.error(`\nFailed: ${cmd}`);
    process.exit(1);
  }
}

function checkPrereqs() {
  // Check Node.js
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log(`Node.js: ${nodeVersion}`);
    const major = parseInt(nodeVersion.replace('v', '').split('.')[0], 10);
    if (major < 18) {
      console.error('Error: Node.js >= 18 is required');
      process.exit(1);
    }
  } catch {
    console.error('Error: Node.js is not installed');
    console.error('Install from: https://nodejs.org/');
    process.exit(1);
  }

  // Check pnpm
  try {
    const pnpmVersion = execSync('pnpm --version', { encoding: 'utf8' }).trim();
    console.log(`pnpm:    v${pnpmVersion}`);
  } catch {
    console.error('Error: pnpm is not installed');
    console.error('Install: npm install -g pnpm');
    process.exit(1);
  }
}

function main() {
  console.log('==========================================');
  console.log('BlackSentinel Nexus FREE - Build');
  console.log('==========================================\n');

  checkPrereqs();

  console.log('\nInstalling dependencies...');
  run('pnpm install --frozen-lockfile');

  console.log('\nBuilding @bsn/types...');
  run('pnpm --filter @bsn/types build');

  console.log('\nBuilding @bsn/ui...');
  run('pnpm --filter @bsn/ui build');

  console.log('\nBuilding @bsn/api...');
  run('pnpm --filter @bsn/api build');

  console.log('\nBuilding @bsn/web...');
  run('pnpm --filter @bsn/web build');

  console.log('\n==========================================');
  console.log('Build complete!');
  console.log('==========================================\n');
  console.log('To start:');
  console.log('  pnpm start        (production)');
  console.log('  pnpm dev          (development)');
  console.log('  docker-compose up (Docker)\n');
  console.log('FREE VERSION LIMITS:');
  console.log('  - Max 3 users');
  console.log('  - 10 connector templates');
  console.log('  - 2 correlation rules');
  console.log('  - EN/ES languages only');
  console.log('  - No PDF export\n');
}

main();
