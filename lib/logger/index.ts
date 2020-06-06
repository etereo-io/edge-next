import config from '@lib/config'

export default function(level = 'DEBUG', ...args) {
  const numberLevel = {
    'DEBUG': 0,
    'INFO': 1,
    'WARNING': 2,
    'ERROR': 3
  }

  const numberRequested = numberLevel[level] || 0
  const actualNumber = numberLevel[config.logger.level] || 0

  if(numberRequested >= actualNumber) {
    console.log.apply(null, args)
  }
}