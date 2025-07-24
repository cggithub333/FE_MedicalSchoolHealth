
import React from 'react';
import { render, screen } from '@testing-library/react';
import Campaigns from '../Campaigns';

// Mock child components to isolate Campaigns
jest.mock('@components/parent/VaccinationCampaign/LatestCampaign/LatestVaccinationCampaign', () => () => <div data-testid="LatestVaccinationCampaign" />);
jest.mock('@components/magic/Breadcrumb/CustomBreadcrumb', () => ({ breadcrumbPairs }) => <div data-testid="Breadcrumb">{breadcrumbPairs && breadcrumbPairs[0]?.title}</div>);
jest.mock('@components/magic/CustomTittle/CustomTitle', () => ({ title }) => <div data-testid="CustomTittle">{title}</div>);

describe('Vaccination Campaigns page', () => {
  it('renders all main sections and child components', () => {
    render(<Campaigns />);
    expect(screen.getByTestId('Breadcrumb')).toBeInTheDocument();
    expect(screen.getByTestId('CustomTittle')).toHaveTextContent('Vaccination Campaign');
    expect(screen.getByTestId('LatestVaccinationCampaign')).toBeInTheDocument();
  });

  it('renders the correct breadcrumb titles', () => {
    render(<Campaigns />);
    expect(screen.getByTestId('Breadcrumb')).toHaveTextContent('Dashboard');
  });

  it('applies the correct styles to the root div', () => {
    const { container } = render(<Campaigns />);
    const rootDiv = container.firstChild;
    expect(rootDiv).toHaveStyle('background: #E6F8F9');
    expect(rootDiv).toHaveStyle('padding-top: 10px');
    expect(rootDiv).toHaveStyle('padding-bottom: 50px');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Campaigns />);
    expect(asFragment()).toMatchSnapshot();
  });
});
