/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import VaccinationDeclarationContent from '../VaccinationDeclarationContent';

// Mock all hooks and dependencies
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

describe('VaccinationDeclarationContent - Simple Tests', () => {
  beforeEach(() => {
    // Mock pupils data
    usePupils.mockReturnValue({
      pupils: [
        { 
          PupilID: 'PP001', 
          FullName: 'Nguyen An', 
          Grade: '10A1',
          DateOfBirth: '2005-01-15',
          Gender: 'Male',
          Address: '123 Main St'
        },
        { 
          PupilID: 'PP002', 
          FullName: 'Tran Binh', 
          Grade: '10A2',
          DateOfBirth: '2005-03-20',
          Gender: 'Female',
          Address: '456 Oak Ave'
        }
      ],
      isLoading: false
    });

    // Mock diseases and vaccines data
    useAllDiseasesVaccines.mockReturnValue({
      diseaseVaccineMap: {
        GetVaccineByDisease: [
          {
            DiseaseName: 'Hepatitis B',
            VaccinationSchedule: [
              { VaccineName: 'Hepatitis B Vaccine Type A', DoseNumber: 1, MaxDoses: 3 },
              { VaccineName: 'Hepatitis B Vaccine Type A', DoseNumber: 2, MaxDoses: 3 },
              { VaccineName: 'Hepatitis B Vaccine Type A', DoseNumber: 3, MaxDoses: 3 }
            ]
          },
          {
            DiseaseName: 'Measles',
            VaccinationSchedule: [
              { VaccineName: 'MMR Vaccine', DoseNumber: 1, MaxDoses: 2 },
              { VaccineName: 'MMR Vaccine', DoseNumber: 2, MaxDoses: 2 }
            ]
          }
        ]
      },
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    // Mock vaccination history creation
    useCreateBulkVaccinationHistoryForEachPupil.mockReturnValue({
      createBulkVaccinationHistory: jest.fn(),
      loading: false,
      error: null
    });
  });

  test('renders basic UI elements correctly', () => {
    render(
      <TestWrapper>
        <VaccinationDeclarationContent />
      </TestWrapper>
    );

    // Check for main title
    expect(screen.getByText('Vaccination Declaration Form')).toBeInTheDocument();
    
    // Check for section headings
    expect(screen.getByText('Select Child')).toBeInTheDocument();
    expect(screen.getByText('1st Disease')).toBeInTheDocument();
    
    // Check for main action button
    expect(screen.getByRole('button', { name: /declare vaccination/i })).toBeInTheDocument();
    
    // Check for add disease button
    expect(screen.getByRole('button', { name: /add another disease/i })).toBeInTheDocument();
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

  test('displays loading state correctly', () => {
    useCreateBulkVaccinationHistoryForEachPupil.mockReturnValue({
      createBulkVaccinationHistory: jest.fn(),
      loading: true,
      error: null
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
    
    // Component should still render without crashing
    expect(screen.getByText('Vaccination Declaration Form')).toBeInTheDocument();
    expect(screen.getByText('Select Child')).toBeInTheDocument();
  });

  test('handles loading state for pupils', () => {
    usePupils.mockReturnValue({
      pupils: [],
      isLoading: true
    });
    
    render(
      <TestWrapper>
        <VaccinationDeclarationContent />
      </TestWrapper>
    );
    
    // Component should still render during loading
    expect(screen.getByText('Vaccination Declaration Form')).toBeInTheDocument();
  });

  test('handles loading state for diseases and vaccines', () => {
    useAllDiseasesVaccines.mockReturnValue({
      diseaseVaccineMap: null,
      loading: true,
      error: null,
      refetch: jest.fn()
    });
    
    render(
      <TestWrapper>
        <VaccinationDeclarationContent />
      </TestWrapper>
    );
    
    // Component should still render during loading
    expect(screen.getByText('Vaccination Declaration Form')).toBeInTheDocument();
  });

  test('handles empty diseases array gracefully', () => {
    useAllDiseasesVaccines.mockReturnValue({
      diseaseVaccineMap: { GetVaccineByDisease: [] },
      loading: false,
      error: null,
      refetch: jest.fn()
    });
    
    render(
      <TestWrapper>
        <VaccinationDeclarationContent />
      </TestWrapper>
    );
    
    // Component should render without crashing
    expect(screen.getByText('Vaccination Declaration Form')).toBeInTheDocument();
  });

  test('renders with all required sections', () => {
    render(
      <TestWrapper>
        <VaccinationDeclarationContent />
      </TestWrapper>
    );
    
    // Check for form structure
    expect(screen.getByText('Select Child')).toBeInTheDocument();
    expect(screen.getByText('1st Disease')).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByRole('button', { name: /declare vaccination/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add another disease/i })).toBeInTheDocument();
    
    // Check that we have the expected form controls (by role, not by label)
    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes.length).toBeGreaterThan(0); // Should have at least pupil and disease selects
  });

  test('component structure is consistent', () => {
    render(
      <TestWrapper>
        <VaccinationDeclarationContent />
      </TestWrapper>
    );
    
    // Test that key structural elements are present
    expect(screen.getByText('Vaccination Declaration Form')).toBeInTheDocument();
    
    // Test that we have the main form sections
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
    
    // Test that we have the expected buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2); // At least submit and add disease buttons
  });
});
