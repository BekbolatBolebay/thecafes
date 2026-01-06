-- Update admin_users with valid bcrypt hash for password 1234Pppp!
-- This hash was generated with: bcrypt.hash('1234Pppp!', 10)
UPDATE admin_users 
SET password_hash = '$2b$10$eQak1HISctD23DefTN6rkOyCsGU98k3MBwkA8Uzq2nCrxSLh.G5oC'
WHERE email IN ('bolebay.bekbolat.25@gmail.com', 'nugnurd@gmail.com');
