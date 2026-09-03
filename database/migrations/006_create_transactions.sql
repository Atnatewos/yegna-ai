-- ============================================
-- Yegna AI - Database Migration
-- File: database/migrations/006_create_transactions.sql
-- Creates deposit and withdrawal transactions
-- ============================================

-- Create deposit transactions table
CREATE TABLE deposit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level_id INT NOT NULL REFERENCES membership_levels(id),
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_proof_url TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    review_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP
);

-- Create withdrawal requests table
CREATE TABLE withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    fee DECIMAL(12, 2) DEFAULT 0.00,
    net_amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    account_details JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
    processed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    transaction_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

-- Create index on deposit transactions user_id
CREATE INDEX idx_deposit_transactions_user_id ON deposit_transactions(user_id);

-- Create index on deposit transactions status
CREATE INDEX idx_deposit_transactions_status ON deposit_transactions(status);

-- Create index on withdrawal requests user_id
CREATE INDEX idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);

-- Create index on withdrawal requests status
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);