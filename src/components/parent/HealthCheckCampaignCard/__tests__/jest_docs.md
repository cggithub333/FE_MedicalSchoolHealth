# Jest Testing Guide for React Components - Step by Step

> A beginner-friendly guide to writing unit tests for React components using Jest and React Testing Library

## Step 1: Understanding What We're Testing

Before writing tests, understand what your component does:

- **Renders correctly** with given props
- **Responds to user interactions** (clicks, form inputs)
- **Handles different states** (loading, error, success)
- **Calls APIs correctly** when needed
- **Shows appropriate feedback** to users

For our `HealthCheckSurveyByPupil` component:
- Shows a survey card
- Opens a dialog when clicked
- Allows disease selection via checkboxes
- Validates form completion
- Submits survey data

## Step 2: Basic Test Setup

### Installation
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

### Basic Test Structure
```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HealthCheckSurveyByPupil from '../HealthCheckSurveyByPupil';

describe('HealthCheckSurveyByPupil', () => {
  test('renders without crashing', () => {
    // Mock data - fake data for testing
    const mockPupil = {
      pupilId: "PP0006",
      lastName: "Hoàng",
      firstName: "Em",
      birthDate: "12-01-2018",
      gradeName: "Lớp 1D",
    };

    // Render the component with mock data
    render(<HealthCheckSurveyByPupil currentPupil={mockPupil} />);
    
    // Check if expected text appears on screen
    expect(screen.getByText('Health Check Survey')).toBeInTheDocument();
  });
});
```

**Key Functions:**
- `describe()` - Groups related tests
- `test()` - Single test case
- `render()` - Puts component on fake screen
- `expect()` - Makes assertions about what should happen

## Step 3: Understanding Mocking

### Why Mock?
Your component uses external dependencies (hooks, APIs). We want to:
- **Isolate** the component from external systems
- **Control** what data the component receives
- **Test** different scenarios reliably

### Setting Up Mocks
```javascript
// Mock external dependencies
jest.mock('@hooks/parent/useLatestHealthCheckCampaign');
jest.mock('@hooks/parent/health-check/useSendHealthCheckSurvey');
jest.mock('@utils/toast-utils');

// Import the mocked hooks
import useLatestHealthCheckCampaign from '@hooks/parent/useLatestHealthCheckCampaign';
import useSendHealthCheckSurvey from '@hooks/parent/health-check/useSendHealthCheckSurvey';

describe('HealthCheckSurveyByPupil', () => {
  // Mock data
  const mockPupil = {
    pupilId: "PP0006",
    lastName: "Hoàng",
    firstName: "Em",
    gradeName: "Lớp 1D",
  };

  const mockHealthCampaign = {
    campaignId: "HC001",
    title: "Annual Health Check 2025",
    diseases: [
      { diseaseId: "D001", name: "Vision Test" },
      { diseaseId: "D002", name: "Hearing Test" }
    ]
  };

  beforeEach(() => {
    // Set up fake return values before each test
    useLatestHealthCheckCampaign.mockReturnValue({
      latestHealthCheckCampaign: mockHealthCampaign,
      isLoading: false,
      refetch: jest.fn(),
      error: null
    });

    useSendHealthCheckSurvey.mockReturnValue({
      sendHealthCheckSurvey: jest.fn(),
      loading: false,
      error: null
    });
  });

  test('renders health check survey card', () => {
    render(<HealthCheckSurveyByPupil currentPupil={mockPupil} />);
    
    expect(screen.getByText('Health Check Survey')).toBeInTheDocument();
    expect(screen.getByText('Annual Health Check 2025')).toBeInTheDocument();
  });
});
```

## Step 4: Testing User Interactions

### Simulating Clicks and User Events
```javascript
import userEvent from '@testing-library/user-event';

describe('HealthCheckSurveyByPupil User Interactions', () => {
  test('opens dialog when card is clicked', async () => {
    // Set up user event handler
    const user = userEvent.setup();
    
    render(<HealthCheckSurveyByPupil currentPupil={mockPupil} />);
    
    // Find the clickable card
    const card = screen.getByText('Health Check Survey').closest('div[role="button"]');
    
    // Simulate clicking
    await user.click(card);
    
    // Check if dialog opened
    expect(screen.getByText('Health Check Consent Form')).toBeInTheDocument();
  });

  test('closes dialog when close button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<HealthCheckSurveyByPupil currentPupil={mockPupil} />);
    
    // Open dialog first
    const card = screen.getByText('Health Check Survey').closest('div[role="button"]');
    await user.click(card);
    
    // Find and click close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    
    // Check if dialog is closed
    expect(screen.queryByText('Health Check Consent Form')).not.toBeInTheDocument();
  });
});
```

