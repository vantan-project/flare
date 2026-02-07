ALTER TABLE blogs 
  MODIFY COLUMN status VARCHAR(64) NOT NULL DEFAULT '非公開';

UPDATE blogs SET status = '公開' WHERE status = 'public';
UPDATE blogs SET status = '習慣外' WHERE status = 'non_habit';
UPDATE blogs SET status = '非公開' WHERE status = 'private';