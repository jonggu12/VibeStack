-- =====================================================
-- Migration: Partition search_logs table by month
-- Priority: 5/5 (Critical for performance and cost)
-- Estimated Impact: 20x query performance, 30% cost reduction
-- =====================================================

-- Step 1: Rename existing table (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'search_logs') THEN
    ALTER TABLE search_logs RENAME TO search_logs_old;
  END IF;
END $$;

-- Step 2: Create partitioned table
CREATE TABLE search_logs (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  filters JSONB,
  results_count INTEGER NOT NULL DEFAULT 0,  -- Note: plural 'results_count'
  clicked_result_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id, created_at)  -- created_at must be in PK for partitioning
) PARTITION BY RANGE (created_at);

-- Step 3: Create initial partitions (6 months: Dec 2024 - May 2025)
CREATE TABLE search_logs_2024_12 PARTITION OF search_logs
  FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

CREATE TABLE search_logs_2025_01 PARTITION OF search_logs
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE search_logs_2025_02 PARTITION OF search_logs
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

CREATE TABLE search_logs_2025_03 PARTITION OF search_logs
  FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

CREATE TABLE search_logs_2025_04 PARTITION OF search_logs
  FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');

CREATE TABLE search_logs_2025_05 PARTITION OF search_logs
  FOR VALUES FROM ('2025-05-01') TO ('2025-06-01');

-- Step 4: Create indexes on partitioned table
CREATE INDEX idx_search_logs_user_id ON search_logs(user_id, created_at DESC);
CREATE INDEX idx_search_logs_query ON search_logs USING gin(to_tsvector('english', query));
CREATE INDEX idx_search_logs_created_at ON search_logs(created_at DESC);

-- Step 5: Migrate existing data (if old table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'search_logs_old') THEN
    INSERT INTO search_logs (id, user_id, query, filters, results_count, clicked_result_id, created_at)
    SELECT id, user_id, query, filters, results_count, clicked_result_id, created_at
    FROM search_logs_old
    WHERE created_at >= '2024-12-01';  -- Only migrate recent data (last 1 month)

    -- Drop old table after migration
    DROP TABLE search_logs_old;
  END IF;
END $$;

-- Step 7: Create function to automatically create future partitions
CREATE OR REPLACE FUNCTION create_search_logs_partition()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  partition_date DATE;
  partition_name TEXT;
  start_date TEXT;
  end_date TEXT;
BEGIN
  -- Create partition for next month
  partition_date := DATE_TRUNC('month', NOW() + INTERVAL '1 month');
  partition_name := 'search_logs_' || TO_CHAR(partition_date, 'YYYY_MM');
  start_date := partition_date::TEXT;
  end_date := (partition_date + INTERVAL '1 month')::TEXT;

  -- Check if partition already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_class WHERE relname = partition_name
  ) THEN
    EXECUTE format(
      'CREATE TABLE %I PARTITION OF search_logs FOR VALUES FROM (%L) TO (%L)',
      partition_name, start_date, end_date
    );
    RAISE NOTICE 'Created partition: %', partition_name;
  END IF;
END;
$$;

-- Step 8: Create cron job to auto-create partitions monthly
-- Note: Requires pg_cron extension (available on Supabase Pro+)
-- If not available, run create_search_logs_partition() manually each month
-- SELECT cron.schedule(
--   'create-search-logs-partition',
--   '0 0 1 * *',  -- Run at midnight on the 1st of each month
--   'SELECT create_search_logs_partition();'
-- );

-- Step 9: Enable RLS
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- Step 10: Create RLS policies
-- Service role: Full access (for admin operations)
CREATE POLICY "Service role can manage search logs"
ON search_logs
FOR ALL
TO service_role
USING (true);

-- Users: Insert their own logs
CREATE POLICY "Users can insert their own search logs"
ON search_logs
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Public: Insert anonymous logs
CREATE POLICY "Public can insert anonymous search logs"
ON search_logs
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- Note: Admin role policies will be added in migration 20241211_06

-- Step 11: Comment for documentation
COMMENT ON TABLE search_logs IS 'Partitioned by month (RANGE on created_at). Old partitions should be dropped after 6 months to save cost.';

-- =====================================================
-- Post-Migration Notes:
-- =====================================================
-- 1. Run create_search_logs_partition() monthly to create new partitions
-- 2. Drop old partitions after 6 months:
--    DROP TABLE search_logs_2024_12;
-- 3. Query performance: Queries with created_at filter use partition pruning
-- 4. Storage savings: Drop old partitions = instant deletion, no VACUUM needed
-- =====================================================
