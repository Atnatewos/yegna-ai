-- ============================================
-- Yegna AI - Database Seed
-- File: database/seeds/admin.sql
-- Seeds initial admin user
-- ============================================

-- Admin user password: Admin@123 (hash generated using bcrypt)
INSERT INTO users (username, email, password_hash, full_name, phone, role, referral_code, is_active, is_verified)
VALUES (
  'admin',
  'admin@yegna.ai',
  '$2a$10$XHN1m28rniD1c/dSMbQ7JuNdc1OEuWkRD3fF9bDLBBSvJz8APPiyG',
  'Yegna AI Admin',
  '0911111111',
  'admin',
  'ADMIN001',
  true,
  true
)
ON CONFLICT (email) DO NOTHING;

-- Create wallet for admin
INSERT INTO wallets (user_id)
SELECT id FROM users WHERE username = 'admin'
ON CONFLICT (user_id) DO NOTHING;