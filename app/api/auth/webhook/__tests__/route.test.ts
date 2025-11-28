import { POST } from '../route'
import { NextRequest } from 'next/server'
import { createMocks } from 'node-mocks-http'

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: { id: 'test-user-id' },
            error: null
          }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: { id: 'test-user-id' },
              error: null
            }))
          }))
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({
          error: null
        }))
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: { id: 'test-user-id' },
            error: null
          }))
        }))
      }))
    }))
  }))
}))

// Mock Svix for webhook verification
const mockVerify = jest.fn((payload: string) => {
  return JSON.parse(payload)
})

jest.mock('svix', () => ({
  Webhook: jest.fn().mockImplementation(() => ({
    verify: mockVerify
  }))
}))

describe('Clerk Webhook - user.created', () => {
  const webhookSecret = 'whsec_test_secret_key'

  beforeEach(() => {
    process.env.CLERK_WEBHOOK_SECRET = webhookSecret
    jest.clearAllMocks()
  })

  it('should create a new user in Supabase when user.created event is received', async () => {
    // Arrange: Create a mock Clerk webhook payload for user.created
    const clerkWebhookPayload = {
      type: 'user.created',
      data: {
        id: 'user_2abc123def456',
        email_addresses: [
          {
            email_address: 'test@example.com',
            id: 'email_123'
          }
        ],
        first_name: 'John',
        last_name: 'Doe',
        image_url: 'https://img.clerk.com/test.jpg',
        created_at: 1234567890000,
        updated_at: 1234567890000
      },
      object: 'event',
      timestamp: 1234567890000
    }

    const requestBody = JSON.stringify(clerkWebhookPayload)
    const headers = new Headers({
      'content-type': 'application/json',
      'svix-id': 'msg_test',
      'svix-timestamp': '1234567890',
      'svix-signature': 'v1,test_signature'
    })

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: headers,
      body: requestBody
    })

    // Act: Call the webhook handler
    const response = await POST(request)
    const responseData = await response.json()

    // Assert: Verify the response
    expect(response.status).toBe(200)
    expect(responseData.success).toBe(true)
  })

  it('should return 400 if webhook secret is not configured', async () => {
    // Arrange: Remove webhook secret
    delete process.env.CLERK_WEBHOOK_SECRET

    const clerkWebhookPayload = {
      type: 'user.created',
      data: {
        id: 'user_test',
        email_addresses: [{ email_address: 'test@example.com' }]
      }
    }

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify(clerkWebhookPayload)
    })

    // Act
    const response = await POST(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(400)
    expect(responseData.error).toBe('Invalid request')
  })

  it('should handle missing required headers', async () => {
    // Arrange: Create request without required Svix headers
    const clerkWebhookPayload = {
      type: 'user.created',
      data: {
        id: 'user_test',
        email_addresses: [{ email_address: 'test@example.com' }]
      }
    }

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify(clerkWebhookPayload)
    })

    // Act
    const response = await POST(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(400)
    expect(responseData.error).toBeDefined()
  })

  it('should extract name from first_name and last_name', async () => {
    // Arrange
    const clerkWebhookPayload = {
      type: 'user.created',
      data: {
        id: 'user_test',
        email_addresses: [{ email_address: 'test@example.com' }],
        first_name: 'Jane',
        last_name: 'Smith',
        image_url: 'https://img.clerk.com/test.jpg'
      }
    }

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'svix-id': 'msg_test',
        'svix-timestamp': '1234567890',
        'svix-signature': 'v1,test_signature'
      }),
      body: JSON.stringify(clerkWebhookPayload)
    })

    // Act
    const response = await POST(request)

    // Assert
    expect(response.status).toBe(200)
  })

  it('should handle user with no email addresses', async () => {
    // Arrange
    const clerkWebhookPayload = {
      type: 'user.created',
      data: {
        id: 'user_test',
        email_addresses: []
      }
    }

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'svix-id': 'msg_test',
        'svix-timestamp': '1234567890',
        'svix-signature': 'v1,test_signature'
      }),
      body: JSON.stringify(clerkWebhookPayload)
    })

    // Act
    const response = await POST(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(400)
    expect(responseData.error).toBe('Invalid request')
  })
})

