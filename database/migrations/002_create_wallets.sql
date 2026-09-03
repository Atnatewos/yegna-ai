-- ============================================
-- Yegna AI - Database Migration
-- File: database/migrations/002_create_wallets.sql
-- Creates the wallets table for user balances
-- ============================================

-- Create wallets table
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(12, 2) DEFAULT 0.00 CHECK (balance >= 0),
    total_earned DECIMAL(12, 2) DEFAULT 0.00 CHECK (total_earned >= 0),
    total_withdrawn DECIMAL(12, 2) DEFAULT 0.00 CHECK (total_withdrawn >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id
CREATE INDEX idx_wallets_user_id ON wallets(user_id);

-- Create trigger for wallets table
CREATE TRIGGER update_wallets_updated_at
    BEFORE UPDATE ON wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();