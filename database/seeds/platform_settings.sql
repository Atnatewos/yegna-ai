-- ============================================
-- Yegna AI - Database Seed
-- File: database/seeds/platform_settings.sql
-- Seeds initial platform settings
-- ============================================

-- Payment Settings
INSERT INTO platform_settings (setting_key, setting_value, setting_type, description) VALUES
('payment_methods', 
 '[
   {
     "id": "telebirr",
     "labelKey": "payment.methods.telebirr.label",
     "number": "0912345678",
     "name": "Yegna AI PLC",
     "icon": "phone",
     "descriptionKey": "payment.methods.telebirr.description",
     "isActive": true
   },
   {
     "id": "cbe_birr",
     "labelKey": "payment.methods.cbeBirr.label",
     "number": "0987654321",
     "name": "Yegna AI PLC",
     "icon": "bank",
     "descriptionKey": "payment.methods.cbeBirr.description",
     "isActive": true
   },
   {
     "id": "bank_transfer",
     "labelKey": "payment.methods.bankTransfer.label",
     "bank": "Commercial Bank of Ethiopia",
     "account": "1000123456789",
     "name": "Yegna AI PLC",
     "icon": "building",
     "descriptionKey": "payment.methods.bankTransfer.description",
     "isActive": true
   }
 ]',
 'payment',
 'Available payment methods for deposits'
)
ON CONFLICT (setting_key) DO NOTHING;

-- Withdrawal Settings
INSERT INTO platform_settings (setting_key, setting_value, setting_type, description) VALUES
('withdrawal_config',
 '{
   "minimum": 100,
   "maximum": 10000,
   "feePercentage": 2,
   "processingHours": 48,
   "methods": [
     {
       "id": "telebirr",
       "labelKey": "withdrawal.methods.telebirr",
       "icon": "phone",
       "isActive": true
     },
     {
       "id": "cbe_birr",
       "labelKey": "withdrawal.methods.cbeBirr",
       "icon": "bank",
       "isActive": true
     },
     {
       "id": "bank_account",
       "labelKey": "withdrawal.methods.bankAccount",
       "icon": "building",
       "isActive": true
     }
   ]
 }',
 'withdrawal',
 'Withdrawal configuration and limits'
)
ON CONFLICT (setting_key) DO NOTHING;

-- Commission Settings
INSERT INTO platform_settings (setting_key, setting_value, setting_type, description) VALUES
('direct_referral_commission',
 '{
   "enabled": true,
   "percentage": 10,
   "minimumLevel": 1
 }',
 'commission',
 'Direct referral commission percentage'
)
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO platform_settings (setting_key, setting_value, setting_type, description) VALUES
('team_level_commissions',
 '[
   {"level": 1, "percentage": 10},
   {"level": 2, "percentage": 5},
   {"level": 3, "percentage": 3},
   {"level": 4, "percentage": 2},
   {"level": 5, "percentage": 1}
 ]',
 'commission',
 'Multi-level team commission percentages'
)
ON CONFLICT (setting_key) DO NOTHING;