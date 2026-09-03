-- ============================================
-- Yegna AI - Database Migration
-- File: database/migrations/003_create_levels.sql
-- Creates membership levels and user memberships
-- ============================================

-- Create membership levels table
CREATE TABLE membership_levels (
    id SERIAL PRIMARY KEY,
    level_number INT UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    deposit_amount DECIMAL(12, 2) NOT NULL,
    tasks_per_day INT NOT NULL,
    income_per_task DECIMAL(12, 2) NOT NULL,
    daily_income DECIMAL(12, 2) NOT NULL,
    monthly_income DECIMAL(12, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user memberships table
CREATE TABLE user_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level_id INT NOT NULL REFERENCES membership_levels(id),
    is_active BOOLEAN DEFAULT true,
    activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for memberships
CREATE INDEX idx_user_memberships_user_id ON user_memberships(user_id);

-- Create index on level_id for memberships
CREATE INDEX idx_user_memberships_level_id ON user_memberships(level_id);

-- Create trigger for membership_levels table
CREATE TRIGGER update_membership_levels_updated_at
    BEFORE UPDATE ON membership_levels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for user_memberships table
CREATE TRIGGER update_user_memberships_updated_at
    BEFORE UPDATE ON user_memberships
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();