-- Add telegram_chat_id column to user_profiles table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;

-- Add confirmed_at and cancelled_at columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_telegram_chat_id ON user_profiles(telegram_chat_id);