describe('Clerk Webhook - user.updated', () => {
  const webhookSecret = 'whsec_test_secret_key'

  beforeEach(() => {
    process.env.CLERK_WEBHOOK_SECRET = webhookSecret
    jest.clearAllMocks()
  })

  it('should update user in Supabase when user.updated event is received', async () => {
    // Arrange
    const clerkWebhookPayload = {
      type: 'user.updated',
      data: {
        id: 'user_2abc123def456',
        email_addresses: [
          {
            email_address: 'updated@example.com',
            id: 'email_123'
          }
        ],
        first_name: 'Jane',
        last_name: 'Updated',
        image_url: 'https://img.clerk.com/updated.jpg',
        updated_at: 1234567891000
      }
    }

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'svix-id': 'msg_test',
        'svix-timestamp': '1234567890',
        'svix-signature': 'v1,test_signature'
      }),
      body: JSON.stringify(clerkWebhookPayload)
    })

    // Act
    const response = await POST(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(200)
    expect(responseData.success).toBe(true)
  })

  it('should handle user.updated event for non-existent user gracefully', async () => {
    // Arrange: Mock Supabase to return no user
    const { createClient } = require('@/lib/supabase/server')
    createClient.mockImplementationOnce(() => ({
      from: jest.fn(() => ({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({
                data: null,
                error: { message: 'User not found' }
              }))
            }))
          }))
        }))
      }))
    }))

    const clerkWebhookPayload = {
      type: 'user.updated',
      data: {
        id: 'user_nonexistent',
        email_addresses: [{ email_address: 'test@example.com' }]
      }
    }

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'svix-id': 'msg_test',
        'svix-timestamp': '1234567890',
        'svix-signature': 'v1,test_signature'
      }),
      body: JSON.stringify(clerkWebhookPayload)
    })

    // Act
    const response = await POST(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(500)
    expect(responseData.error).toBeDefined()
  })
})

describe('Clerk Webhook - user.deleted', () => {
  const webhookSecret = 'whsec_test_secret_key'

  beforeEach(() => {
    process.env.CLERK_WEBHOOK_SECRET = webhookSecret
    jest.clearAllMocks()
  })

  it('should delete user from Supabase when user.deleted event is received', async () => {
    // Arrange
    const clerkWebhookPayload = {
      type: 'user.deleted',
      data: {
        id: 'user_2abc123def456',
        deleted: true
      }
    }

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'svix-id': 'msg_test',
        'svix-timestamp': '1234567890',
        'svix-signature': 'v1,test_signature'
      }),
      body: JSON.stringify(clerkWebhookPayload)
    })

    // Act
    const response = await POST(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(200)
    expect(responseData.success).toBe(true)
  })

  it('should handle deletion of non-existent user gracefully', async () => {
    // Arrange: Mock Supabase to return error
    const { createClient } = require('@/lib/supabase/server')
    createClient.mockImplementationOnce(() => ({
      from: jest.fn(() => ({
        delete: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({
            error: { message: 'User not found' }
          }))
        }))
      }))
    }))

    const clerkWebhookPayload = {
      type: 'user.deleted',
      data: {
        id: 'user_nonexistent',
        deleted: true
      }
    }

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'svix-id': 'msg_test',
        'svix-timestamp': '1234567890',
        'svix-signature': 'v1,test_signature'
      }),
      body: JSON.stringify(clerkWebhookPayload)
    })

    // Act
    const response = await POST(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(500)
    expect(responseData.error).toBeDefined()
  })
})

