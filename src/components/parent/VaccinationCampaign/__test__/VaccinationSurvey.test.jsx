
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VaccinationSurvey from '../LatestCampaign/VaccinationSurvey';

// Mock hooks and utils
jest.mock('@hooks/parent/vaccination/useAllVaccinationSurveys');
jest.mock('@hooks/parent/vaccination/useUpdateVaccineSurveyStatus');
jest.mock('@hooks/parent/vaccination/useLatestVaccinationcampaign');
jest.mock('@utils/toast-utils', () => ({
  showErrorToast: jest.fn(),
  showSuccessToast: jest.fn(),
}));

import useAllVaccinationSurveys from '@hooks/parent/vaccination/useAllVaccinationSurveys';
import useUpdateVaccineSurveyStatus from '@hooks/parent/vaccination/useUpdateVaccineSurveyStatus';
import useLatestVaccinationCampaign from '@hooks/parent/vaccination/useLatestVaccinationcampaign';
import { showErrorToast, showSuccessToast } from '@utils/toast-utils';

const mockSurveys = [
  {
    consentFormId: 'cf1',
    pupilId: 'p1',
    pupilName: 'Nguyen An',
    gradeLevel: 'GRADE_1',
    diseaseName: 'Measles',
    vaccineName: 'MMR',
    formDeadline: '2025-08-01T00:00:00Z',
    campaignName: 'Spring 2025',
    status: 'APPROVED',
    currDoseNumber: 0,
    doseNumber: 2,
  },
  {
    consentFormId: 'cf2',
    pupilId: 'p2',
    pupilName: 'Le Bao',
    gradeLevel: 'GRADE_2',
    diseaseName: 'Flu',
    vaccineName: 'FluVax',
    formDeadline: '2025-08-10T00:00:00Z',
    campaignName: 'Winter 2025',
    status: 'REJECTED',
    currDoseNumber: 1,
    doseNumber: 2,
  },
];

const mockUpdate = jest.fn();

describe('VaccinationSurvey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUpdateVaccineSurveyStatus.mockReturnValue({ updateStatus: mockUpdate, loading: false, error: null, responseData: {} });
    useLatestVaccinationCampaign.mockReturnValue({ latestCampaign: { campaign: { campaignId: 1 } }, loading: false, error: null });
  });

  it('renders loading skeleton when loading', () => {
    useAllVaccinationSurveys.mockReturnValue({ vaccinationSurveys: [], loading: true, error: null, refetch: jest.fn() });
    render(<VaccinationSurvey />);
    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);
  });

  it('renders error alert when error occurs', () => {
    useAllVaccinationSurveys.mockReturnValue({ vaccinationSurveys: [], loading: false, error: 'Error!', refetch: jest.fn() });
    render(<VaccinationSurvey />);
    expect(screen.getByText(/Có lỗi xảy ra khi tải danh sách khảo sát tiêm chủng/i)).toBeInTheDocument();
    expect(screen.getByText(/Error!/i)).toBeInTheDocument();
  });

  it('renders no surveys card when no data', () => {
    useAllVaccinationSurveys.mockReturnValue({ vaccinationSurveys: [], loading: false, error: null, refetch: jest.fn() });
    render(<VaccinationSurvey />);
    expect(screen.getByText(/No Vaccination Surveys/i)).toBeInTheDocument();
    expect(screen.getByText(/no vaccination surveys available/i)).toBeInTheDocument();
  });

  it('renders survey cards', () => {
    useAllVaccinationSurveys.mockReturnValue({ vaccinationSurveys: mockSurveys, loading: false, error: null, refetch: jest.fn() });
    render(<VaccinationSurvey />);
    expect(screen.getByText('Nguyen An')).toBeInTheDocument();
    expect(screen.getByText('Le Bao')).toBeInTheDocument();
    expect(screen.getAllByText('Measles').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Flu').length).toBeGreaterThan(0);
    expect(screen.getAllByText('MMR').length).toBeGreaterThan(0);
    expect(screen.getAllByText('FluVax').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Approved').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Rejected').length).toBeGreaterThan(0);
  });

  it('opens and closes survey detail dialog', () => {
    useAllVaccinationSurveys.mockReturnValue({ vaccinationSurveys: mockSurveys, loading: false, error: null, refetch: jest.fn() });
    render(<VaccinationSurvey />);
    fireEvent.click(screen.getByText('Nguyen An'));
    expect(screen.getByText(/Vaccination Survey Details/i)).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: /close/i })[0]);
    expect(screen.queryByText(/Vaccination Survey Details/i)).not.toBeInTheDocument();
  });

  it('shows confirmation checkbox and disables approve/reject until checked', () => {
    useAllVaccinationSurveys.mockReturnValue({ vaccinationSurveys: mockSurveys, loading: false, error: null, refetch: jest.fn() });
    render(<VaccinationSurvey />);
    fireEvent.click(screen.getByText('Nguyen An'));
    expect(screen.getByText(/I confirm that I have read and understood/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Approve/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Reject/i })).toBeDisabled();
    fireEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('button', { name: /Approve/i })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: /Reject/i })).not.toBeDisabled();
  });

  it('calls updateStatus and shows success toast on approve', async () => {
    useAllVaccinationSurveys.mockReturnValue({ vaccinationSurveys: mockSurveys, loading: false, error: null, refetch: jest.fn() });
    mockUpdate.mockResolvedValueOnce({});
    render(<VaccinationSurvey />);
    fireEvent.click(screen.getByText('Nguyen An'));
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /Approve/i }));
    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith('cf1', 'APPROVED');
      expect(showSuccessToast).toHaveBeenCalled();
    });
  });

  it('calls updateStatus and shows success toast on reject', async () => {
    useAllVaccinationSurveys.mockReturnValue({ vaccinationSurveys: mockSurveys, loading: false, error: null, refetch: jest.fn() });
    mockUpdate.mockResolvedValueOnce({});
    render(<VaccinationSurvey />);
    fireEvent.click(screen.getByText('Nguyen An'));
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /Reject/i }));
    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith('cf1', 'REJECTED');
      expect(showSuccessToast).toHaveBeenCalled();
    });
  });

  it('shows error toast if already approved/rejected', async () => {
    useAllVaccinationSurveys.mockReturnValue({ vaccinationSurveys: mockSurveys, loading: false, error: null, refetch: jest.fn() });
    render(<VaccinationSurvey />);
    fireEvent.click(screen.getByText('Nguyen An'));
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /Approve/i }));
    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalled();
    });
  });

  it('shows info alert if latestCampaign is null', () => {
    useAllVaccinationSurveys.mockReturnValue({ vaccinationSurveys: mockSurveys, loading: false, error: null, refetch: jest.fn() });
    useLatestVaccinationCampaign.mockReturnValue({ latestCampaign: null, loading: false, error: null });
    render(<VaccinationSurvey />);
    fireEvent.click(screen.getByText('Nguyen An'));
    expect(screen.getByText(/The vaccination campaign is in progress or completed already/i)).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    useAllVaccinationSurveys.mockReturnValue({ vaccinationSurveys: mockSurveys, loading: false, error: null, refetch: jest.fn() });
    const { asFragment } = render(<VaccinationSurvey />);
    expect(asFragment()).toMatchSnapshot();
  });
});
