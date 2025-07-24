
import React from 'react';
import { render, screen } from '@testing-library/react';
import HealthCheckHistory from '../HealthCheckHistory';

// Mock child components to isolate HealthCheckHistory
jest.mock('../../../../components/parent/FloatingFilterBar', () => () => <div data-testid="FloatingFilterBar" />);
jest.mock('../../../../components/magic/Breadcrumb/CustomBreadcrumb', () => ({ breadcrumbPairs }) => <div data-testid="Breadcrumb">{breadcrumbPairs && breadcrumbPairs[0]?.title}</div>);
jest.mock('../../../../components/magic/CustomTittle/CustomTitle', () => ({ title }) => <div data-testid="CustomTittle">{title}</div>);
jest.mock('../../../../components/parent/HealthCheckCampaign/HistoryByPupilBySchoolYear', () => () => <div data-testid="HistoryByPupilBySchoolYear" />);

describe('HealthCheckHistory page', () => {
  it('renders all main sections and child components', () => {
    render(<HealthCheckHistory />);
    expect(screen.getByTestId('Breadcrumb')).toBeInTheDocument();
    expect(screen.getByTestId('CustomTittle')).toHaveTextContent('Health Check History');
    expect(screen.getByTestId('HistoryByPupilBySchoolYear')).toBeInTheDocument();
  });

  it('renders the correct breadcrumb titles', () => {
    render(<HealthCheckHistory />);
    expect(screen.getByTestId('Breadcrumb')).toHaveTextContent('Dashboard');
  });

  it('applies the correct styles to the root div', () => {
    const { container } = render(<HealthCheckHistory />);
    const rootDiv = container.firstChild;
    expect(rootDiv).toHaveStyle('background: #e6f8f9');
    expect(rootDiv).toHaveStyle('padding-top: 20px');
    expect(rootDiv).toHaveStyle('padding-bottom: 100px');
  });

  it('renders ThemeProvider and CssBaseline', () => {
    render(<HealthCheckHistory />);
    // CssBaseline injects a <style> tag, so we can check for it
    const styleTags = document.querySelectorAll('style');
    expect(styleTags.length).toBeGreaterThan(0);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<HealthCheckHistory />);
    expect(asFragment()).toMatchSnapshot();
  });
});
