import { Logger } from '@nestjs/common';
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  API_STARWARS: string;
  JWT_SECRET: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USERNAME: joi.string().required(),
    JWT_SECRET: joi.string().required(),
  })
  .unknown(true);

const logger = new Logger('EnvVars');

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

logger.log(`Config validation success`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  dbPassword: envVars.DB_PASSWORD,
  dbName: envVars.DB_NAME,
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
  dbUsername: envVars.DB_USERNAME,
  apiStarWars: envVars.API_STARWARS,
  jwtSecret: envVars.JWT_SECRET,
};
