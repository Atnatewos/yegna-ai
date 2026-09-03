-- ============================================
-- Yegna AI - Database Migration
-- File: database/migrations/007_create_daily_earnings.sql
-- Creates daily earnings tracking table
-- ============================================

-- Create daily earnings table
CREATE TABLE daily_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_date DATE NOT NULL,
    tasks_completed INT DEFAULT 0,
    daily_income DECIMAL(12, 2) DEFAULT 0.00,
    team_commission DECIMAL(12, 2) DEFAULT 0.00,
    total_earned DECIMAL(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, task_date)
);

-- Create index on user_id for daily earnings
CREATE INDEX idx_daily_earnings_user_id ON daily_earnings(user_id);

-- Create index on task_date for daily earnings
CREATE INDEX idx_daily_earnings_task_date ON daily_earnings(task_date);

-- Create trigger for daily_earnings table
CREATE TRIGGER update_daily_earnings_updated_at
    BEFORE UPDATE ON daily_earnings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();