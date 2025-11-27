import { render, screen } from '@testing-library/react'
import { Header } from '../header'

// Mock Clerk's UserButton
jest.mock('@clerk/nextjs', () => ({
  UserButton: () => <div data-testid="clerk-user-button">User Menu</div>,
  SignedIn: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sign-in-button">{children}</div>
  ),
}))

describe('Header Component', () => {
  it('should render the header', () => {
    render(<Header />)
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })

  it('should display VibeStack logo', () => {
    render(<Header />)
    const logo = screen.getByText(/VibeStack/i)
    expect(logo).toBeInTheDocument()
  })

  it('should render Clerk UserButton for authenticated users', () => {
    render(<Header />)
    const userButton = screen.getByTestId('clerk-user-button')
    expect(userButton).toBeInTheDocument()
  })

  it('should have navigation structure', () => {
    render(<Header />)
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('should position user menu on the right side', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('flex', 'justify-between')
  })
})
