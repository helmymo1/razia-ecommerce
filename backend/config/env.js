const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

// Load env vars from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const envSchema = Joi.object({
  PORT: Joi.number().default(5000),
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  // Allow either DB_PASS or DB_PASSWORD (legacy)
  DB_PASS: Joi.string().allow('').optional(), 
  DB_PASSWORD: Joi.string().allow('').optional(),
  JWT_SECRET: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_BUCKET_NAME: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
})
.unknown()
.required();

const { value: envVars, error } = envSchema.validate(process.env);

if (error) {
  console.error(`Config validation error: ${error.message}`);
  process.exit(1);
}

// Normalize DB_PASS
if (!envVars.DB_PASS && envVars.DB_PASSWORD !== undefined) {
    envVars.DB_PASS = envVars.DB_PASSWORD;
}

module.exports = envVars;
