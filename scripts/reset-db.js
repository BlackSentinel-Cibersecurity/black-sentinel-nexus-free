#!/usr/bin/env node

/**
 * BlackSentinel Nexus FREE - Cross-Platform Reset DB Script
 * Works on Linux, macOS, and Windows
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DB_PATH = path.join(ROOT, 'apps', 'api', 'black_sentinel.db');
const UPLOADS_PATH = path.join(ROOT, 'apps', 'api', 'uploads');

console.log('Resetting BlackSentinel Nexus FREE database...\n');

// Stop services first
console.log('Stopping services...');
try {
  require('./stop.js');
} catch { /* ignore */ }

// Remove database
console.log('\nRemoving database file...');
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
  console.log('  Database deleted');
} else {
  console.log('  Database not found (already clean)');
}

// Remove uploads
console.log('Removing uploads...');
if (fs.existsSync(UPLOADS_PATH)) {
  fs.rmSync(UPLOADS_PATH, { recursive: true, force: true });
  console.log('  Uploads deleted');
} else {
  console.log('  Uploads not found (already clean)');
}

console.log('\nDatabase reset complete.');
console.log('Start the application with: pnpm start');
