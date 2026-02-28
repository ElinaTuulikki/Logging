// test/logger.test.js
// Automated tests for the Winston logger configuration (Task 1).

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Paths to log files
const COMBINED_LOG = path.join(__dirname, '../logs/combined.log');
const ERROR_LOG = path.join(__dirname, '../logs/error.log');

// Helper: read last N lines from a log file and parse as JSON
function readLastLogEntries(filepath, count = 5) {
  const content = fs.readFileSync(filepath, 'utf8').trim();
  const lines = content.split('\n').filter(Boolean);
  return lines.slice(-count).map(line => JSON.parse(line));
}

// Helper: clear log files before each test so logs don't bleed between tests
function clearLogs() {
  fs.writeFileSync(COMBINED_LOG, '');
  fs.writeFileSync(ERROR_LOG, '');
}

// Helper: wait briefly for Winston to flush to disk
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Logger Configuration', () => {
  let logger;

  before(() => {
    // Ensure logs directory exists
    const logsDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

    // Ensure log files exist
    if (!fs.existsSync(COMBINED_LOG)) fs.writeFileSync(COMBINED_LOG, '');
    if (!fs.existsSync(ERROR_LOG)) fs.writeFileSync(ERROR_LOG, '');

    logger = require('../src/logger');
  });

  beforeEach(() => {
    clearLogs();
  });
 
  // Test the logger instance and its configuration
  describe('Logger instance', () => {
    it('should export a logger object', () => {
      assert.ok(logger, 'logger should be defined');
      assert.strictEqual(typeof logger, 'object');
    });

    // Check that the logger has the expected methods and properties
    it('should have info, warn and error methods', () => {
      assert.strictEqual(typeof logger.info, 'function');
      assert.strictEqual(typeof logger.warn, 'function');
      assert.strictEqual(typeof logger.error, 'function');
    });

    // Check that the logger has the expected default configuration
    it('should have default level set to info', () => {
      assert.strictEqual(logger.level, 'info');
    });

    // Check that the logger has the expected transports configured
    it('should have 3 transports configured (console, error file, combined file)', () => {
      assert.strictEqual(logger.transports.length, 3);
    });
  });

  // Test that log messages are written to the correct files with the correct format
  describe('combined.log', () => {
    it('should write info messages to combined.log', async () => {
      logger.info('test info message');
      await wait(100);
      const entries = readLastLogEntries(COMBINED_LOG, 1);
      assert.strictEqual(entries[0].level, 'info');
      assert.strictEqual(entries[0].message, 'test info message');
    });

    // Check that warn messages are logged to combined.log
    it('should write warn messages to combined.log', async () => {
      logger.warn('test warn message');
      await wait(100);
      const entries = readLastLogEntries(COMBINED_LOG, 1);
      assert.strictEqual(entries[0].level, 'warn');
      assert.strictEqual(entries[0].message, 'test warn message');
    });

    // Check that error messages are logged to combined.log
    it('should write error messages to combined.log', async () => {
      logger.error('test error message');
      await wait(100);
      const entries = readLastLogEntries(COMBINED_LOG, 1);
      assert.strictEqual(entries[0].level, 'error');
      assert.strictEqual(entries[0].message, 'test error message');
    });

    // Check that the log entry includes a timestamp and that it is in a valid format
    it('should include a timestamp in each log entry', async () => {
      logger.info('timestamp test');
      await wait(100);
      const entries = readLastLogEntries(COMBINED_LOG, 1);
      assert.ok(entries[0].timestamp, 'timestamp field should exist');
      assert.ok(!isNaN(Date.parse(entries[0].timestamp)), 'timestamp should be a valid date');
    });

    // Check that the log entry is in JSON format and can be parsed without errors
    it('should write log entries as valid JSON', async () => {
      logger.info('json format test');
      await wait(100);
      const raw = fs.readFileSync(COMBINED_LOG, 'utf8').trim();
      assert.doesNotThrow(() => JSON.parse(raw), 'log entry should be valid JSON');
    });
  });

  // Test that error messages are written to error.log and that other levels are not
  describe('error.log', () => {
    it('should write error messages to error.log', async () => {
      logger.error('test error to file');
      await wait(100);
      const entries = readLastLogEntries(ERROR_LOG, 1);
      assert.strictEqual(entries[0].level, 'error');
      assert.strictEqual(entries[0].message, 'test error to file');
    });

    // Check that info and warn messages are NOT logged to error.log
    it('should NOT write info messages to error.log', async () => {
      logger.info('this should not appear in error log');
      await wait(100);
      const content = fs.readFileSync(ERROR_LOG, 'utf8').trim();
      assert.strictEqual(content, '', 'error.log should be empty after an info log');
    });

    // Check that warn messages are NOT logged to error.log
    it('should NOT write warn messages to error.log', async () => {
      logger.warn('this warn should not appear in error log');
      await wait(100);
      const content = fs.readFileSync(ERROR_LOG, 'utf8').trim();
      assert.strictEqual(content, '', 'error.log should be empty after a warn log');
    });
  });

  // Test that the log message content is correct and consistent with the expected format
  describe('Log message content', () => {
    it('should log [MAIN] Starting format correctly', async () => {
      logger.info('[MAIN] Starting');
      await wait(100);
      const entries = readLastLogEntries(COMBINED_LOG, 1);
      assert.strictEqual(entries[0].message, '[MAIN] Starting');
    });

    // Check that the log message content is correct for a different message
    it('should log [MAIN] Stopping format correctly', async () => {
      logger.info('[MAIN] Stopping');
      await wait(100);
      const entries = readLastLogEntries(COMBINED_LOG, 1);
      assert.strictEqual(entries[0].message, '[MAIN] Stopping');
    });

    // Check that multiple log messages are logged in the correct order
    it('should log multiple messages in order', async () => {
      logger.info('first message');
      logger.warn('second message');
      logger.error('third message');
      await wait(100);
      const entries = readLastLogEntries(COMBINED_LOG, 3);
      assert.strictEqual(entries[0].message, 'first message');
      assert.strictEqual(entries[1].message, 'second message');
      assert.strictEqual(entries[2].message, 'third message');
    });
  });
});