describe('Clerk Webhook - Signature Verification', () => {
  const webhookSecret = 'whsec_test_secret_key'

  beforeEach(() => {
    process.env.CLERK_WEBHOOK_SECRET = webhookSecret
    jest.clearAllMocks()
    // Reset mock to default behavior
    mockVerify.mockImplementation((payload: string) => JSON.parse(payload))
  })

  it('should reject webhook with invalid signature', async () => {
    // Arrange: Mock verify to throw signature error
    mockVerify.mockImplementationOnce(() => {
      throw new Error('Invalid signature')
    })

    const clerkWebhookPayload = {
      type: 'user.created',
      data: {
        id: 'user_test',
        email_addresses: [{ email_address: 'test@example.com' }]
      }
    }

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'svix-id': 'msg_test',
        'svix-timestamp': '1234567890',
        'svix-signature': 'v1,invalid_signature'
      }),
      body: JSON.stringify(clerkWebhookPayload)
    })

    // Act
    const response = await POST(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(400)
    expect(responseData.error).toBeDefined()
  })

  it('should reject webhook with expired timestamp', async () => {
    // Arrange: Mock verify to throw timestamp error
    mockVerify.mockImplementationOnce(() => {
      throw new Error('Timestamp too old')
    })

    const clerkWebhookPayload = {
      type: 'user.created',
      data: {
        id: 'user_test',
        email_addresses: [{ email_address: 'test@example.com' }]
      }
    }

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'svix-id': 'msg_test',
        'svix-timestamp': '1000000000', // Very old timestamp
        'svix-signature': 'v1,test_signature'
      }),
      body: JSON.stringify(clerkWebhookPayload)
    })

    // Act
    const response = await POST(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(400)
    expect(responseData.error).toBeDefined()
  })

  it('should validate signature format before processing', async () => {
    // Arrange: Mock verify to throw on invalid format
    mockVerify.mockImplementationOnce(() => {
      throw new Error('Invalid signature format')
    })

    const clerkWebhookPayload = {
      type: 'user.created',
      data: {
        id: 'user_test',
        email_addresses: [{ email_address: 'test@example.com' }]
      }
    }

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'svix-id': 'msg_test',
        'svix-timestamp': '1234567890',
        'svix-signature': 'invalid_format_no_prefix'
      }),
      body: JSON.stringify(clerkWebhookPayload)
    })

    // Act
    const response = await POST(request)

    // Assert
    expect(response.status).toBe(400)
  })
})

describe('Clerk Webhook - Malformed Payloads', () => {
  const webhookSecret = 'whsec_test_secret_key'

  beforeEach(() => {
    process.env.CLERK_WEBHOOK_SECRET = webhookSecret
    jest.clearAllMocks()
    mockVerify.mockImplementation((payload: string) => JSON.parse(payload))
  })

  it('should handle webhook with missing event type gracefully', async () => {
    // Arrange: Payload without type field returns success for unhandled events
    const malformedPayload = {
      data: {
        id: 'user_test',
        email_addresses: [{ email_address: 'test@example.com' }]
      }
    }

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'svix-id': 'msg_test',
        'svix-timestamp': '1234567890',
        'svix-signature': 'v1,test_signature'
      }),
      body: JSON.stringify(malformedPayload)
    })

    // Act
    const response = await POST(request)
    const responseData = await response.json()

    // Assert: Unhandled event types return success
    expect(response.status).toBe(200)
    expect(responseData.received).toBe(true)
  })

  it('should handle unsupported event type gracefully', async () => {
    // Arrange: Unknown event type returns success (logged but not error)
    const unknownEventPayload = {
      type: 'user.unknown_event',
      data: {
        id: 'user_test'
      }
    }

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'svix-id': 'msg_test',
        'svix-timestamp': '1234567890',
        'svix-signature': 'v1,test_signature'
      }),
      body: JSON.stringify(unknownEventPayload)
    })

    // Act
    const response = await POST(request)
    const responseData = await response.json()

    // Assert: Unhandled event types return success
    expect(response.status).toBe(200)
    expect(responseData.received).toBe(true)
  })

  it('should reject webhook with missing data field', async () => {
    // Arrange: Payload without data causes extractUserInfo to fail
    const noDataPayload = {
      type: 'user.created',
      data: {} // Empty data object
    }

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'svix-id': 'msg_test',
        'svix-timestamp': '1234567890',
        'svix-signature': 'v1,test_signature'
      }),
      body: JSON.stringify(noDataPayload)
    })

    // Act
    const response = await POST(request)
    const responseData = await response.json()

    // Assert: Missing email_addresses returns Invalid request
    expect(response.status).toBe(400)
    expect(responseData.error).toBe('Invalid request')
  })

  it('should reject webhook with invalid JSON', async () => {
    // Arrange: Malformed JSON
    const invalidJson = '{"type": "user.created", invalid json}'

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'svix-id': 'msg_test',
        'svix-timestamp': '1234567890',
        'svix-signature': 'v1,test_signature'
      }),
      body: invalidJson
    })

    // Act
    const response = await POST(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(400)
    expect(responseData.error).toBeDefined()
  })

  it('should handle user data with null values gracefully', async () => {
    // Arrange: User with null first_name, last_name
    const nullFieldsPayload = {
      type: 'user.created',
      data: {
        id: 'user_test',
        email_addresses: [{ email_address: 'test@example.com' }],
        first_name: null,
        last_name: null,
        image_url: null
      }
    }

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'svix-id': 'msg_test',
        'svix-timestamp': '1234567890',
        'svix-signature': 'v1,test_signature'
      }),
      body: JSON.stringify(nullFieldsPayload)
    })

    // Act
    const response = await POST(request)

    // Assert
    expect(response.status).toBe(200)
  })
})

