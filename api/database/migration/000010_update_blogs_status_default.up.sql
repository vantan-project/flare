-- 既存のデータを英語に変換
UPDATE blogs SET status = 'public' WHERE status = '公開';
UPDATE blogs SET status = 'non_habit' WHERE status = '習慣外';
UPDATE blogs SET status = 'private' WHERE status = '非公開';

ALTER TABLE blogs 
  MODIFY COLUMN status ENUM('public', 'private', 'non_habit') NOT NULL DEFAULT 'private';