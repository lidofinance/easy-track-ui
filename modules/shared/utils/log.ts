import winston, { createLogger, transports } from 'winston'

export const logger = createLogger({
  defaultMeta: {
    service: 'easy-track-ui',
  },
  transports: [new transports.Console({ format: winston.format.json() })],
})
