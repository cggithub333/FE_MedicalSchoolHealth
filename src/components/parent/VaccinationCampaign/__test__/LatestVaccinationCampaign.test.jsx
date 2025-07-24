
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LatestVaccinationCampaign from '../LatestCampaign/LatestVaccinationCampaign';

// Mock the hook
jest.mock('@hooks/parent/vaccination/useLatestVaccinationcampaign');
import useLatestVaccinationCampaign from '@hooks/parent/vaccination/useLatestVaccinationcampaign';

const mockCampaign = {
  campaign: {
    campaignId: 123,
    campaignStatus: 'Published',
    status: 'Pending',
    disease: {
      name: 'Measles',
      description: 'A viral disease',
      doseQuantity: 2,
      isInjectedVaccine: true,
    },
    vaccine: {
      name: 'MMR',
      manufacturer: 'VaxCo',
      recommendedAge: '5-7',
    },
    consentFormDeadline: '2025-08-01T00:00:00Z',
    startDate: '2025-08-10T00:00:00Z',
    endDate: '2025-08-20T00:00:00Z',
    notes: 'Bring your consent form.',
  },
};

describe('LatestVaccinationCampaign', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeleton when loading', () => {
    useLatestVaccinationCampaign.mockReturnValue({ latestCampaign: null, loading: true, error: null });
    render(<LatestVaccinationCampaign />);
    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);
  });

  it('renders error alert when error occurs', () => {
    useLatestVaccinationCampaign.mockReturnValue({ latestCampaign: null, loading: false, error: 'Error!' });
    render(<LatestVaccinationCampaign />);
    expect(screen.getByText(/An error occurred while loading vaccination campaign information/i)).toBeInTheDocument();
    expect(screen.getByText(/Error!/i)).toBeInTheDocument();
    expect(screen.getByText(/Try again/i)).toBeInTheDocument();
  });

  it('renders no campaign available when latestCampaign.campaign is missing', () => {
    useLatestVaccinationCampaign.mockReturnValue({ latestCampaign: {}, loading: false, error: null });
    render(<LatestVaccinationCampaign />);
    expect(screen.getByText(/No Vaccination Campaign Available/i)).toBeInTheDocument();
    expect(screen.getByText(/no vaccination campaigns published/i)).toBeInTheDocument();
  });

  it('renders campaign details and notes', () => {
    useLatestVaccinationCampaign.mockReturnValue({ latestCampaign: mockCampaign, loading: false, error: null });
    render(<LatestVaccinationCampaign />);
    expect(screen.getByText(/Newest Vaccination Campaign/i)).toBeInTheDocument();
    expect(screen.getByText(/Campaign #123/i)).toBeInTheDocument();
    expect(screen.getByText('Measles')).toBeInTheDocument();
    expect(screen.getByText('A viral disease')).toBeInTheDocument();
    expect(screen.getByText('2 doses')).toBeInTheDocument();
    expect(screen.getByText('Injectable Vaccine')).toBeInTheDocument();
    expect(screen.getByText('MMR')).toBeInTheDocument();
    expect(screen.getByText('VaxCo')).toBeInTheDocument();
    expect(screen.getByText('5-7')).toBeInTheDocument();
    expect(screen.getByText('Bring your consent form.')).toBeInTheDocument();
    expect(screen.getByText('Consent Form Deadline')).toBeInTheDocument();
    expect(screen.getByText('Start Examination Date')).toBeInTheDocument();
    expect(screen.getByText('End Examination Date')).toBeInTheDocument();
  });

  it('shows Pending alert if campaign.status is Pending', () => {
    useLatestVaccinationCampaign.mockReturnValue({ latestCampaign: mockCampaign, loading: false, error: null });
    render(<LatestVaccinationCampaign />);
    expect(screen.getByText(/Please submit the consent form before/i)).toBeInTheDocument();
  });

  it('does not show Pending alert if campaign.status is not Pending', () => {
    const campaign = { ...mockCampaign, campaign: { ...mockCampaign.campaign, status: 'Completed' } };
    useLatestVaccinationCampaign.mockReturnValue({ latestCampaign: campaign, loading: false, error: null });
    render(<LatestVaccinationCampaign />);
    expect(screen.queryByText(/Please submit the consent form before/i)).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    useLatestVaccinationCampaign.mockReturnValue({ latestCampaign: mockCampaign, loading: false, error: null });
    const { asFragment } = render(<LatestVaccinationCampaign />);
    expect(asFragment()).toMatchSnapshot();
  });
});
