-- Tutorial Steps Table
-- 각 튜토리얼의 단계별 정보를 저장
CREATE TABLE IF NOT EXISTS tutorial_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutorial_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  estimated_duration_mins INTEGER DEFAULT 15,
  content TEXT, -- MDX 형식의 단계별 상세 내용
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 튜토리얼 내에서 step_number는 고유해야 함
  UNIQUE(tutorial_id, step_number)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_tutorial_steps_tutorial_id ON tutorial_steps(tutorial_id);
CREATE INDEX IF NOT EXISTS idx_tutorial_steps_order ON tutorial_steps(tutorial_id, order_index);

-- User Tutorial Progress Table
-- 사용자별 튜토리얼 진행 상황 추적
CREATE TABLE IF NOT EXISTS user_tutorial_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tutorial_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  current_step_number INTEGER DEFAULT 1,
  completed_step_numbers INTEGER[] DEFAULT '{}', -- 완료한 단계 번호들
  progress_pct INTEGER DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 사용자당 튜토리얼 하나만 진행 기록
  UNIQUE(user_id, tutorial_id)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_tutorial_progress_user ON user_tutorial_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tutorial_progress_tutorial ON user_tutorial_progress(tutorial_id);

-- Tutorial Tech Stack Table
-- 튜토리얼에서 사용하는 기술 스택 정보 (정규화)
CREATE TABLE IF NOT EXISTS tutorial_tech_stack (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutorial_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'framework', 'auth', 'database', 'payment' 등
  name TEXT NOT NULL,
  icon_url TEXT,
  url TEXT, -- 공식 문서 링크
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_tutorial_tech_stack_tutorial ON tutorial_tech_stack(tutorial_id);

-- RLS Policies

-- tutorial_steps: 모든 사용자가 읽을 수 있음
ALTER TABLE tutorial_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tutorial steps"
  ON tutorial_steps FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage tutorial steps"
  ON tutorial_steps FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- user_tutorial_progress: 본인 진행상황만 조회/수정 가능
ALTER TABLE user_tutorial_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_tutorial_progress FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own progress"
  ON user_tutorial_progress FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can modify own progress"
  ON user_tutorial_progress FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can view all progress"
  ON user_tutorial_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- tutorial_tech_stack: 모든 사용자가 읽을 수 있음
ALTER TABLE tutorial_tech_stack ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tech stack"
  ON tutorial_tech_stack FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage tech stack"
  ON tutorial_tech_stack FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Updated_at trigger function (재사용)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_tutorial_steps_updated_at ON tutorial_steps;
CREATE TRIGGER update_tutorial_steps_updated_at
  BEFORE UPDATE ON tutorial_steps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_tutorial_progress_updated_at ON user_tutorial_progress;
CREATE TRIGGER update_user_tutorial_progress_updated_at
  BEFORE UPDATE ON user_tutorial_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
