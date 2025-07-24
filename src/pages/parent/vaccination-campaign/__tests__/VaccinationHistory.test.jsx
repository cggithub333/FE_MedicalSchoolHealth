
import React from 'react';
import { render, screen } from '@testing-library/react';
import VaccinationHistory from '../VaccinationHistory';

// Mock child components to isolate VaccinationHistory
jest.mock('@components/magic/Breadcrumb/CustomBreadcrumb', () => ({ breadcrumbPairs }) => <div data-testid="Breadcrumb">{breadcrumbPairs && breadcrumbPairs[0]?.title}</div>);
jest.mock('@components/magic/CustomTittle/CustomTitle', () => ({ title }) => <div data-testid="CustomTittle">{title}</div>);
jest.mock('@components/parent/VaccinationCampaign/CampaignHistory/VaccinationHistoryDisplayer', () => ({ pupilObj }) => <div data-testid="VaccinationHistoryDisplayer">{pupilObj ? pupilObj.firstName : ''}</div>);
jest.mock('@components/magic/FloatingNavigateButton/FloatingNavigateButton', () => ({ textContent }) => <div data-testid="FloatingNavigateButton">{textContent}</div>);
jest.mock('@assets/images/instruct_choose_child.png', () => 'mocked-image-path');

describe('VaccinationHistory page', () => {
  const pupilObj = { firstName: 'An', lastName: 'Nguyen', id: 'p1' };
  const encodedPupil = window.btoa(JSON.stringify(pupilObj));

  beforeEach(() => {
    localStorage.clear();
  });

  it('renders all main sections and child components when pupil is selected', () => {
    localStorage.setItem('pupilInfor', encodedPupil);
    render(<VaccinationHistory />);
    expect(screen.getByTestId('Breadcrumb')).toBeInTheDocument();
    expect(screen.getByTestId('CustomTittle')).toHaveTextContent('Vaccination History');
    expect(screen.getByTestId('VaccinationHistoryDisplayer')).toHaveTextContent('An');
    expect(screen.getByTestId('FloatingNavigateButton')).toHaveTextContent('Declare');
  });

  it('renders notification message when no pupil is selected', () => {
    localStorage.removeItem('pupilInfor');
    render(<VaccinationHistory />);
    expect(screen.getByText(/Please select a child to view their vaccination history/i)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'mocked-image-path');
  });

  it('renders the correct breadcrumb titles', () => {
    localStorage.setItem('pupilInfor', encodedPupil);
    render(<VaccinationHistory />);
    expect(screen.getByTestId('Breadcrumb')).toHaveTextContent('Dashboard');
  });

  it('applies the correct styles to the root div', () => {
    localStorage.setItem('pupilInfor', encodedPupil);
    const { container } = render(<VaccinationHistory />);
    const rootDiv = container.firstChild;
    expect(rootDiv).toHaveStyle('background: #e6f8f9');
    expect(rootDiv).toHaveStyle('padding-top: 20px');
    expect(rootDiv).toHaveStyle('padding-bottom: 100px');
  });

  it('matches snapshot', () => {
    localStorage.setItem('pupilInfor', encodedPupil);
    const { asFragment } = render(<VaccinationHistory />);
    expect(asFragment()).toMatchSnapshot();
  });
});
