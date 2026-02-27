# Node.js Logging with Winston

A simple Node.js application demonstrating structured logging using the [Winston](https://github.com/winstonjs/winston) library.

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

- [Node.js](https://nodejs.org/) installed on your machine

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ElinaTuulikki/Logging
cd Logging
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the application

```bash
node src/main.js
```

## Logging

The application uses Winston `3.11.0` for logging. Logs are written to three destinations:

- **Console** — all log levels
- **logs/error.log** — error level logs only
- **logs/combined.log** — all log levels

Log entries are formatted as JSON with a timestamp.

### Log Levels Used

| Level | Description |
|-------|-------------|
| `info` | General informational messages |
| `warn` | Warning messages for potential issues |
| `error` | Error messages for failures |

## Dependencies

| Package | Version |
|---------|---------|
| winston | 3.11.0 |
