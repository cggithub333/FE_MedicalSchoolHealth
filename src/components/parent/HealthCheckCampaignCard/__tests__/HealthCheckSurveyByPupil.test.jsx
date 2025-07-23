import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HealthCheckSurveyByPupil from '../HealthCheckSurveyByPupil';

// Mock the hooks used in the component
jest.mock('@hooks/parent/useLatestHealthCheckCampaign');
jest.mock('@hooks/parent/health-check/useSendHealthCheckSurvey');

// Mock toast utilities
jest.mock('@utils/toast-utils', () => ({
  showErrorToast: jest.fn(),
  showSuccessToast: jest.fn(),
}));

// Import the mocked hooks and utilities
import useLatestHealthCheckCampaign from '@hooks/parent/useLatestHealthCheckCampaign';
import useSendHealthCheckSurvey from '@hooks/parent/health-check/useSendHealthCheckSurvey';
import { showErrorToast, showSuccessToast } from '@utils/toast-utils';

describe('HealthCheckSurveyByPupil', () => {
  
  // Mock data
  const mockCurrentPupil = {
    pupilId: "PP0006",
    lastName: "Hoàng",
    firstName: "Em",
    birthDate: "12-01-2018",
    gender: "M",
    gradeId: 1,
    startYear: 2025,
    gradeLevel: "GRADE_1",
    gradeName: "Lớp 1D",
  };

  const mockHealthCampaign = {
    campaignId: 1,
    title: "Health Check Campaign Winter 2025",
    description: "Annual health examination for students",
    address: "ABC School",
    startExaminationDate: "2025-07-28T08:00:00",
    endExaminationDate: "2025-08-02T17:00:00",
    statusHealthCampaign: "PUBLISHED",
    diseases: [
      {
        diseaseId: 1,
        name: "Breast Screening",
        description: "Basic breast exam for health education"
      },
      {
        diseaseId: 2,
        name: "Genital Checkup",
        description: "Private part examination for hygiene awareness"
      }
    ]
  };

  const mockSendHealthCheckSurvey = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementations
    useLatestHealthCheckCampaign.mockReturnValue({
      latestHealthCheckCampaign: mockHealthCampaign,
      isLoading: false,
      refetch: jest.fn(),
      error: null
    });

    useSendHealthCheckSurvey.mockReturnValue({
      sendHealthCheckSurvey: mockSendHealthCheckSurvey,
      loading: false,
      error: null
    });

    // Suppress console logs in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console methods after each test
    console.log.mockRestore();
    console.error.mockRestore();
  });

  // 1. Test UI rendering ban đầu
  describe('Initial Rendering', () => {
    test('renders campaign card with student information', () => {
      render(<HealthCheckSurveyByPupil currentPupil={mockCurrentPupil} />);
      
      // Check main elements
      expect(screen.getByText('Health Check Survey')).toBeInTheDocument();
      expect(screen.getByText(mockHealthCampaign.title)).toBeInTheDocument();
      expect(screen.getByText('Student Information')).toBeInTheDocument();
      
      // Check student details
      expect(screen.getByText(mockCurrentPupil.pupilId)).toBeInTheDocument();
      expect(screen.getByText(`${mockCurrentPupil.lastName} ${mockCurrentPupil.firstName}`)).toBeInTheDocument();
      expect(screen.getByText(mockCurrentPupil.birthDate)).toBeInTheDocument();
      expect(screen.getByText(mockCurrentPupil.gradeName)).toBeInTheDocument();
    });

    test('renders examination period information', () => {
      render(<HealthCheckSurveyByPupil currentPupil={mockCurrentPupil} />);
      
      expect(screen.getByText('Examination Period')).toBeInTheDocument();
      expect(screen.getByText('Start Date')).toBeInTheDocument();
      expect(screen.getByText('End Date')).toBeInTheDocument();
    });

    test('renders click to continue message', () => {
      render(<HealthCheckSurveyByPupil currentPupil={mockCurrentPupil} />);
      
      expect(screen.getByText('Click to review and confirm examination details')).toBeInTheDocument();
    });
  });

  // 2. Test state: mở dialog khi click vào card
  describe('Dialog Interaction', () => {
    test('opens dialog when card is clicked', () => {
      render(<HealthCheckSurveyByPupil currentPupil={mockCurrentPupil} />);
      
      // Initially dialog should not be visible
      expect(screen.queryByText('Health Check Consent Form')).not.toBeInTheDocument();
      
      // Click on the card
      const card = screen.getByText('Click to review and confirm examination details').closest('.MuiCard-root');
      fireEvent.click(card);
      
      // Dialog should now be visible
      expect(screen.getByText('Health Check Consent Form')).toBeInTheDocument();
    });

    test('closes dialog when close button is clicked', () => {
      render(<HealthCheckSurveyByPupil currentPupil={mockCurrentPupil} />);
      
      // Open dialog
      const card = screen.getByText('Click to review and confirm examination details').closest('.MuiCard-root');
      fireEvent.click(card);
      
      // Close dialog
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      // Dialog should be closed
      expect(screen.queryByText('Health Check Consent Form')).not.toBeInTheDocument();
    });

    test('closes dialog when cancel button is clicked', () => {
      render(<HealthCheckSurveyByPupil currentPupil={mockCurrentPupil} />);
      
      // Open dialog
      const card = screen.getByText('Click to review and confirm examination details').closest('.MuiCard-root');
      fireEvent.click(card);
      
      // Close dialog with cancel
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);
      
      // Dialog should be closed
      expect(screen.queryByText('Health Check Consent Form')).not.toBeInTheDocument();
    });
  });

  // 3. Test dialog content rendering
  describe('Dialog Content', () => {
    beforeEach(() => {
      render(<HealthCheckSurveyByPupil currentPupil={mockCurrentPupil} />);
      
      // Open dialog
      const card = screen.getByText('Click to review and confirm examination details').closest('.MuiCard-root');
      fireEvent.click(card);
    });

    test('renders student information in dialog', () => {
      expect(screen.getAllByText('Student Information')).toHaveLength(2); // One in card, one in dialog
      expect(screen.getAllByText(mockCurrentPupil.pupilId)).toHaveLength(2);
      expect(screen.getAllByText(`${mockCurrentPupil.lastName} ${mockCurrentPupil.firstName}`)).toHaveLength(2);
    });

    test('renders campaign information in dialog', () => {
      expect(screen.getByText(`Campaign: ${mockHealthCampaign.title}`)).toBeInTheDocument();
      expect(screen.getByText(mockHealthCampaign.description)).toBeInTheDocument();
      expect(screen.getByText(mockHealthCampaign.address)).toBeInTheDocument();
    });

    test('renders disease checkboxes', () => {
      expect(screen.getByText('Sensitive diseases')).toBeInTheDocument();
      expect(screen.getByText('Breast Screening')).toBeInTheDocument();
      expect(screen.getByText('Genital Checkup')).toBeInTheDocument();
      
      // Check that checkboxes are present
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3); // 2 diseases + 1 agreement
    });

    test('renders agreement checkbox', () => {
      expect(screen.getByText('I agree to the selected examinations')).toBeInTheDocument();
    });
  });

  // 4. Test state: disease selection
  describe('Disease Selection', () => {
    beforeEach(() => {
      render(<HealthCheckSurveyByPupil currentPupil={mockCurrentPupil} />);
      
      // Open dialog
      const card = screen.getByText('Click to review and confirm examination details').closest('.MuiCard-root');
      fireEvent.click(card);
    });

    test('selects and deselects diseases correctly', () => {
      const breastCheckbox = screen.getByRole('checkbox', { name: /breast screening/i });
      const genitalCheckbox = screen.getByRole('checkbox', { name: /genital checkup/i });
      
      // Initially unchecked
      expect(breastCheckbox).not.toBeChecked();
      expect(genitalCheckbox).not.toBeChecked();
      
      // Select breast screening
      fireEvent.click(breastCheckbox);
      expect(breastCheckbox).toBeChecked();
      
      // Select genital checkup
      fireEvent.click(genitalCheckbox);
      expect(genitalCheckbox).toBeChecked();
      
      // Deselect breast screening
      fireEvent.click(breastCheckbox);
      expect(breastCheckbox).not.toBeChecked();
      expect(genitalCheckbox).toBeChecked();
    });

    test('shows warning when no diseases are selected', () => {
      expect(screen.getByText('Please select at least one examination area to proceed.')).toBeInTheDocument();
    });
  });

  // 5. Test state: agreement checkbox
  describe('Agreement Checkbox', () => {
    beforeEach(() => {
      render(<HealthCheckSurveyByPupil currentPupil={mockCurrentPupil} />);
      
      // Open dialog
      const card = screen.getByText('Click to review and confirm examination details').closest('.MuiCard-root');
      fireEvent.click(card);
    });

    test('toggles agreement checkbox correctly', () => {
      const agreementCheckbox = screen.getByRole('checkbox', { name: /i agree to the selected examinations/i });
      
      // Initially unchecked
      expect(agreementCheckbox).not.toBeChecked();
      
      // Check agreement
      fireEvent.click(agreementCheckbox);
      expect(agreementCheckbox).toBeChecked();
      
      // Uncheck agreement
      fireEvent.click(agreementCheckbox);
      expect(agreementCheckbox).not.toBeChecked();
    });

    test('shows info message when diseases selected but agreement not checked', () => {
      // Select a disease first
      const breastCheckbox = screen.getByRole('checkbox', { name: /breast screening/i });
      fireEvent.click(breastCheckbox);
      
      expect(screen.getByText('Please confirm your agreement to proceed with the submission.')).toBeInTheDocument();
    });
  });

  // 6. Test submit button states
  describe('Submit Button States', () => {
    beforeEach(() => {
      render(<HealthCheckSurveyByPupil currentPupil={mockCurrentPupil} />);
      
      // Open dialog
      const card = screen.getByText('Click to review and confirm examination details').closest('.MuiCard-root');
      fireEvent.click(card);
    });

    test('submit button is disabled when no diseases selected', () => {
      const submitButton = screen.getByRole('button', { name: /submit survey/i });
      expect(submitButton).toBeDisabled();
    });

    test('submit button is disabled when diseases selected but agreement not checked', () => {
      // Select a disease
      const breastCheckbox = screen.getByRole('checkbox', { name: /breast screening/i });
      fireEvent.click(breastCheckbox);
      
      const submitButton = screen.getByRole('button', { name: /submit survey/i });
      expect(submitButton).toBeDisabled();
    });

    test('submit button is enabled when diseases selected and agreement checked', () => {
      // Select a disease
      const breastCheckbox = screen.getByRole('checkbox', { name: /breast screening/i });
      fireEvent.click(breastCheckbox);
      
      // Check agreement
      const agreementCheckbox = screen.getByRole('checkbox', { name: /i agree to the selected examinations/i });
      fireEvent.click(agreementCheckbox);
      
      const submitButton = screen.getByRole('button', { name: /submit survey/i });
      expect(submitButton).toBeEnabled();
    });
  });

  // 7. Test sự kiện submit với dữ liệu hợp lệ và API thành công
  describe('Successful Form Submission', () => {
    test('submits form successfully with correct data', async () => {
      mockSendHealthCheckSurvey.mockResolvedValueOnce({ success: true });
      
      render(<HealthCheckSurveyByPupil currentPupil={mockCurrentPupil} />);
      
      // Open dialog
      const card = screen.getByText('Click to review and confirm examination details').closest('.MuiCard-root');
      fireEvent.click(card);
      
      // Select diseases
      const breastCheckbox = screen.getByRole('checkbox', { name: /breast screening/i });
      const genitalCheckbox = screen.getByRole('checkbox', { name: /genital checkup/i });
      fireEvent.click(breastCheckbox);
      fireEvent.click(genitalCheckbox);
      
      // Check agreement
      const agreementCheckbox = screen.getByRole('checkbox', { name: /i agree to the selected examinations/i });
      fireEvent.click(agreementCheckbox);
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit survey/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSendHealthCheckSurvey).toHaveBeenCalledWith({
          campaignId: mockHealthCampaign.campaignId,
          pupilId: mockCurrentPupil.pupilId,
          diseaseId: [1, 2], // Both disease IDs
        });
        expect(showSuccessToast).toHaveBeenCalledWith('Health check survey submitted successfully!');
      });
      
      // Dialog should close after successful submission
      expect(screen.queryByText('Health Check Consent Form')).not.toBeInTheDocument();
    });
  });

  // 8. Test sự kiện submit khi API trả lỗi
  describe('Failed Form Submission', () => {
    test('shows error message when API call fails', async () => {
      const errorMessage = 'Network error';
      mockSendHealthCheckSurvey.mockRejectedValueOnce(new Error(errorMessage));
      
      render(<HealthCheckSurveyByPupil currentPupil={mockCurrentPupil} />);
      
      // Open dialog
      const card = screen.getByText('Click to review and confirm examination details').closest('.MuiCard-root');
      fireEvent.click(card);
      
      // Select disease and agree
      const breastCheckbox = screen.getByRole('checkbox', { name: /breast screening/i });
      fireEvent.click(breastCheckbox);
      
      const agreementCheckbox = screen.getByRole('checkbox', { name: /i agree to the selected examinations/i });
      fireEvent.click(agreementCheckbox);
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit survey/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(showErrorToast).toHaveBeenCalledWith('Failed to submit health check survey. Please try again later.');
        expect(console.error).toHaveBeenCalledWith('Error submitting health check survey:', expect.any(Error));
      });
    });
  });

  // 9. Test loading states
  describe('Loading States', () => {
    test('shows loading state in submit button during submission', () => {
      useSendHealthCheckSurvey.mockReturnValue({
        sendHealthCheckSurvey: mockSendHealthCheckSurvey,
        loading: true,
        error: null
      });
      
      render(<HealthCheckSurveyByPupil currentPupil={mockCurrentPupil} />);
      
      // Open dialog
      const card = screen.getByText('Click to review and confirm examination details').closest('.MuiCard-root');
      fireEvent.click(card);
      
      // Submit button should show loading state
      expect(screen.getByText('Submitting...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
    });

    test('disables submit button during loading', () => {
      useSendHealthCheckSurvey.mockReturnValue({
        sendHealthCheckSurvey: mockSendHealthCheckSurvey,
        loading: true,
        error: null
      });
      
      render(<HealthCheckSurveyByPupil currentPupil={mockCurrentPupil} />);
      
      // Open dialog
      const card = screen.getByText('Click to review and confirm examination details').closest('.MuiCard-root');
      fireEvent.click(card);
      
      const submitButton = screen.getByRole('button', { name: /submitting/i });
      expect(submitButton).toBeDisabled();
    });
  });

  // 10. Test edge cases
  describe('Edge Cases', () => {
    test('handles missing currentPupil prop gracefully', () => {
      render(<HealthCheckSurveyByPupil currentPupil={null} />);
      
      // Should not crash and basic elements should still render
      expect(screen.getByText('Health Check Survey')).toBeInTheDocument();
    });

    test('handles missing health campaign data gracefully', () => {
      useLatestHealthCheckCampaign.mockReturnValue({
        latestHealthCheckCampaign: null,
        isLoading: false,
        refetch: jest.fn(),
        error: null
      });
      
      render(<HealthCheckSurveyByPupil currentPupil={mockCurrentPupil} />);
      
      // Should not crash
      expect(screen.getByText('Health Check Survey')).toBeInTheDocument();
    });

    test('handles campaign without diseases', () => {
      const campaignWithoutDiseases = {
        ...mockHealthCampaign,
        diseases: []
      };
      
      useLatestHealthCheckCampaign.mockReturnValue({
        latestHealthCheckCampaign: campaignWithoutDiseases,
        isLoading: false,
        refetch: jest.fn(),
        error: null
      });
      
      render(<HealthCheckSurveyByPupil currentPupil={mockCurrentPupil} />);
      
      // Open dialog
      const card = screen.getByText('Click to review and confirm examination details').closest('.MuiCard-root');
      fireEvent.click(card);
      
      // Should show sensitive diseases section but no disease options
      expect(screen.getByText('Sensitive diseases')).toBeInTheDocument();
      expect(screen.queryByText('Breast Screening')).not.toBeInTheDocument();
    });
  });

  // 11. Test form reset on dialog close
  describe('Form Reset', () => {
    test('resets form state when dialog is closed', () => {
      render(<HealthCheckSurveyByPupil currentPupil={mockCurrentPupil} />);
      
      // Open dialog
      const card = screen.getByText('Click to review and confirm examination details').closest('.MuiCard-root');
      fireEvent.click(card);
      
      // Make selections
      const breastCheckbox = screen.getByRole('checkbox', { name: /breast screening/i });
      const agreementCheckbox = screen.getByRole('checkbox', { name: /i agree to the selected examinations/i });
      fireEvent.click(breastCheckbox);
      fireEvent.click(agreementCheckbox);
      
      // Close dialog
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);
      
      // Reopen dialog
      fireEvent.click(card);
      
      // Form should be reset
      const reopenedBreastCheckbox = screen.getByRole('checkbox', { name: /breast screening/i });
      const reopenedAgreementCheckbox = screen.getByRole('checkbox', { name: /i agree to the selected examinations/i });
      expect(reopenedBreastCheckbox).not.toBeChecked();
      expect(reopenedAgreementCheckbox).not.toBeChecked();
    });
  });
});

