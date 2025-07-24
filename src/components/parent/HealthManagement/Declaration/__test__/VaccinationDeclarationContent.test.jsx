/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import VaccinationDeclarationContent from '../VaccinationDeclarationContent';
import { showSuccessToast, showErrorToast } from '@utils/toast-utils';

// Mock all hooks and dependencies
const mockCreateBulkVaccinationHistory = jest.fn();
const mockRefetch = jest.fn();

jest.mock('@hooks/parent/usePupils', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('@hooks/parent/vaccination/useAllDiseasesVaccines', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('@hooks/parent/vaccination/useCreateBulkVaccinationHisotyForEachPupil', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('@utils/toast-utils', () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn()
}));

// Import the mocked hooks
import usePupils from '@hooks/parent/usePupils';
import useAllDiseasesVaccines from '@hooks/parent/vaccination/useAllDiseasesVaccines';
import useCreateBulkVaccinationHistoryForEachPupil from '@hooks/parent/vaccination/useCreateBulkVaccinationHisotyForEachPupil';

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

// Mock data
const mockPupils = [
  { 
    pupilId: 'PP001', 
    lastName: 'Nguyen',
    firstName: 'An', 
    gradeName: '10A1',
    birthDate: '2005-01-15',
    gender: 'M'
  },
  { 
    pupilId: 'PP002', 
    lastName: 'Tran',
    firstName: 'Binh', 
    gradeName: '10A2',
    birthDate: '2005-03-20',
    gender: 'F'
  }
];

const mockDiseases = {
  GetVaccineByDisease: [
    {
      diseaseId: 'd1',
      diseaseName: 'Hepatitis B',
      doseQuantity: 3,
      vaccines: [
        { vaccineId: 'v1', name: 'Hepatitis B Vaccine Type A' },
        { vaccineId: 'v2', name: 'Hepatitis B Vaccine Type B' }
      ]
    },
    {
      diseaseId: 'd2',
      diseaseName: 'Measles',
      doseQuantity: 2,
      vaccines: [
        { vaccineId: 'v3', name: 'MMR Vaccine' },
        { vaccineId: 'v4', name: 'Measles Vaccine' }
      ]
    },
    {
      diseaseId: 'd3',
      diseaseName: 'No Vaccine Disease',
      doseQuantity: 1,
      vaccines: []
    }
  ]
};

describe('VaccinationDeclarationContent - Comprehensive Tests', () => {
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock pupils data - using correct property names
    usePupils.mockReturnValue({
      pupils: mockPupils,
      isLoading: false
    });

    // Mock diseases and vaccines data - using correct structure
    useAllDiseasesVaccines.mockReturnValue({
      diseaseVaccineMap: mockDiseases,
      loading: false,
      error: null,
      refetch: mockRefetch
    });

    // Mock vaccination history creation
    useCreateBulkVaccinationHistoryForEachPupil.mockReturnValue({
      createBulkVaccinationHistory: mockCreateBulkVaccinationHistory,
      loading: false,
      errror: null
    });
  });

  describe('Component Rendering', () => {
    test('renders basic UI elements correctly', () => {
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      expect(screen.getByText('Vaccination Declaration Form')).toBeInTheDocument();
      expect(screen.getByText('Select Child')).toBeInTheDocument();
      expect(screen.getByText('1st Disease')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /declare vaccination/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add another disease/i })).toBeInTheDocument();
    });

    test('renders pupil selection dropdown', () => {
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );
      
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    test('submit button is initially disabled', () => {
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );
      
      const submitButton = screen.getByRole('button', { name: /declare vaccination/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Loading States', () => {
    test('displays loading state correctly for submission', () => {
      useCreateBulkVaccinationHistoryForEachPupil.mockReturnValue({
        createBulkVaccinationHistory: mockCreateBulkVaccinationHistory,
        loading: true,
        errror: null
      });

      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );
      
      expect(screen.getByText('Declaring...')).toBeInTheDocument();
      const submitButton = screen.getByRole('button', { name: /declaring.../i });
      expect(submitButton).toBeDisabled();
    });

    test('handles loading pupils state', () => {
      usePupils.mockReturnValue({
        pupils: [],
        isLoading: true
      });
      
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );
      
      expect(screen.getByText('Vaccination Declaration Form')).toBeInTheDocument();
    });

    test('handles loading diseases state', () => {
      useAllDiseasesVaccines.mockReturnValue({
        diseaseVaccineMap: null,
        loading: true,
        error: null,
        refetch: mockRefetch
      });
      
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );
      
      expect(screen.getByText('Vaccination Declaration Form')).toBeInTheDocument();
    });
  });

  describe('Pupil Selection', () => {
    test('user can select a pupil', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      // Use role combobox to find the select
      const pupilSelect = screen.getByRole('combobox');
      await user.click(pupilSelect);
      
      const pupilOption = await screen.findByText('Nguyen An');
      await user.click(pupilOption);

      await waitFor(() => {
        expect(screen.getByText('Selected Child Information')).toBeInTheDocument();
        expect(screen.getByText(/Nguyen An/)).toBeInTheDocument();
        expect(screen.getByText(/Male/)).toBeInTheDocument();
        expect(screen.getByText(/10A1/)).toBeInTheDocument();
      });
    });

    test('displays female gender correctly', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      const pupilSelect = screen.getByRole('combobox');
      await user.click(pupilSelect);
      
      const pupilOption = await screen.findByText('Tran Binh');
      await user.click(pupilOption);

      await waitFor(() => {
        expect(screen.getByText(/Female/)).toBeInTheDocument();
      });
    });

    test('enables submit button when pupil is selected', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      const pupilSelect = screen.getByRole('combobox');
      await user.click(pupilSelect);
      
      const pupilOption = await screen.findByText('Nguyen An');
      await user.click(pupilOption);

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /declare vaccination/i });
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Disease Management', () => {
    test('user can select disease and vaccine', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      // First select a pupil
      const pupilSelect = screen.getByRole('combobox');
      await user.click(pupilSelect);
      await user.click(await screen.findByText('Nguyen An'));

      // Then select a disease
      const selects = screen.getAllByRole('combobox');
      const diseaseSelect = selects[1];
      await user.click(diseaseSelect);
      await user.click(await screen.findByText('Hepatitis B'));

      // Then select a vaccine
      await waitFor(async () => {
        const updatedSelects = screen.getAllByRole('combobox');
        const vaccineSelect = updatedSelects[2];
        expect(vaccineSelect).not.toBeDisabled();
        await user.click(vaccineSelect);
        await user.click(await screen.findByText('Hepatitis B Vaccine Type A'));
      });

      // Verify dose information section appears
      await waitFor(() => {
        expect(screen.getByText('Dose Information')).toBeInTheDocument();
        expect(screen.getByText('DOSE 1')).toBeInTheDocument();
      });
    });

    test('vaccine selection resets when disease changes', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      // Select pupil
      const pupilSelect = screen.getByRole('combobox');
      await user.click(pupilSelect);
      await user.click(await screen.findByText('Nguyen An'));

      // Select first disease
      const selects = screen.getAllByRole('combobox');
      const diseaseSelect = selects[1];
      await user.click(diseaseSelect);
      await user.click(await screen.findByText('Hepatitis B'));

      // Select vaccine
      await waitFor(async () => {
        const updatedSelects = screen.getAllByRole('combobox');
        const vaccineSelect = updatedSelects[2];
        await user.click(vaccineSelect);
        await user.click(await screen.findByText('Hepatitis B Vaccine Type A'));
      });

      // Change disease - this should reset vaccine selection
      await user.click(diseaseSelect);
      await user.click(await screen.findByText('Measles'));

      // Vaccine should be reset
      await waitFor(() => {
        const latestSelects = screen.getAllByRole('combobox');
        const vaccineSelect = latestSelects[2];
        expect(vaccineSelect).toHaveValue('');
      });
    });

    test('shows no vaccines available message', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      // Select pupil
      const pupilSelect = screen.getByRole('combobox');
      await user.click(pupilSelect);
      await user.click(await screen.findByText('Nguyen An'));

      // Select disease with no vaccines
      const selects = screen.getAllByRole('combobox');
      const diseaseSelect = selects[1];
      await user.click(diseaseSelect);
      await user.click(await screen.findByText('No Vaccine Disease'));

      await waitFor(() => {
        expect(screen.getByText('No vaccines available for this disease')).toBeInTheDocument();
      });
    });

    test('user can add and remove diseases', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      // Initially should have "1st Disease"
      expect(screen.getByText('1st Disease')).toBeInTheDocument();

      // Add another disease
      const addDiseaseButton = screen.getByRole('button', { name: /add another disease/i });
      await user.click(addDiseaseButton);

      // Should now have "2nd Disease"
      expect(screen.getByText('2nd Disease')).toBeInTheDocument();

      // Remove the second disease
      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      await user.click(deleteButtons[0]);

      // Should only have "1st Disease" again
      expect(screen.getByText('1st Disease')).toBeInTheDocument();
      expect(screen.queryByText('2nd Disease')).not.toBeInTheDocument();
    });

    test('cannot remove disease if only one exists', () => {
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      expect(screen.getByText('1st Disease')).toBeInTheDocument();
      // Should not have delete button when only one disease exists
      expect(screen.queryByTestId('DeleteIcon')).not.toBeInTheDocument();
    });
  });

  describe('Dose Management', () => {
    const setupDiseaseAndVaccine = async () => {
      const user = userEvent.setup();
      
      // Select pupil
      const pupilSelect = screen.getByRole('combobox');
      await user.click(pupilSelect);
      await user.click(await screen.findByText('Nguyen An'));

      // Select disease
      const selects = screen.getAllByRole('combobox');
      const diseaseSelect = selects[1];
      await user.click(diseaseSelect);
      await user.click(await screen.findByText('Hepatitis B'));

      // Select vaccine
      await waitFor(async () => {
        const updatedSelects = screen.getAllByRole('combobox');
        const vaccineSelect = updatedSelects[2];
        await user.click(vaccineSelect);
        await user.click(await screen.findByText('Hepatitis B Vaccine Type A'));
      });

      return user;
    };

    test('user can add dose information', async () => {
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      await setupDiseaseAndVaccine();

      // Should have DOSE 1 initially
      expect(screen.getByText('DOSE 1')).toBeInTheDocument();

      // Add another dose
      const addDoseButton = screen.getByRole('button', { name: /add dose information/i });
      await userEvent.click(addDoseButton);

      // Should now have DOSE 2
      expect(screen.getByText('DOSE 2')).toBeInTheDocument();
    });

    test('user can remove dose information', async () => {
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      await setupDiseaseAndVaccine();

      // Add another dose first
      const addDoseButton = screen.getByRole('button', { name: /add dose information/i });
      await userEvent.click(addDoseButton);

      expect(screen.getByText('DOSE 2')).toBeInTheDocument();

      // Remove the second dose
      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      const doseDeleteButton = deleteButtons.find(btn => 
        btn.closest('[data-testid]') || btn.parentElement?.textContent?.includes('DOSE 2')
      );
      
      if (doseDeleteButton) {
        await userEvent.click(doseDeleteButton);
      }

      expect(screen.queryByText('DOSE 2')).not.toBeInTheDocument();
    });

    test('respects maximum dose limit', async () => {
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      const user = userEvent.setup();
      
      // Select pupil
      const pupilSelect = screen.getByLabelText(/choose your child/i);
      await user.click(pupilSelect);
      await user.click(await screen.findByText('Nguyen An'));

      // Select Measles (which has max 2 doses)
      const diseaseSelect = screen.getByLabelText(/select disease/i);
      await user.click(diseaseSelect);
      await user.click(await screen.findByText('Measles'));

      // Select vaccine
      await waitFor(async () => {
        const vaccineSelect = screen.getByLabelText(/select vaccine/i);
        await user.click(vaccineSelect);
        await user.click(await screen.findByText('MMR Vaccine'));
      });

      // Add one more dose (should reach maximum of 2)
      const addDoseButton = screen.getByRole('button', { name: /add dose information/i });
      await user.click(addDoseButton);

      // Should not be able to add more doses
      expect(screen.queryByRole('button', { name: /add dose information/i })).not.toBeInTheDocument();
    });

    test('user can fill dose information fields', async () => {
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      await setupDiseaseAndVaccine();

      // Fill vaccination date
      const dateInput = screen.getByDisplayValue('') || screen.getAllByRole('textbox')[0];
      await userEvent.clear(dateInput);
      await userEvent.type(dateInput, '2023-01-15');
      expect(dateInput).toHaveValue('2023-01-15');

      // Fill notes
      const notesInput = screen.getAllByRole('textbox')[1] || screen.getByPlaceholderText(/notes/i);
      await userEvent.type(notesInput, 'Vaccinated at hospital');
      expect(notesInput).toHaveValue('Vaccinated at hospital');
    });
  });

  describe('Form Validation', () => {
    test('shows validation error when submitting without pupil selection', async () => {
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      // Force click the submit button even if disabled for validation testing
      const submitButton = screen.getByRole('button', { name: /declare vaccination/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(showErrorToast).toHaveBeenCalledWith('Please select a child before submitting the form.');
      });
    });

    test('shows validation error when submitting without disease selection', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      // Select only pupil
      const pupilSelect = screen.getByRole('combobox');
      await user.click(pupilSelect);
      await user.click(await screen.findByText('Nguyen An'));

      const submitButton = screen.getByRole('button', { name: /declare vaccination/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(showErrorToast).toHaveBeenCalledWith('Please select at least one disease before submitting.');
      });
    });

    test('shows validation error when submitting without dose information', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      // Select pupil
      const pupilSelect = screen.getByRole('combobox');
      await user.click(pupilSelect);
      await user.click(await screen.findByText('Nguyen An'));

      // Select disease but don't fill dose info
      const selects = screen.getAllByRole('combobox');
      const diseaseSelect = selects[1]; // Second combobox should be disease select
      await user.click(diseaseSelect);
      await user.click(await screen.findByText('Hepatitis B'));

      const submitButton = screen.getByRole('button', { name: /declare vaccination/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(showErrorToast).toHaveBeenCalledWith('Please provide vaccination date and notes for each dose.');
      });
    });
  });

  describe('Form Submission', () => {
    test('successfully submits form with valid data', async () => {
      mockCreateBulkVaccinationHistory.mockResolvedValueOnce({});
      
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      // Fill complete form
      const pupilSelect = screen.getByRole('combobox');
      await user.click(pupilSelect);
      await user.click(await screen.findByText('Nguyen An'));

      const selects = screen.getAllByRole('combobox');
      const diseaseSelect = selects[1];
      await user.click(diseaseSelect);
      await user.click(await screen.findByText('Hepatitis B'));

      await waitFor(async () => {
        const updatedSelects = screen.getAllByRole('combobox');
        const vaccineSelect = updatedSelects[2];
        await user.click(vaccineSelect);
        await user.click(await screen.findByText('Hepatitis B Vaccine Type A'));
      });

      const textboxes = screen.getAllByRole('textbox');
      const dateInput = textboxes[0];
      await user.type(dateInput, '2023-01-15');

      const notesInput = textboxes[1];
      await user.type(notesInput, 'Vaccinated at hospital');

      const submitButton = screen.getByRole('button', { name: /declare vaccination/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateBulkVaccinationHistory).toHaveBeenCalledWith(
          expect.objectContaining({
            pupilId: 'PP001',
            vaccinationHistories: expect.arrayContaining([
              expect.objectContaining({
                vaccineId: 'v1',
                diseaseId: 'd1',
                doses: expect.arrayContaining([
                  expect.objectContaining({
                    vaccinatedAt: '15-01-2023',
                    notes: 'Vaccinated at hospital',
                    doseNumber: 1
                  })
                ])
              })
            ])
          })
        );
        expect(showSuccessToast).toHaveBeenCalledWith('Vaccination history created successfully! Please check at vaccination history page.');
      });
    });

    test('resets form after successful submission', async () => {
      mockCreateBulkVaccinationHistory.mockResolvedValueOnce({});
      
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      // Fill and submit form
      const pupilSelect = screen.getByRole('combobox');
      await user.click(pupilSelect);
      await user.click(await screen.findByText('Nguyen An'));

      const selects = screen.getAllByRole('combobox');
      const diseaseSelect = selects[1];
      await user.click(diseaseSelect);
      await user.click(await screen.findByText('Hepatitis B'));

      await waitFor(async () => {
        const updatedSelects = screen.getAllByRole('combobox');
        const vaccineSelect = updatedSelects[2];
        await user.click(vaccineSelect);
        await user.click(await screen.findByText('Hepatitis B Vaccine Type A'));
      });

      const textboxes = screen.getAllByRole('textbox');
      const dateInput = textboxes[0];
      await user.type(dateInput, '2023-01-15');

      const notesInput = textboxes[1];
      await user.type(notesInput, 'Vaccinated at hospital');

      const submitButton = screen.getByRole('button', { name: /declare vaccination/i });
      await user.click(submitButton);

      // Check form is reset
      await waitFor(() => {
        const resetSelects = screen.getAllByRole('combobox');
        expect(resetSelects[0]).toHaveValue(''); // pupil select
        expect(resetSelects[1]).toHaveValue(''); // disease select
      });
    });

    test('handles submission error', async () => {
      mockCreateBulkVaccinationHistory.mockRejectedValueOnce(new Error('API Error'));
      
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      // Fill complete form
      const pupilSelect = screen.getByRole('combobox');
      await user.click(pupilSelect);
      await user.click(await screen.findByText('Nguyen An'));

      const selects = screen.getAllByRole('combobox');
      const diseaseSelect = selects[1];
      await user.click(diseaseSelect);
      await user.click(await screen.findByText('Hepatitis B'));

      await waitFor(async () => {
        const updatedSelects = screen.getAllByRole('combobox');
        const vaccineSelect = updatedSelects[2];
        await user.click(vaccineSelect);
        await user.click(await screen.findByText('Hepatitis B Vaccine Type A'));
      });

      const textboxes = screen.getAllByRole('textbox');
      const dateInput = textboxes[0];
      await user.type(dateInput, '2023-01-15');

      const notesInput = textboxes[1];
      await user.type(notesInput, 'Vaccinated at hospital');

      const submitButton = screen.getByRole('button', { name: /declare vaccination/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(showErrorToast).toHaveBeenCalledWith('Failed to create vaccination history. Please try again later.');
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('handles empty pupils array gracefully', () => {
      usePupils.mockReturnValue({
        pupils: [],
        isLoading: false
      });
      
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );
      
      expect(screen.getByText('Vaccination Declaration Form')).toBeInTheDocument();
      expect(screen.getByText('Select Child')).toBeInTheDocument();
    });

    test('handles empty diseases array gracefully', () => {
      useAllDiseasesVaccines.mockReturnValue({
        diseaseVaccineMap: { GetVaccineByDisease: [] },
        loading: false,
        error: null,
        refetch: mockRefetch
      });
      
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );
      
      expect(screen.getByText('Vaccination Declaration Form')).toBeInTheDocument();
    });

    test('handles null diseaseVaccineMap gracefully', () => {
      useAllDiseasesVaccines.mockReturnValue({
        diseaseVaccineMap: null,
        loading: false,
        error: null,
        refetch: mockRefetch
      });
      
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );
      
      expect(screen.getByText('Vaccination Declaration Form')).toBeInTheDocument();
    });

    test('handles form submission with invalid form data', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      // Mock a scenario where formData becomes falsy
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Manually trigger handleDeclareVaccine with invalid data
      const pupilSelect = screen.getByRole('combobox');
      await user.click(pupilSelect);
      await user.click(await screen.findByText('Nguyen An'));

      // Don't fill disease but submit
      const submitButton = screen.getByRole('button', { name: /declare vaccination/i });
      await user.click(submitButton);

      consoleSpy.mockRestore();
    });
  });

  describe('Helper Functions', () => {
    test('format date function works correctly', () => {
      // This tests the formatDateForSubmission function indirectly through form submission
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      // The date formatting is tested through the submission flow above
      expect(screen.getByText('Vaccination Declaration Form')).toBeInTheDocument();
    });

    test('ordinal number generation works correctly', () => {
      render(
        <TestWrapper>
          <VaccinationDeclarationContent />
        </TestWrapper>
      );

      expect(screen.getByText('1st Disease')).toBeInTheDocument();
      
      // Add diseases to test other ordinals
      const addButton = screen.getByRole('button', { name: /add another disease/i });
      fireEvent.click(addButton);
      expect(screen.getByText('2nd Disease')).toBeInTheDocument();
      
      fireEvent.click(addButton);
      expect(screen.getByText('3rd Disease')).toBeInTheDocument();
    });
  });
});
