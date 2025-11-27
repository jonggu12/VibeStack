// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js Request/Response for API route tests
if (typeof Request === 'undefined') {
  global.Request = class Request {}
}

if (typeof Response === 'undefined') {
  global.Response = class Response {}
}

// Mock environment variables for testing
process.env.CLERK_WEBHOOK_SECRET = 'whsec_test_secret_key'
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test_service_role_key'
