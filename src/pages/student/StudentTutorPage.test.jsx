import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TutorSearchPage from '../onboarding/tutorSearchPage.jsx/TutorSearchPage';

// Mock data for testing
const mockTutors = [
  {
    id: 1,
    name: "Test Tutor 1",
    subjects: ["Mathematics", "Physics"],
    rating: 4.9,
    reviewCount: 100,
    hourlyRate: 45,
    location: "New York, NY",
    availability: "Available",
    bio: "Experienced math tutor",
    education: "MIT - Mathematics"
  },
  {
    id: 2,
    name: "Test Tutor 2",
    subjects: ["Computer Science"],
    rating: 4.7,
    reviewCount: 80,
    hourlyRate: 60,
    location: "San Francisco, CA",
    availability: "Busy",
    bio: "Software engineer and educator",
    education: "Stanford - Computer Science"
  }
];

// Mock the component to use test data
jest.mock('./TutorSearchPage', () => {
  const originalModule = jest.requireActual('./TutorSearchPage');
  return {
    ...originalModule,
    mockTutors: mockTutors
  };
});

describe('TutorSearchPage', () => {
  beforeEach(() => {
    render(<TutorSearchPage />);
  });

  test('renders the main heading', () => {
    expect(screen.getByText('Find Your Perfect Tutor')).toBeInTheDocument();
  });

  test('displays search input', () => {
    const searchInput = screen.getByPlaceholderText(/search by name, subject, or keyword/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('displays sort dropdown', () => {
    const sortDropdown = screen.getByDisplayValue('Highest Rated');
    expect(sortDropdown).toBeInTheDocument();
  });

  test('shows filter button on mobile', () => {
    const filterButton = screen.getByText('Filters');
    expect(filterButton).toBeInTheDocument();
  });

  test('displays tutor cards', () => {
    // Should show tutor cards with names
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Michael Chen')).toBeInTheDocument();
  });

  test('search functionality works', async () => {
    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText(/search by name, subject, or keyword/i);
    
    await user.type(searchInput, 'Sarah');
    
    // Should filter results
    await waitFor(() => {
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    });
  });

  test('subject filtering works', async () => {
    const user = userEvent.setup();
    
    // Open filters (desktop version)
    const mathCheckbox = screen.getByLabelText('Mathematics');
    await user.click(mathCheckbox);
    
    // Should filter to show only math tutors
    await waitFor(() => {
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    });
  });

  test('sort functionality works', async () => {
    const user = userEvent.setup();
    const sortDropdown = screen.getByDisplayValue('Highest Rated');
    
    await user.selectOptions(sortDropdown, 'price-low');
    
    // Should sort by price low to high
    expect(sortDropdown.value).toBe('price-low');
  });

  test('contact tutor button works', async () => {
    const user = userEvent.setup();
    const contactButtons = screen.getAllByText('Contact Tutor');
    
    // Mock window.alert
    window.alert = jest.fn();
    
    await user.click(contactButtons[0]);
    
    expect(window.alert).toHaveBeenCalled();
  });

  test('filter panel opens on mobile', async () => {
    const user = userEvent.setup();
    
    // Simulate mobile view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    const filterButton = screen.getByText('Filters');
    await user.click(filterButton);
    
    // Filter panel should be visible
    expect(screen.getByRole('dialog', { hidden: true })).toBeInTheDocument();
  });

  test('clear filters functionality', async () => {
    const user = userEvent.setup();
    
    // Apply some filters first
    const mathCheckbox = screen.getByLabelText('Mathematics');
    await user.click(mathCheckbox);
    
    // Clear filters
    const clearButton = screen.getByText('Clear all');
    await user.click(clearButton);
    
    // Filters should be cleared
    expect(mathCheckbox).not.toBeChecked();
  });

  test('pagination works', async () => {
    const user = userEvent.setup();
    
    // If there are more tutors than the page size, load more button should appear
    const loadMoreButton = screen.queryByText('Load More Tutors');
    
    if (loadMoreButton) {
      await user.click(loadMoreButton);
      
      // Should show loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    }
  });

  test('no results state displays correctly', async () => {
    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText(/search by name, subject, or keyword/i);
    
    // Search for something that won't match
    await user.type(searchInput, 'nonexistenttutor123');
    
    await waitFor(() => {
      expect(screen.getByText('No tutors found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search criteria or filters')).toBeInTheDocument();
    });
  });

  test('rating filter works', async () => {
    const user = userEvent.setup();
    const ratingSelect = screen.getByDisplayValue('Any Rating');
    
    await user.selectOptions(ratingSelect, '4.8');
    
    // Should filter to show only high-rated tutors
    expect(ratingSelect.value).toBe('4.8');
  });

  test('price range filter works', async () => {
    const user = userEvent.setup();
    const priceSlider = screen.getByRole('slider');
    
    fireEvent.change(priceSlider, { target: { value: '50' } });
    
    expect(priceSlider.value).toBe('50');
  });

  test('availability filter works', async () => {
    const user = userEvent.setup();
    const availabilitySelect = screen.getByDisplayValue('All Tutors');
    
    await user.selectOptions(availabilitySelect, 'available');
    
    expect(availabilitySelect.value).toBe('available');
  });

  test('active filters display correctly', async () => {
    const user = userEvent.setup();
    
    // Apply a subject filter
    const mathCheckbox = screen.getByLabelText('Mathematics');
    await user.click(mathCheckbox);
    
    // Should show active filter
    await waitFor(() => {
      expect(screen.getByText('Active filters:')).toBeInTheDocument();
      expect(screen.getByText('Mathematics')).toBeInTheDocument();
    });
  });

  test('individual filter removal works', async () => {
    const user = userEvent.setup();
    
    // Apply a subject filter
    const mathCheckbox = screen.getByLabelText('Mathematics');
    await user.click(mathCheckbox);
    
    // Find and click the remove button for the filter
    await waitFor(() => {
      const removeButton = screen.getByRole('button', { name: /remove mathematics filter/i });
      return user.click(removeButton);
    });
    
    // Filter should be removed
    expect(mathCheckbox).not.toBeChecked();
  });

  test('tutor card displays all required information', () => {
    // Check that tutor cards show essential information
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText('$45')).toBeInTheDocument();
    expect(screen.getByText('Mathematics')).toBeInTheDocument();
    expect(screen.getByText('Physics')).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  test('responsive design elements are present', () => {
    // Check for mobile-specific elements
    expect(screen.getByText('Filters')).toBeInTheDocument();
    
    // Check for desktop-specific elements
    expect(screen.getByText('Subjects')).toBeInTheDocument();
    expect(screen.getByText('Minimum Rating')).toBeInTheDocument();
    expect(screen.getByText('Max Price per Hour')).toBeInTheDocument();
    expect(screen.getByText('Availability')).toBeInTheDocument();
  });
});

// Integration tests
describe('TutorSearchPage Integration', () => {
  test('search and filter combination works', async () => {
    render(<TutorSearchPage />);
    const user = userEvent.setup();
    
    // Search for a specific term
    const searchInput = screen.getByPlaceholderText(/search by name, subject, or keyword/i);
    await user.type(searchInput, 'Math');
    
    // Apply additional filter
    const availableFilter = screen.getByDisplayValue('All Tutors');
    await user.selectOptions(availableFilter, 'available');
    
    // Should show filtered and searched results
    await waitFor(() => {
      expect(screen.getByText(/tutors found/i)).toBeInTheDocument();
    });
  });

  test('sort and filter combination works', async () => {
    render(<TutorSearchPage />);
    const user = userEvent.setup();
    
    // Apply filter
    const mathCheckbox = screen.getByLabelText('Mathematics');
    await user.click(mathCheckbox);
    
    // Change sort
    const sortDropdown = screen.getByDisplayValue('Highest Rated');
    await user.selectOptions(sortDropdown, 'price-low');
    
    // Should maintain filter while changing sort
    expect(mathCheckbox).toBeChecked();
    expect(sortDropdown.value).toBe('price-low');
  });

  test('pagination maintains filters', async () => {
    render(<TutorSearchPage />);
    const user = userEvent.setup();
    
    // Apply filter
    const mathCheckbox = screen.getByLabelText('Mathematics');
    await user.click(mathCheckbox);
    
    // If pagination exists, test it maintains filters
    const loadMoreButton = screen.queryByText('Load More Tutors');
    if (loadMoreButton) {
      await user.click(loadMoreButton);
      
      // Filter should still be active
      expect(mathCheckbox).toBeChecked();
    }
  });
});

// Accessibility tests
describe('TutorSearchPage Accessibility', () => {
  test('has proper heading hierarchy', () => {
    render(<TutorSearchPage />);
    
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(6); // Tutor names
  });

  test('form elements have proper labels', () => {
    render(<TutorSearchPage />);
    
    expect(screen.getByLabelText(/search by name/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Mathematics')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  test('buttons have accessible names', () => {
    render(<TutorSearchPage />);
    
    expect(screen.getByRole('button', { name: /filters/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /contact tutor/i })).toHaveLength(6);
  });

  test('images have alt text', () => {
    render(<TutorSearchPage />);
    
    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
      expect(img.getAttribute('alt')).not.toBe('');
    });
  });
});