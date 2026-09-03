-- ============================================
-- Yegna AI - Database Seed
-- File: database/seeds/levels.sql
-- Seeds initial membership levels
-- ============================================

INSERT INTO membership_levels (level_number, name, deposit_amount, tasks_per_day, income_per_task, daily_income, monthly_income) VALUES
(0, 'Intern', 0, 5, 12, 60, 180),
(1, 'D1', 1600, 5, 12, 60, 1800),
(2, 'D2', 4000, 5, 30, 150, 4500),
(3, 'D3', 7200, 5, 54, 270, 8100),
(4, 'D4', 16000, 5, 120, 600, 18000),
(5, 'D5', 36000, 5, 300, 1500, 45000),
(6, 'D6', 90000, 10, 385, 3850, 115500),
(7, 'D7', 140000, 20, 275, 5500, 165000),
(8, 'D8', 330000, 20, 625, 12500, 375000)
ON CONFLICT (level_number) DO NOTHING;