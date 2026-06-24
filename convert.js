const fs = require('fs');

const sql = fs.readFileSync('AlibabaFood_Complete.sql', 'utf8');

// Remove GO, PRINT, USE, CREATE DATABASE
let pgSql = sql
  .replace(/^GO\r?\n/gm, '')
  .replace(/^PRINT .*;\r?\n/gm, '')
  .replace(/^USE .*;\r?\n/gm, '')
  .replace(/^CREATE DATABASE .*;\r?\n/gm, '');

// Replace GETDATE()
pgSql = pgSql.replace(/GETDATE\(\)/g, 'CURRENT_TIMESTAMP');

// Replace CAST(CURRENT_TIMESTAMP AS DATE)
pgSql = pgSql.replace(/CAST\(CURRENT_TIMESTAMP AS DATE\)/g, 'CURRENT_DATE');

// Replace N'...' with '...'
pgSql = pgSql.replace(/N'([^']*)'/g, "'$1'");

// Fix boolean values for specific tables:
// food_items: is_pre_order is 16th column (0-indexed 15)
// Let's just fix it manually for the known ones:
// Actually, it's safer to just replace `is_pre_order, weight_kg` values.
// In the INSERT statement for food_items:
// (1, 1, 1, 'Cơm Tấm Sườn Bì', 'Cơm tấm Sài Gòn truyền thống', 20, 45000, 35000, 22.2, 1, 15, 4, 24, '11:00:00', '13:00:00', 0, 0.4, 650, 'Không', 'Gạo tấm, sườn heo, bì heo, nước mắm', 'Bảo quản nơi thoáng mát', 'Hâm nóng trong lò vi sóng 2 phút')

// We can replace the specific `0, 0.4, 650` with `false, 0.4, 650`
pgSql = pgSql.replace(/, 0, (\d+\.\d+), (\d+),/g, ', false, $1, $2,');
pgSql = pgSql.replace(/, 1, (\d+\.\d+), (\d+),/g, ', true, $1, $2,');

// For system_settings: (is_active)
pgSql = pgSql.replace(/\('([^']*)', '([^']*)', '([^']*)', 1\)/g, "('$1', '$2', '$3', true)");
pgSql = pgSql.replace(/\('([^']*)', '([^']*)', '([^']*)', 0\)/g, "('$1', '$2', '$3', false)");

// We only need the INSERT statements. Let's extract them.
const lines = pgSql.split('\n');
const insertLines = lines.filter(l => l.trim().startsWith('INSERT') || l.trim().startsWith('VALUES') || l.trim().startsWith('(') || l.trim().startsWith('SELECT'));

fs.writeFileSync('AlibabaFood_PostgreSQL.sql', pgSql, 'utf8');
console.log('Conversion done.');
