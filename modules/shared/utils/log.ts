import { createLogger, transports, format } from 'winston'

const { json, prettyPrint, timestamp, combine } = format

export const logger = createLogger({
  defaultMeta: {
    service: 'easy-track-ui',
  },
  format: combine(json(), timestamp(), prettyPrint()),
  transports: [new transports.Console()],
})
