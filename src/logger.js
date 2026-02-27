// logger.js
// Import the Winston logging library
const { createLogger, transports, format } = require('winston');

// Create a logger instance with custom settings
const logger = createLogger({ // 
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [ // Define transports for logging to console and files
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

// Export the logger instance
module.exports = logger;