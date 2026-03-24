import { render, screen, fireEvent } from '@testing-library/react'
import FilterSidebar from '@/components/FilterSidebar'

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  })
}))

jest.mock('../src/context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'normal', toggleTheme: jest.fn(), isTronMode: false })
}))

describe('FilterSidebar Component', () => {
  const mockFilters = {
    locationType: [],
    jobType: [],
  }
  const mockSetTypes = jest.fn()
  const mockSetLocations = jest.fn()
  const mockSetQuery = jest.fn()

  it('renders the search input field', () => {
    render(<FilterSidebar query="" setQuery={mockSetQuery} types={mockFilters.jobType} setTypes={mockSetTypes} locations={mockFilters.locationType} setLocations={mockSetLocations} />)
    expect(screen.getByPlaceholderText('sidebar.search_placeholder')).toBeInTheDocument()
  })

  it('renders filter checkboxes for Remote and Full-time', () => {
    render(<FilterSidebar query="" setQuery={mockSetQuery} types={mockFilters.jobType} setTypes={mockSetTypes} locations={mockFilters.locationType} setLocations={mockSetLocations} />)
    expect(screen.getByLabelText('Remote')).toBeInTheDocument()
    expect(screen.getByLabelText('Full-time')).toBeInTheDocument()
  })

  it('calls setFilters when a checkbox is clicked', () => {
    render(<FilterSidebar query="" setQuery={mockSetQuery} types={mockFilters.jobType} setTypes={mockSetTypes} locations={mockFilters.locationType} setLocations={mockSetLocations} />)
    const remoteCheckbox = screen.getByLabelText('Remote')
    fireEvent.click(remoteCheckbox)
    expect(mockSetLocations).toHaveBeenCalled()
  })
})
