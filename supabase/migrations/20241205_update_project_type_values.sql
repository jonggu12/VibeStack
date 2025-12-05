-- =====================================================
-- Update project_type column documentation
-- Migration: 20241205_update_project_type_values.sql
-- =====================================================

-- Update comment to reflect new project type values
COMMENT ON COLUMN users.project_type IS '프로젝트 타입: ai_saas(AI 기반 웹 서비스), dashboard(대시보드/데이터 앱), community(커뮤니티/소셜), productivity(생산성/자동화), quiz(퀴즈/테스트/게임), landing(랜딩 페이지)';
