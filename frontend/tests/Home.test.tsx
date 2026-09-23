import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../pages/index';
import { jest } from '@jest/globals';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('France Holiday Planner Frontend', () => {
  // Mock fetch for API calls
  beforeEach(() => {
    fetch.mockClear();
    localStorageMock.clear();
  });

  test('renders loading state initially', () => {
    // Mock fetch to delay response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Failed')),
      })
    );

    render(<Home />);

    // Should show loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('shows error when API fails', async () => {
    // Mock fetch to return error
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('API Error')),
      })
    );

    render(<Home />);

    // Wait for error to appear
    await waitFor(() =>
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
    );
  });

  test('displays trip data when API succeeds', async () => {
    // Mock successful API response
    const mockTripData = {
      title: 'France Holiday 2026',
      dates: '25 June – 5 July',
      currency: 'EUR',
      budget: 2347.0,
      stops: [],
      expenses: [],
      tips: [],
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTripData),
      })
    );

    render(<Home />);

    // Wait for trip data to load
    await waitFor(() =>
      expect(screen.getByText(/france holiday 2026/i)).toBeInTheDocument()
    );

    // Check that key elements are present
    expect(screen.getByText(/listed expenses/i)).toBeInTheDocument();
    expect(screen.getByText(/flights/i)).toBeInTheDocument();
    expect(screen.getByText(/accommodation/i)).toBeInTheDocument();
    expect(screen.getByText(/food/i)).toBeInTheDocument();
  });

  test('adds expense and persists to localStorage', async () => {
    // Mock successful API response
    const mockTripData = {
      title: 'Test Trip',
      dates: '1 Jan',
      currency: 'EUR',
      budget: 1000,
      stops: [],
      expenses: [],
      tips: [],
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTripData),
      })
    );

    render(<Home />);

    // Wait for data to load
    await waitFor(() =>
      expect(screen.getByText(/test trip/i)).toBeInTheDocument()
    );

    // Click Add Expense button
    const addButton = screen.getByRole('button', {
      name: /add expense/i,
    });
    fireEvent.click(addButton);

    // Should show expense row with default values
    await waitFor(() => {
      expect(
        screen.getByRole('textbox', { name: /category/i })
      ).toHaveValue('Other');
      expect(
        screen.getByRole('textbox', { name: /item/i })
      ).toHaveValue('New expense');
      expect(
        screen.getByRole('textbox', { name: /amount/i })
      ).toHaveValue('0');
    });

    // Verify localStorage was called
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  test('calculates total expenses correctly', async () => {
    const mockTripData = {
      title: 'Test Trip',
      dates: '1 Jan',
      currency: 'EUR',
      budget: 500,
      stops: [],
      expenses: [],
      tips: [],
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTripData),
      })
    );

    render(<Home />);

    await waitFor(() =>
      expect(screen.getByText(/test trip/i)).toBeInTheDocument()
    );

    // Add first expense
    const addButton = screen.getByRole('button', {
      name: /add expense/i,
    });
    fireEvent.click(addButton);

    // Set amount to 100
    const amountInput = screen.getAllByRole('textbox', {
      name: /amount/i,
    })[0];
    fireEvent.change(amountInput, { target: { value: '100' } });

    // Add second expense
    fireEvent.click(addButton);
    const amountInputs = screen.getAllByRole('textbox', {
      name: /amount/i,
    });
    fireEvent.change(amountInputs[1], { target: { value: '50' } });

    // Check total is calculated correctly
    await waitFor(() => {
      expect(
        screen.getByText(/€150\.00/)
      ).toBeInTheDocument(); // 100 + 50 = 150 EUR
    });
  });

  test('route optimization form works', async () => {
    const mockTripData = {
      title: 'Test Trip',
      dates: '1 Jan',
      currency: 'EUR',
      budget: 1000,
      stops: [],
      expenses: [],
      tips: [],
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTripData),
      })
    );

    render(<Home />);

    await waitFor(() =>
      expect(screen.getByText(/test trip/i)).toBeInTheDocument()
    );

    // Click Optimize Route button
    const optimizeButton = screen.getByRole('button', {
      name: /optimize route/i,
    });
    fireEvent.click(optimizeButton);

    // Form should open
    expect(screen.getByLabelText(/start/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/stops/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/transport/i)).toBeInTheDocument();

    // Fill in route details
    const startInput = screen.getByLabelText(/start/i);
    const endInput = screen.getByLabelText(/end/i);
    const stopsInput = screen.getByLabelText(/stops/i);
    const transportSelect = screen.getByLabelText(/transport/i);

    fireEvent.change(startInput, { target: { value: 'Paris' } });
    fireEvent.change(endInput, { target: { value: 'Marseille' } });
    fireEvent.change(stopsInput, { target: { value: 'Lyon, Nice' } });
    fireEvent.change(transportSelect, { target: { value: 'auto' } });

    // Mock API response for route optimization
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            route: ['Paris', 'Lyon', 'Nice', 'Marseille'],
            legs: [
              { from: 'Paris', to: 'Lyon', distance_km: 400 },
              { from: 'Lyon', to: 'Nice', distance_km: 300 },
              { from: 'Nice', to: 'Marseille', distance_km: 200 },
            ],
            total_distance_km: 900,
            estimated_hours: 8.5,
            estimated_cost: 120.50,
            recommended_transport: 'train',
          }),
      })
    );

    // Click Find Best Route button
    const findButton = screen.getByRole('button', {
      name: /find best route/i,
    });
    fireEvent.click(findButton);

    // Wait for results
    await waitFor(() => {
      expect(
        screen.getByText(/paris → lyon → nice → marseille/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/900\.0 km/)).toBeInTheDocument();
      expect(screen.getByText(/8\.5 h/)).toBeInTheDocument();
      expect(screen.getByText(/€120\.50/)).toBeInTheDocument();
    });
  });
});