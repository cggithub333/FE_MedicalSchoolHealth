
import React from 'react';
import { render, screen } from '@testing-library/react';
import Campaigns from '../Campaigns';

// Mock child components to isolate Campaigns
jest.mock('../../../../components/parent/HealthCheckCampaignCard/HealthCheckCampaignsCard', () => () => <div data-testid="HealthCheckCampaignCard" />);
jest.mock('../../../../components/magic/Breadcrumb/CustomBreadcrumb', () => ({ breadcrumbPairs }) => <div data-testid="Breadcrumb">{breadcrumbPairs && breadcrumbPairs[0]?.title}</div>);
jest.mock('../../../../components/magic/CustomTittle/CustomTitle', () => ({ title }) => <div data-testid="CustomTittle">{title}</div>);

describe('Campaigns page', () => {
  it('renders without crashing and displays all main sections', () => {
    render(<Campaigns />);
    // Check for background and layout
    expect(screen.getByTestId('Breadcrumb')).toBeInTheDocument();
    expect(screen.getByTestId('CustomTittle')).toHaveTextContent('Health Check Campaign');
    expect(screen.getByTestId('HealthCheckCampaignCard')).toBeInTheDocument();
  });

  it('renders the correct breadcrumb titles', () => {
    render(<Campaigns />);
    // The first breadcrumb should be Dashboard
    expect(screen.getByTestId('Breadcrumb')).toHaveTextContent('Dashboard');
  });

  it('applies the correct styles to the root div', () => {
    const { container } = render(<Campaigns />);
    const rootDiv = container.firstChild;
    expect(rootDiv).toHaveStyle('background: #e6f8f9');
    expect(rootDiv).toHaveStyle('padding-top: 20px');
    expect(rootDiv).toHaveStyle('padding-bottom: 50px');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Campaigns />);
    expect(asFragment()).toMatchSnapshot();
  });
});
