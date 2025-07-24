
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VaccinationSchedule from '../VaccinationSchedule/VaccinationSchedule';

// Mock FullCalendar to simulate event click
jest.mock('@fullcalendar/react', () => {
  return jest.fn(({ events, eventClick }) => (
    <div>
      <div data-testid="calendar-mock">
        {events.map((event, idx) => (
          <button key={event.id} data-testid={`event-btn-${idx}`} onClick={() => eventClick({ event })}>
            {event.title}
          </button>
        ))}
      </div>
    </div>
  ));
});

describe('VaccinationSchedule', () => {
  it('renders calendar and events', () => {
    render(<VaccinationSchedule />);
    expect(screen.getByTestId('calendar-mock')).toBeInTheDocument();
    expect(screen.getByText(/Vaccine MMR Campaign/i)).toBeInTheDocument();
    expect(screen.getByText(/Health check campaign Winter 2025/i)).toBeInTheDocument();
  });

  it('opens and closes event details modal for vaccination event', async () => {
    render(<VaccinationSchedule />);
    // Click the first event (vaccination)
    fireEvent.click(screen.getByTestId('event-btn-0'));
    expect(await screen.findByText(/Event Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Vaccine MMR Campaign/i)).toBeInTheDocument();
    expect(screen.getByText(/Measles/i)).toBeInTheDocument();
    expect(screen.getByText(/PharmaCorp/i)).toBeInTheDocument();
    expect(screen.getByText(/Injection/i)).toBeInTheDocument();
    expect(screen.getByText(/Please bring your child's vaccination record/i)).toBeInTheDocument();
    // Close modal
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => {
      expect(screen.queryByText(/Event Details/i)).not.toBeInTheDocument();
    });
  });

  it('opens and closes event details modal for healthcheck event', async () => {
    render(<VaccinationSchedule />);
    // Click the second event (healthcheck)
    fireEvent.click(screen.getByTestId('event-btn-1'));
    expect(await screen.findByText(/Event Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Health check campaign Winter 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/Comprehensive health screening for all students/i)).toBeInTheDocument();
    expect(screen.getByText(/Bring any medical records or previous health reports/i)).toBeInTheDocument();
    expect(screen.getByText(/Oral/i)).toBeInTheDocument(); // healthcheck event has isInjected undefined, so not shown
    // Close modal
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => {
      expect(screen.queryByText(/Event Details/i)).not.toBeInTheDocument();
    });
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<VaccinationSchedule />);
    expect(asFragment()).toMatchSnapshot();
  });
});