**Key Points:**
- `userEvent.setup()` - Creates user interaction simulator
- `await user.click()` - Simulates clicking (async because it triggers updates)
- `queryByText()` - Returns null if not found (doesn't throw error)

## Step 5: Testing Form Interactions and Validation

### Testing Checkboxes and Form State
```javascript
describe('HealthCheckSurveyByPupil Form Testing', () => {
  test('allows selecting and deselecting diseases', async () => {
    const user = userEvent.setup();
    
    render(<HealthCheckSurveyByPupil currentPupil={mockPupil} />);
    
    // Open dialog
    const card = screen.getByText('Health Check Survey').closest('div[role="button"]');
    await user.click(card);
    
    // Find checkboxes
    const visionCheckbox = screen.getByRole('checkbox', { name: /vision test/i });
    const hearingCheckbox = screen.getByRole('checkbox', { name: /hearing test/i });
    
    // Initially unchecked
    expect(visionCheckbox).not.toBeChecked();
    expect(hearingCheckbox).not.toBeChecked();
    
    // Select diseases
    await user.click(visionCheckbox);
    await user.click(hearingCheckbox);
    
    // Now they should be checked
    expect(visionCheckbox).toBeChecked();
    expect(hearingCheckbox).toBeChecked();
    
    // Deselect one
    await user.click(visionCheckbox);
    expect(visionCheckbox).not.toBeChecked();
    expect(hearingCheckbox).toBeChecked();
  });

  test('submit button is disabled when conditions not met', async () => {
    const user = userEvent.setup();
    
    render(<HealthCheckSurveyByPupil currentPupil={mockPupil} />);
    
    // Open dialog
    const card = screen.getByText('Health Check Survey').closest('div[role="button"]');
    await user.click(card);
    
    const submitButton = screen.getByRole('button', { name: /submit survey/i });
    
    // Should be disabled initially
    expect(submitButton).toBeDisabled();
    
    // Select disease but no agreement - still disabled
    const visionCheckbox = screen.getByRole('checkbox', { name: /vision test/i });
    await user.click(visionCheckbox);
    expect(submitButton).toBeDisabled();
    
    // Add agreement - now enabled
    const agreementCheckbox = screen.getByRole('checkbox', { name: /i agree/i });
    await user.click(agreementCheckbox);
    expect(submitButton).not.toBeDisabled();
  });

  test('submits survey with correct data when form is valid', async () => {
    const user = userEvent.setup();
    const mockSendSurvey = jest.fn().mockResolvedValue({});
    
    // Update mock to include our spy function
    useSendHealthCheckSurvey.mockReturnValue({
      sendHealthCheckSurvey: mockSendSurvey,
      loading: false,
      error: null
    });
    
    render(<HealthCheckSurveyByPupil currentPupil={mockPupil} />);
    
    // Open dialog and fill form
    const card = screen.getByText('Health Check Survey').closest('div[role="button"]');
    await user.click(card);
    
    const visionCheckbox = screen.getByRole('checkbox', { name: /vision test/i });
    const agreementCheckbox = screen.getByRole('checkbox', { name: /i agree/i });
    
    await user.click(visionCheckbox);
    await user.click(agreementCheckbox);
    
    // Submit
    const submitButton = screen.getByRole('button', { name: /submit survey/i });
    await user.click(submitButton);
    
    // Wait for async operations and check if function was called correctly
    await waitFor(() => {
      expect(mockSendSurvey).toHaveBeenCalledWith({
        campaignId: mockHealthCampaign.campaignId,
        pupilId: mockPupil.pupilId,
        diseaseId: ['D001']
      });
    });
  });
});
```

### Testing Error and Loading States
```javascript
test('handles submission error correctly', async () => {
  const user = userEvent.setup();
  const mockError = new Error('Network error');
  const mockSendSurvey = jest.fn().mockRejectedValue(mockError);
  
  useSendHealthCheckSurvey.mockReturnValue({
    sendHealthCheckSurvey: mockSendSurvey,
    loading: false,
    error: null
  });
  
  render(<HealthCheckSurveyByPupil currentPupil={mockPupil} />);
  
  // ... fill and submit form ...
  
  await waitFor(() => {
    expect(showErrorToast).toHaveBeenCalledWith('Failed to submit survey');
  });
});

test('shows loading state during submission', () => {
  useSendHealthCheckSurvey.mockReturnValue({
    sendHealthCheckSurvey: jest.fn(),
    loading: true,
    error: null
  });
  
  render(<HealthCheckSurveyByPupil currentPupil={mockPupil} />);
  
  // Open dialog
  // ...
  
  const submitButton = screen.getByRole('button', { name: /submitting.../i });
  expect(submitButton).toBeDisabled();
});
```

## Key Testing Concepts Summary

### Essential Functions
| Function | Purpose | Example |
|----------|---------|---------|
| `render()` | Put component on screen | `render(<MyComponent />)` |
| `screen.getByText()` | Find by text content | `screen.getByText('Submit')` |
| `screen.getByRole()` | Find by ARIA role | `screen.getByRole('button')` |
| `expect().toBeInTheDocument()` | Check element exists | Element is rendered |
| `expect().toBeChecked()` | Check checkbox state | Checkbox is selected |
| `expect().toBeDisabled()` | Check if disabled | Button is disabled |
| `userEvent.click()` | Simulate clicking | User interaction |
| `waitFor()` | Wait for async changes | API calls complete |

### Best Practices
1. **Test user behavior, not implementation**
2. **Use meaningful test descriptions**
3. **Keep tests independent** - each test should work alone
4. **Mock external dependencies** - isolate your component
5. **Test different scenarios** - success, error, loading states

### Test Structure Pattern
```javascript
describe('Component Name', () => {
  // Setup mocks and data
  beforeEach(() => {
    // Reset mocks before each test
  });

  test('should do something specific', async () => {
    // Arrange: Set up component and data
    // Act: Perform user actions
    // Assert: Check expected outcomes
  });
});
```

This step-by-step approach helps you build confidence in testing React components systematically!
