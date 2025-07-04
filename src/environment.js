import { config as dotenv } from 'dotenv'
dotenv()

export const env = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_DATABASE: process.env.DB_DATABASE || 'api_factupro',
  APP_PORT: process.env.APP_PORT || '8000',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  SECRET_KEY: process.env.SECRET_KEY || '',
  DB_SYNC: process.env.DB_SYNC || false,
}
