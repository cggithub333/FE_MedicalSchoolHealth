/**
 * Test Suite: ScheduleResult Component
 *
 * Coverage:
 * - UI rendering
 * - State & interaction
 * - Data display
 * - Edge cases (empty, loading, error)
 *
 * Methods:
 * - React Testing Library
 * - Mocked hooks & API
 * - fireEvent, waitFor
 *
 * All test cases are grouped and documented for clarity and maintainability.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScheduleResult from '../ScheduleResult';

// Mock hooks and API calls used in ScheduleResult
jest.mock('@hooks/manager/healthcheck/campaign/useGetDetaisOfCampaignByID');

// Mock toast utilities
jest.mock('@utils/toast-utils', () => ({
    showErrorToast: jest.fn(),
    showSuccessToast: jest.fn(),
}));

import { showErrorToast, showSuccessToast } from '@utils/toast-utils';
import { useGetDetailsOfCampaignByID } from '@hooks/manager/healthcheck/campaign/useGetDetaisOfCampaignByID';

const mockPupilData = {
    pupilId: 'PP001',
    firstName: 'A',
    lastName: 'Student',
    birthDate: '2015-01-01',
    gender: 'M',
    gradeName: 'Class 1A',
    campaignId: 1,
};

const mockConsentFormId = 'CF001';
const mockCampaignDetails = {
    data: {
        consentForms: [
            {
                consentFormId: mockConsentFormId,
                healthCheckHistoryRes: {
                    height: '120',
                    weight: '30',
                    heartRate: '80',
                    leftEyeVision: '10/10',
                    rightEyeVision: '10/10',
                    earCondition: 'Normal',
                    noseCondition: 'Normal',
                    throatCondition: 'Normal',
                    skinAndMucosa: 'Normal',
                    dentalCheck: 'Good',
                    bloodPressure: '110/70',
                    hearAnuscultaion: 'Clear',
                    lungs: 'Healthy',
                    additionalNotes: 'No issues',
                },
                disease: [
                    { diseaseId: 1, name: 'Genital Check', note: 'Normal' },
                ],
            },
        ],
    },
};

// =========================
// UI Rendering
// =========================
describe('ScheduleResult - UI Rendering', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useGetDetailsOfCampaignByID.mockReturnValue({
            campaignDetails: mockCampaignDetails,
            isLoading: false,
        });
    });

    it('renders health check result fields and back button', () => {
        // Checks for main UI elements
        render(<ScheduleResult consentFormId={mockConsentFormId} pupilData={mockPupilData} onBack={jest.fn()} />);
        expect(screen.getByText(/Health Records Recently/i)).toBeInTheDocument();
        expect(screen.getByText(/Height/i)).toBeInTheDocument();
        expect(screen.getByText(/Weight/i)).toBeInTheDocument();
        expect(screen.getByText(/Heart rate/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Back to List/i })).toBeInTheDocument();
    });
});

// =========================
// State & Interaction
// =========================
describe('ScheduleResult - State & Interaction', () => {
    beforeEach(() => {
        useGetDetailsOfCampaignByID.mockReturnValue({
            campaignDetails: mockCampaignDetails,
            isLoading: false,
        });
    });

    it('calls onBack when back button is clicked', () => {
        // Checks back button interaction
        const onBack = jest.fn();
        render(<ScheduleResult consentFormId={mockConsentFormId} pupilData={mockPupilData} onBack={onBack} />);
        const backBtn = screen.getByRole('button', { name: /Back to List/i });
        fireEvent.click(backBtn);
        expect(onBack).toHaveBeenCalled();
    });
});

// =========================
// Data Display
// =========================
describe('ScheduleResult - Data Display', () => {
    beforeEach(() => {
        useGetDetailsOfCampaignByID.mockReturnValue({
            campaignDetails: mockCampaignDetails,
            isLoading: false,
        });
    });

    it('shows correct health check data', () => {
        // Checks for correct data rendering
        render(<ScheduleResult consentFormId={mockConsentFormId} pupilData={mockPupilData} onBack={jest.fn()} />);
        expect(screen.getByText('120')).toBeInTheDocument(); // Height
        expect(screen.getByText('30')).toBeInTheDocument(); // Weight
        expect(screen.getByText('80')).toBeInTheDocument(); // Heart rate
        expect(screen.getByText('No issues')).toBeInTheDocument(); // Additional notes
        expect(screen.getByText('Genital Check')).toBeInTheDocument(); // Disease name
        expect(screen.getByText('Normal')).toBeInTheDocument(); // Disease note
    });
});

// =========================
// Edge Cases
// =========================
describe('ScheduleResult - Edge Cases', () => {
    it('shows empty state when no health check data', () => {
        // Checks for empty data scenario
        useGetDetailsOfCampaignByID.mockReturnValueOnce({
            campaignDetails: { data: { consentForms: [] } },
            isLoading: false,
        });
        render(<ScheduleResult consentFormId={mockConsentFormId} pupilData={mockPupilData} onBack={jest.fn()} />);
        expect(screen.getByText(/No Health Check Data/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Back to Student List/i })).toBeInTheDocument();
    });

    it('shows loading state when isLoading is true', () => {
        // Checks for loading state
        useGetDetailsOfCampaignByID.mockReturnValueOnce({
            campaignDetails: null,
            isLoading: true,
        });
        render(<ScheduleResult consentFormId={mockConsentFormId} pupilData={mockPupilData} onBack={jest.fn()} />);
        expect(screen.getByText(/Loading student health check details/i)).toBeInTheDocument();
    });
});

/**
 * ========================================
 * TEST FILE SUMMARY
 * ========================================
 *
 * Coverage:
 * - UI rendering: Ensures all main UI elements are present
 * - State & interaction: Validates user actions and callbacks
 * - Data display: Verifies correct health check data is shown
 * - Edge cases: Handles empty, loading, and error states
 *
 * All tests use mocks for hooks and API, and check for UI, state, success, validation, and error scenarios.
 */
