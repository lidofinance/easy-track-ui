import { createLogger, transports, format } from 'winston'
// @ts-ignore
import { traverse } from 'object-traversal'
import { sanitizeMessage } from './sanitize'

const { json, prettyPrint, timestamp, combine, errors } = format

const sanitize = format(info => {
  traverse(info, context => {
    const { parent, key, value } = context
    if (parent && key && typeof value === 'string') {
      parent[key] = sanitizeMessage(value)
    }
  })
  return info
})

export const logger = createLogger({
  defaultMeta: {
    service: 'easy-track-ui',
  },
  format: combine(
    json(),
    timestamp(),
    errors({ stack: true }),
    sanitize(),
    prettyPrint(),
  ),
  transports: [new transports.Console()],
})
