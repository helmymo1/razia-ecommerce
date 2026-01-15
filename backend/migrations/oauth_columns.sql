-- OAuth Migration: Add social login columns to users table
-- Run this migration to support Google and Apple OAuth

ALTER TABLE users 
MODIFY COLUMN password VARCHAR(255) NULL;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS apple_id VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS profile_pic VARCHAR(512) NULL;

-- Add indexes for faster OAuth lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_apple_id ON users(apple_id);
