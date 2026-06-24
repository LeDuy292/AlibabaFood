-- Fix supplier passwords with valid BCrypt hashes
-- These are hashed versions of test passwords like "Supplier@123"

-- Update suppliers with valid BCrypt hashes
-- Password: Supplier@123
-- Hash: $2a$11$tIjfXP8r2vVJvn5LX4DWKuG2V/M8VfPVjCYy8WtMjLqH9FcMVNuFe

UPDATE users
SET password_hash = '$2a$11$tIjfXP8r2vVJvn5LX4DWKuG2V/M8VfPVjCYy8WtMjLqH9FcMVNuFe'
WHERE email LIKE 'supplier%@alibabafood.com';

-- Verify the update
SELECT user_id, email, username, role_id, password_hash 
FROM users 
WHERE email LIKE 'supplier%@alibabafood.com';
