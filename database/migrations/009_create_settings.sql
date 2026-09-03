-- ============================================
-- Yegna AI - Database Migration
-- File: database/migrations/009_create_settings.sql
-- Creates platform settings table for admin-controlled configs
-- ============================================

-- Create platform settings table
CREATE TABLE platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    setting_type VARCHAR(20) NOT NULL CHECK (setting_type IN ('payment', 'withdrawal', 'general', 'commission', 'task')),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on setting_key
CREATE INDEX idx_platform_settings_key ON platform_settings(setting_key);

-- Create index on setting_type
CREATE INDEX idx_platform_settings_type ON platform_settings(setting_type);

-- Create trigger for platform_settings table
CREATE TRIGGER update_platform_settings_updated_at
    BEFORE UPDATE ON platform_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();