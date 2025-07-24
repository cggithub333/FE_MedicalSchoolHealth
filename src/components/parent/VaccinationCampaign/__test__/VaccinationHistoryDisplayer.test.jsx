
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VaccinationHistoryDisplayer from '../CampaignHistory/VaccinationHistoryDisplayer';

// Mock the hook
jest.mock('@hooks/parent/vaccination/useVaccinationHistoryByPupilId');
import useVaccinationHistoryByPupilId from '@hooks/parent/vaccination/useVaccinationHistoryByPupilId';

const pupilObj = {
  pupilId: 'p1',
  firstName: 'An',
  lastName: 'Nguyen',
  birthDate: '2012-01-01',
  gradeName: '5A',
};

const mockRecords = [
  {
    historyId: 'h1',
    diseaseName: 'Measles',
    vaccineName: 'MMR',
    campaignName: 'Spring 2025',
    vaccinatedAt: '2025-03-01T10:00:00Z',
    pupilName: 'Nguyen An',
    pupilId: 'p1',
    source: 'CAMPAIGN',
    notes: 'All good',
    active: true,
  },
  {
    historyId: 'h2',
    diseaseName: 'Flu',
    vaccineName: 'FluVax',
    campaignName: 'Winter 2024',
    vaccinatedAt: '2024-12-15T09:00:00Z',
    pupilName: 'Nguyen An',
    pupilId: 'p1',
    source: 'PARENT_DECLARATION',
    notes: '',
    active: true,
  },
  {
    historyId: 'h3',
    diseaseName: 'Inactive Disease',
    vaccineName: 'None',
    campaignName: 'Old',
    vaccinatedAt: '2023-01-01T09:00:00Z',
    pupilName: 'Nguyen An',
    pupilId: 'p1',
    source: 'CAMPAIGN',
    notes: '',
    active: false,
  },
];

describe('VaccinationHistoryDisplayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeleton when loading', () => {
    useVaccinationHistoryByPupilId.mockReturnValue({ vaccinationHistoryRecords: [], loading: true, error: null });
    render(<VaccinationHistoryDisplayer pupilObj={pupilObj} />);
    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);
  });

  it('renders error alert when error occurs', () => {
    useVaccinationHistoryByPupilId.mockReturnValue({ vaccinationHistoryRecords: [], loading: false, error: 'Error!' });
    render(<VaccinationHistoryDisplayer pupilObj={pupilObj} />);
    expect(screen.getByText(/An error occurred while loading vaccination history/i)).toBeInTheDocument();
  });

  it('renders student info and vaccination records', () => {
    useVaccinationHistoryByPupilId.mockReturnValue({ vaccinationHistoryRecords: mockRecords, loading: false, error: null });
    render(<VaccinationHistoryDisplayer pupilObj={pupilObj} />);
    expect(screen.getByText('Vaccination History')).toBeInTheDocument();
    expect(screen.getByText('Nguyen An - 5A')).toBeInTheDocument();
    expect(screen.getByText('Student ID')).toBeInTheDocument();
    expect(screen.getByText('Measles')).toBeInTheDocument();
    expect(screen.getByText('Flu')).toBeInTheDocument();
    expect(screen.queryByText('Inactive Disease')).not.toBeInTheDocument();
  });

  it('filters by disease name', () => {
    useVaccinationHistoryByPupilId.mockReturnValue({ vaccinationHistoryRecords: mockRecords, loading: false, error: null });
    render(<VaccinationHistoryDisplayer pupilObj={pupilObj} />);
    fireEvent.change(screen.getByLabelText(/search by disease name/i), { target: { value: 'Measles' } });
    expect(screen.getByText('Measles')).toBeInTheDocument();
    expect(screen.queryByText('Flu')).not.toBeInTheDocument();
  });

  it('filters by year', () => {
    useVaccinationHistoryByPupilId.mockReturnValue({ vaccinationHistoryRecords: mockRecords, loading: false, error: null });
    render(<VaccinationHistoryDisplayer pupilObj={pupilObj} />);
    fireEvent.change(screen.getByLabelText(/year/i), { target: { value: '2025' } });
    expect(screen.getByText('Measles')).toBeInTheDocument();
    expect(screen.queryByText('Flu')).not.toBeInTheDocument();
  });

  it('filters by source', () => {
    useVaccinationHistoryByPupilId.mockReturnValue({ vaccinationHistoryRecords: mockRecords, loading: false, error: null });
    render(<VaccinationHistoryDisplayer pupilObj={pupilObj} />);
    fireEvent.mouseDown(screen.getByLabelText(/source/i));
    fireEvent.click(screen.getByText(/Parent Declaration/i));
    expect(screen.getByText('Flu')).toBeInTheDocument();
    expect(screen.queryByText('Measles')).not.toBeInTheDocument();
  });

  it('shows no results found when filter returns empty', () => {
    useVaccinationHistoryByPupilId.mockReturnValue({ vaccinationHistoryRecords: mockRecords, loading: false, error: null });
    render(<VaccinationHistoryDisplayer pupilObj={pupilObj} />);
    fireEvent.change(screen.getByLabelText(/search by disease name/i), { target: { value: 'Nonexistent' } });
    expect(screen.getByText(/No results found/i)).toBeInTheDocument();
  });

  it('clears filters', () => {
    useVaccinationHistoryByPupilId.mockReturnValue({ vaccinationHistoryRecords: mockRecords, loading: false, error: null });
    render(<VaccinationHistoryDisplayer pupilObj={pupilObj} />);
    fireEvent.change(screen.getByLabelText(/search by disease name/i), { target: { value: 'Measles' } });
    fireEvent.click(screen.getByText(/Clear Filters/i));
    expect(screen.getByText('Measles')).toBeInTheDocument();
    expect(screen.getByText('Flu')).toBeInTheDocument();
  });

  it('quick filters by disease chip', () => {
    useVaccinationHistoryByPupilId.mockReturnValue({ vaccinationHistoryRecords: mockRecords, loading: false, error: null });
    render(<VaccinationHistoryDisplayer pupilObj={pupilObj} />);
    fireEvent.click(screen.getByText('Measles'));
    expect(screen.getByText('Measles')).toBeInTheDocument();
    expect(screen.queryByText('Flu')).not.toBeInTheDocument();
  });

  it('opens and closes detail dialog', async () => {
    useVaccinationHistoryByPupilId.mockReturnValue({ vaccinationHistoryRecords: mockRecords, loading: false, error: null });
    render(<VaccinationHistoryDisplayer pupilObj={pupilObj} />);
    fireEvent.click(screen.getByText('Measles'));
    // Click the card for Measles
    fireEvent.click(screen.getAllByText('Measles')[1]);
    expect(screen.getByText('Vaccination Details')).toBeInTheDocument();
    // Close dialog
    fireEvent.click(screen.getAllByRole('button', { name: /close/i })[0]);
    await waitFor(() => {
      expect(screen.queryByText('Vaccination Details')).not.toBeInTheDocument();
    });
  });

  it('matches snapshot', () => {
    useVaccinationHistoryByPupilId.mockReturnValue({ vaccinationHistoryRecords: mockRecords, loading: false, error: null });
    const { asFragment } = render(<VaccinationHistoryDisplayer pupilObj={pupilObj} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
