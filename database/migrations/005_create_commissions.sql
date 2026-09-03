-- ============================================
-- Yegna AI - Database Migration
-- File: database/migrations/005_create_commissions.sql
-- Creates commission transactions and referral tree
-- ============================================

-- Create commission transactions table
CREATE TABLE commission_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    commission_type VARCHAR(30) NOT NULL CHECK (commission_type IN ('direct_referral', 'team_task', 'level_bonus')),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),
    level INT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create referral tree table
CREATE TABLE referral_tree (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level INT NOT NULL CHECK (level >= 1 AND level <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, referrer_id, level)
);

-- Create index on user_id for commissions
CREATE INDEX idx_commission_transactions_user_id ON commission_transactions(user_id);

-- Create index on from_user_id for commissions
CREATE INDEX idx_commission_transactions_from_user_id ON commission_transactions(from_user_id);

-- Create index on commission_type
CREATE INDEX idx_commission_transactions_type ON commission_transactions(commission_type);

-- Create index on referral tree user_id
CREATE INDEX idx_referral_tree_user_id ON referral_tree(user_id);

-- Create index on referral tree referrer_id
CREATE INDEX idx_referral_tree_referrer_id ON referral_tree(referrer_id);

-- Create index on referral tree level
CREATE INDEX idx_referral_tree_level ON referral_tree(level);