/**
 * ========================================
 * TEST FILE LAYOUT DOCUMENTATION
 * ========================================
 * 
 * This comprehensive test suite covers the HealthCheckSurveyByPupil component
 * with focus on user interactions, form states, and API integration.
 * 
 * TESTING STRUCTURE:
 * ─────────────────────────────────────
 * 1. Initial Rendering (3 tests)
 *    - Basic UI elements display
 *    - Student information rendering
 *    - Examination period display
 * 
 * 2. Dialog Interaction (3 tests)
 *    - Opening dialog on card click
 *    - Closing dialog with close button
 *    - Closing dialog with cancel button
 * 
 * 3. Dialog Content (4 tests)
 *    - Student information in dialog
 *    - Campaign information display
 *    - Disease checkboxes rendering
 *    - Agreement checkbox presence
 * 
 * 4. Disease Selection (2 tests)
 *    - Checkbox selection/deselection
 *    - Validation warning display
 * 
 * 5. Agreement Checkbox (2 tests)
 *    - Toggle functionality
 *    - Conditional info messages
 * 
 * 6. Submit Button States (3 tests)
 *    - Disabled when no diseases selected
 *    - Disabled when no agreement
 *    - Enabled when all conditions met
 * 
 * 7. Successful Submission (1 test)
 *    - Complete form submission flow
 *    - API call with correct data
 *    - Success toast and dialog close
 * 
 * 8. Failed Submission (1 test)
 *    - Error handling and toast display
 *    - Console error logging
 * 
 * 9. Loading States (2 tests)
 *    - Loading button display
 *    - Button disabled during loading
 * 
 * 10. Edge Cases (3 tests)
 *     - Missing pupil data handling
 *     - Missing campaign data handling
 *     - Empty diseases array handling
 * 
 * 11. Form Reset (1 test)
 *     - State reset on dialog close/reopen
 * 
 * TOTAL: 25 comprehensive tests covering all component functionality
 * 
 * COVERAGE INCLUDES:
 * ✅ UI rendering and layout
 * ✅ User interactions (clicks, selections)
 * ✅ Form validation and states
 * ✅ API integration and error handling
 * ✅ Loading states and user feedback
 * ✅ Edge cases and error scenarios
 * ✅ Accessibility and user experience
 */
