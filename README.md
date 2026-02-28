# Task 1 — Implement Logging Library

A Node.js application demonstrating structured logging using the [Winston](https://github.com/winstonjs/winston) library. The logger captures informational, warning, and error events and writes them to the console and log files.

## Project Structure

```
.
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── src
    ├── logger.js
    └── main.js
```

## Prerequisites

- Node.js 18+

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the application

```bash
node src/main.js
```

## Logging

The application uses Winston `3.11.0`. Logs are written to three destinations:

| Destination | Level | Description |
|---|---|---|
| Console | all | Prints all log levels to stdout |
| `logs/error.log` | error | Error level logs only |
| `logs/combined.log` | all | All log levels |

Log entries are formatted as JSON with a timestamp, for example:

```json
{"level":"info","message":"This is an informational message.","timestamp":"2026-02-28T00:00:00.000Z"}
```

### Log levels used

- `info` — general informational messages
- `warn` — warnings for potential issues
- `error` — errors, also written to `logs/error.log`

## Testing

Install dependencies and run the test suite:

```bash
npm install
npm test
```

Tests verify that:
- The logger instance is correctly configured with 3 transports
- `info`, `warn`, and `error` messages are written to `logs/combined.log`
- Only `error` messages are written to `logs/error.log`
- Each log entry includes a valid timestamp and is valid JSON
- Log messages are written in the correct order

## Dependencies

| Package | Version |
|---|---|
| winston | 3.11.0 |

### Dev Dependencies

| Package | Version |
|---|---|
| mocha | ^10.3.0 |
