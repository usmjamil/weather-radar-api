# Weather Radar API

Backend service for the Weather Radar application, providing MRMS Reflectivity at Lowest Altitude (RALA) data via REST API.

## Features

- Downloads and processes MRMS GRIB2 data
- Serves radar data via REST API
- Implements caching for reliability during MRMS downtime
- Auto-refreshes data every 2 minutes
- TypeScript for type safety and maintainability

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Copy `.env.example` to `.env` and update with your configuration

### Development

```bash
# Start development server with hot-reload
npm run dev
```

### Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## API Endpoints

- `GET /api/radar/latest` - Returns latest radar data in GeoJSON format, with reflectivity values in dBZ
- `GET /health` - Health check endpoint; returns 200 OK if service is running

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Comma-separated list of allowed origins
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)
- `MRMS_URL` - MRMS data source URL
- `MRMS_TIMEOUT` - Request timeout in ms (default: 30000)
- `MRMS_REFRESH_INTERVAL` - Refresh interval in ms (default: 120000)
- `CACHE_MEMORY_TTL` - In-memory cache TTL in ms (default: 120000)
- `CACHE_FILE_TTL` - File cache TTL in ms (default: 300000)
- `CACHE_DIRECTORY` - Cache directory (default: ./cache)
- `LOG_LEVEL` - Logging level (default: info)

## Docker

```bash
# Build the Docker image
docker build -t weather-radar-backend .

# Run the container
docker run -p 3001:3001 weather-radar-backend
```

## Data Source

MRMS Reflectivity at Lowest Altitude (RALA)

- URL: https://mrms.ncep.noaa.gov/2D/ReflectivityAtLowestAltitude/MRMS_ReflectivityAtLowestAltitude.latest.grib2.gz
- Update frequency: Every ~2 minutes
- Coverage: CONUS (Continental US)

## License

MIT
