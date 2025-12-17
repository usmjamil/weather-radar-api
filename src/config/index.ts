export const config = {
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',

  mrms: {
    url: process.env.MRMS_URL || 'https://mrms.ncep.noaa.gov/2D/ReflectivityAtLowestAltitude/MRMS_ReflectivityAtLowestAltitude.latest.grib2.gz',
    timeout: parseInt(process.env.MRMS_TIMEOUT || '30000'),
    refreshInterval: parseInt(process.env.MRMS_REFRESH_INTERVAL || '120000')
  },

  cache: {
    memoryTtl: parseInt(process.env.CACHE_MEMORY_TTL || '120000'),
    fileTtl: parseInt(process.env.CACHE_FILE_TTL || '300000'),
    directory: process.env.CACHE_DIRECTORY || './cache'
  },

  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL || 'https://weather-radar-web-app.onrender.com']
        : ['http://localhost:3000'],
    credentials: true
  }
};
