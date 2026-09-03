-- ============================================
-- Yegna AI - Database Migration
-- File: database/migrations/008_create_notifications.sql
-- Creates notifications table
-- ============================================

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Create index on is_read for notifications
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create index on created_at for notifications
CREATE INDEX idx_notifications_created_at ON notifications(created_at);