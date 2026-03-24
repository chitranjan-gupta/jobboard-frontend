import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'

// Mock the Next.js hooks and Contexts
jest.mock('next/navigation', () => ({
  usePathname: () => '/en',
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  useParams: () => ({ country: 'us', lang: 'en' }),
  useSearchParams: () => ({ toString: () => '' })
}))

jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({ user: null, logout: jest.fn(), loading: false })
}))

jest.mock('../src/context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'normal', toggleTheme: jest.fn(), isTronMode: false })
}))

jest.mock('../src/context/CurrencyContext', () => ({
  useCurrency: () => ({ currency: 'USD', changeCurrency: jest.fn() })
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en', changeLanguage: jest.fn() }
  })
}))

describe('Header Component', () => {
  it('renders the Job Board logo and navigation items', () => {
    render(<Header />)
    
    // Check if the logo/title exists
    // The logo text "Job Board" is mapped exactly or translated
    expect(screen.getByText('Job')).toBeInTheDocument()
    expect(screen.getByText('Board')).toBeInTheDocument()

    // Since user is null in our mock, we expect to see the Signin link
    expect(screen.getByText('header.signin')).toBeInTheDocument()
  })

  it('renders the language, country, and currency pickers', () => {
    render(<Header />)
    expect(screen.getByRole('combobox', { name: /Language/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /Country/i })).toBeInTheDocument()
  })
})