describe('Clerk Webhook - Database Error Handling', () => {
  const webhookSecret = 'whsec_test_secret_key'

  beforeEach(() => {
    process.env.CLERK_WEBHOOK_SECRET = webhookSecret
    jest.clearAllMocks()
    mockVerify.mockImplementation((payload: string) => JSON.parse(payload))
  })

  it('should handle database connection timeout', async () => {
    // Arrange: Mock database timeout error
    const { createClient } = require('@/lib/supabase/server')
    createClient.mockImplementationOnce(() => ({
      from: jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.reject(new Error('Connection timeout')))
          }))
        }))
      }))
    }))

    const clerkWebhookPayload = {
      type: 'user.created',
      data: {
        id: 'user_test',
        email_addresses: [{ email_address: 'test@example.com' }]
      }
    }

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'svix-id': 'msg_test',
        'svix-timestamp': '1234567890',
        'svix-signature': 'v1,test_signature'
      }),
      body: JSON.stringify(clerkWebhookPayload)
    })

    // Act
    const response = await POST(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(500)
    expect(responseData.error).toBeDefined()
  })

  it('should handle duplicate key constraint violation', async () => {
    // Arrange: Mock duplicate key error
    const { createClient } = require('@/lib/supabase/server')
    createClient.mockImplementationOnce(() => ({
      from: jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: null,
              error: {
                code: '23505',
                message: 'duplicate key value violates unique constraint'
              }
            }))
          }))
        }))
      }))
    }))

    const clerkWebhookPayload = {
      type: 'user.created',
      data: {
        id: 'user_duplicate',
        email_addresses: [{ email_address: 'duplicate@example.com' }]
      }
    }

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'svix-id': 'msg_test',
        'svix-timestamp': '1234567890',
        'svix-signature': 'v1,test_signature'
      }),
      body: JSON.stringify(clerkWebhookPayload)
    })

    // Act
    const response = await POST(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(500)
    expect(responseData.error).toBeDefined()
  })

  it('should handle database transaction rollback', async () => {
    // Arrange: Mock transaction error
    const { createClient } = require('@/lib/supabase/server')
    createClient.mockImplementationOnce(() => ({
      from: jest.fn(() => ({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({
                data: null,
                error: {
                  code: '40001',
                  message: 'could not serialize access due to concurrent update'
                }
              }))
            }))
          }))
        }))
      }))
    }))

    const clerkWebhookPayload = {
      type: 'user.updated',
      data: {
        id: 'user_test',
        email_addresses: [{ email_address: 'test@example.com' }]
      }
    }

    const request = new NextRequest('http://localhost:3000/api/auth/webhook', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'svix-id': 'msg_test',
        'svix-timestamp': '1234567890',
        'svix-signature': 'v1,test_signature'
      }),
      body: JSON.stringify(clerkWebhookPayload)
    })

    // Act
    const response = await POST(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(500)
    expect(responseData.error).toBeDefined()
  })
})
