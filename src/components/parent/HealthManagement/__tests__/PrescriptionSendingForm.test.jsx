
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import PrescriptionSendingForm from "../PrescriptionSendingForm";
import { showSuccessToast, showErrorToast } from "@utils/toast-utils";

// Mock hooks and utilities
const mockSendMedication = jest.fn();
const mockHandleUpload = jest.fn();
const mockHandleReset = jest.fn();
const mockHandleFileSelect = jest.fn();
const mockHandleDrop = jest.fn();
const mockHandleDragOver = jest.fn();

// Mock file input ref
const mockFileInputRef = {
  current: {
    click: jest.fn()
  }
};

jest.mock("@hooks/parent/usePupils", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    pupils: [
      {
        pupilId: "p1",
        lastName: "Nguyen",
        firstName: "An",
        birthDate: "2012-01-01",
        gender: "M",
        gradeName: "5A",
      },
      {
        pupilId: "p2",
        lastName: "Tran",
        firstName: "Binh",
        birthDate: "2013-05-15",
        gender: "F",
        gradeName: "4B",
      },
    ],
    isLoading: false,
  }))
}));

jest.mock("@hooks/parent/send-medication/useSendMedication", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    sendMedication: mockSendMedication,
  }))
}));

jest.mock("@hooks/magic-hooks/useUploadImage", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    selectedFile: null,
    preview: null,
    uploading: false,
    uploadProgress: 0,
    imageUrl: null,
    error: null,
    fileInputRef: mockFileInputRef,
    handleFileSelect: mockHandleFileSelect,
    handleDrop: mockHandleDrop,
    handleDragOver: mockHandleDragOver,
    handleUpload: mockHandleUpload,
    handleReset: mockHandleReset,
  }))
}));

jest.mock("@utils/toast-utils", () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
}));

describe("PrescriptionSendingForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSendMedication.mockReset();
    mockHandleUpload.mockReset();
    mockHandleReset.mockReset();
    mockHandleFileSelect.mockReset();
    mockHandleDrop.mockReset();
    mockHandleDragOver.mockReset();
  });

  describe("Component Rendering", () => {
    it("renders all form fields and buttons", () => {
      render(<PrescriptionSendingForm />);
      expect(screen.getByText(/New Prescription/i)).toBeInTheDocument();
      expect(screen.getByText(/Select Pupil/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Disease Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description Notes/i)).toBeInTheDocument();
      expect(screen.getByText(/Add Medication/i)).toBeInTheDocument();
      expect(screen.getByText(/Send Prescription/i)).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it("renders pupil select dropdown", () => {
      render(<PrescriptionSendingForm />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it("displays medication schedule options", () => {
      render(<PrescriptionSendingForm />);
      expect(screen.getByLabelText(/After breakfast: 9h00-9h30/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Before lunch: 10h30-11h00/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/After lunch: 11h30-12h00/i)).toBeInTheDocument();
    });

    it("shows image upload area", () => {
      render(<PrescriptionSendingForm />);
      expect(screen.getByText(/Drop image here or click to browse/i)).toBeInTheDocument();
      expect(screen.getByText(/Supports: JPG, PNG, GIF \(Max 10MB\)/i)).toBeInTheDocument();
    });
  });

  describe("Form Interactions", () => {
    it("updates state when user types in inputs", () => {
      render(<PrescriptionSendingForm />);
      fireEvent.change(screen.getByLabelText(/Disease Name/i), { target: { value: "Flu" } });
      expect(screen.getByLabelText(/Disease Name/i)).toHaveValue("Flu");
      fireEvent.change(screen.getByLabelText(/Description Notes/i), { target: { value: "Take care" } });
      expect(screen.getByLabelText(/Description Notes/i)).toHaveValue("Take care");
    });

    it("updates medication fields", () => {
      render(<PrescriptionSendingForm />);
      fireEvent.change(screen.getByLabelText(/Medication Name/i), { target: { value: "Aspirin" } });
      expect(screen.getByLabelText(/Medication Name/i)).toHaveValue("Aspirin");
      fireEvent.change(screen.getByLabelText(/Unit and Usage/i), { target: { value: "1 tablet" } });
      expect(screen.getByLabelText(/Unit and Usage/i)).toHaveValue("1 tablet");
    });

    it("allows selecting medication schedule", () => {
      render(<PrescriptionSendingForm />);
      const radioOption = screen.getByLabelText(/After breakfast: 9h00-9h30/i);
      fireEvent.click(radioOption);
      expect(radioOption).toBeChecked();
    });

    it("toggles confirmation checkbox", () => {
      render(<PrescriptionSendingForm />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe("Pupil Selection", () => {
    it("opens pupil dropdown and displays options", async () => {
      const user = userEvent.setup();
      render(<PrescriptionSendingForm />);
      
      const select = screen.getByRole('combobox');
      await user.click(select);
      
      await waitFor(() => {
        expect(screen.getByText('p1')).toBeInTheDocument();
        expect(screen.getByText('p2')).toBeInTheDocument();
      });
    });

    it("selects a pupil and shows pupil information", async () => {
      const user = userEvent.setup();
      render(<PrescriptionSendingForm />);
      
      const select = screen.getByRole('combobox');
      await user.click(select);
      
      const pupil1Option = await screen.findByText('p1');
      await user.click(pupil1Option);
      
      await waitFor(() => {
        expect(screen.getByText(/Nguyen An/)).toBeInTheDocument();
        expect(screen.getByText(/2012-01-01/)).toBeInTheDocument();
        expect(screen.getByText(/Male/)).toBeInTheDocument();
        expect(screen.getByText(/5A/)).toBeInTheDocument();
      });
    });

    it("displays female gender correctly for female pupils", async () => {
      const user = userEvent.setup();
      render(<PrescriptionSendingForm />);
      
      const select = screen.getByRole('combobox');
      await user.click(select);
      
      const pupil2Option = await screen.findByText('p2');
      await user.click(pupil2Option);
      
      await waitFor(() => {
        expect(screen.getByText(/Female/)).toBeInTheDocument();
      });
    });
  });

  describe("Medication Management", () => {
    it("adds new medication item", () => {
      render(<PrescriptionSendingForm />);
      expect(screen.getAllByText(/Medication \d+/)).toHaveLength(1);
      
      const addButton = screen.getByText(/Add Medication/i);
      fireEvent.click(addButton);
      
      expect(screen.getAllByText(/Medication \d+/)).toHaveLength(2);
    });

    it("removes medication item when multiple exist", () => {
      render(<PrescriptionSendingForm />);
      
      // Add another medication first
      const addButton = screen.getByText(/Add Medication/i);
      fireEvent.click(addButton);
      
      expect(screen.getAllByText(/Medication \d+/)).toHaveLength(2);
      
      // Now remove one
      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      fireEvent.click(deleteButtons[0]);
      
      expect(screen.getAllByText(/Medication \d+/)).toHaveLength(1);
    });

    it("does not remove medication if only one exists", () => {
      render(<PrescriptionSendingForm />);
      expect(screen.getAllByText(/Medication \d+/)).toHaveLength(1);
      
      // Should not have delete button when only one medication exists
      expect(screen.queryByTestId('DeleteIcon')).not.toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("shows validation errors and does not call API on invalid submit", async () => {
      render(<PrescriptionSendingForm />);
      
      // Enable submit button by checking checkbox
      fireEvent.click(screen.getByRole("checkbox"));
      fireEvent.click(screen.getByText(/Send Prescription/i));
      
      await waitFor(() => {
        expect(screen.getByText(/Please select a pupil/i)).toBeInTheDocument();
        expect(screen.getByText(/Disease name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Start date is required/i)).toBeInTheDocument();
        expect(screen.getByText(/End date is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Notes are required/i)).toBeInTheDocument();
      });
      
      expect(mockSendMedication).not.toHaveBeenCalled();
    });

    it("validates start date must be after today", async () => {
      render(<PrescriptionSendingForm />);
      
      fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: "2020-01-01" } });
      fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: "2020-01-02" } });
      fireEvent.click(screen.getByRole("checkbox"));
      fireEvent.click(screen.getByText(/Send Prescription/i));
      
      await waitFor(() => {
        expect(screen.getByText(/Start date must be after today/i)).toBeInTheDocument();
      });
    });

    it("validates end date must be after start date", async () => {
      render(<PrescriptionSendingForm />);
      
      fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: "2099-01-02" } });
      fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: "2099-01-01" } });
      fireEvent.click(screen.getByRole("checkbox"));
      fireEvent.click(screen.getByText(/Send Prescription/i));
      
      await waitFor(() => {
        expect(screen.getByText(/End date must be after start date/i)).toBeInTheDocument();
      });
    });

    it("validates medication fields", async () => {
      render(<PrescriptionSendingForm />);
      
      fireEvent.click(screen.getByRole("checkbox"));
      fireEvent.click(screen.getByText(/Send Prescription/i));
      
      await waitFor(() => {
        expect(screen.getByText(/Medication name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Unit and usage is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Schedule is required/i)).toBeInTheDocument();
      });
    });
  });

  describe("Image Upload", () => {
    it("triggers file input when upload area is clicked", () => {
      render(<PrescriptionSendingForm />);
      
      const uploadArea = screen.getByText(/Drop image here or click to browse/i).closest('div');
      fireEvent.click(uploadArea);
      
      expect(mockFileInputRef.current.click).toHaveBeenCalled();
    });

    it("shows preview when file is selected", () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      // Mock the useUploadImage hook to return selected file and preview
      jest.mocked(require("@hooks/magic-hooks/useUploadImage").default).mockReturnValue({
        selectedFile: mockFile,
        preview: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ',
        uploading: false,
        uploadProgress: 0,
        imageUrl: null,
        error: null,
        fileInputRef: mockFileInputRef,
        handleFileSelect: mockHandleFileSelect,
        handleDrop: mockHandleDrop,
        handleDragOver: mockHandleDragOver,
        handleUpload: mockHandleUpload,
        handleReset: mockHandleReset,
      });
      
      render(<PrescriptionSendingForm />);
      
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByText('test.jpg')).toBeInTheDocument();
      expect(screen.getByText('Remove')).toBeInTheDocument();
    });

    it("shows upload progress", () => {
      jest.mocked(require("@hooks/magic-hooks/useUploadImage").default).mockReturnValue({
        selectedFile: new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
        preview: null,
        uploading: true,
        uploadProgress: 50,
        imageUrl: null,
        error: null,
        fileInputRef: mockFileInputRef,
        handleFileSelect: mockHandleFileSelect,
        handleDrop: mockHandleDrop,
        handleDragOver: mockHandleDragOver,
        handleUpload: mockHandleUpload,
        handleReset: mockHandleReset,
      });
      
      render(<PrescriptionSendingForm />);
      
      expect(screen.getByText(/Uploading\.\.\. 50%/)).toBeInTheDocument();
    });

    it("shows success message when image is uploaded", () => {
      jest.mocked(require("@hooks/magic-hooks/useUploadImage").default).mockReturnValue({
        selectedFile: null,
        preview: null,
        uploading: false,
        uploadProgress: 100,
        imageUrl: 'https://example.com/image.jpg',
        error: null,
        fileInputRef: mockFileInputRef,
        handleFileSelect: mockHandleFileSelect,
        handleDrop: mockHandleDrop,
        handleDragOver: mockHandleDragOver,
        handleUpload: mockHandleUpload,
        handleReset: mockHandleReset,
      });
      
      render(<PrescriptionSendingForm />);
      
      expect(screen.getByText(/Image uploaded successfully/)).toBeInTheDocument();
    });

    it("shows error message when upload fails", () => {
      jest.mocked(require("@hooks/magic-hooks/useUploadImage").default).mockReturnValue({
        selectedFile: null,
        preview: null,
        uploading: false,
        uploadProgress: 0,
        imageUrl: null,
        error: 'Upload failed',
        fileInputRef: mockFileInputRef,
        handleFileSelect: mockHandleFileSelect,
        handleDrop: mockHandleDrop,
        handleDragOver: mockHandleDragOver,
        handleUpload: mockHandleUpload,
        handleReset: mockHandleReset,
      });
      
      render(<PrescriptionSendingForm />);
      
      expect(screen.getByText(/Upload Error: Upload failed/)).toBeInTheDocument();
    });

    it("handles remove button click", () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      jest.mocked(require("@hooks/magic-hooks/useUploadImage").default).mockReturnValue({
        selectedFile: mockFile,
        preview: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ',
        uploading: false,
        uploadProgress: 0,
        imageUrl: null,
        error: null,
        fileInputRef: mockFileInputRef,
        handleFileSelect: mockHandleFileSelect,
        handleDrop: mockHandleDrop,
        handleDragOver: mockHandleDragOver,
        handleUpload: mockHandleUpload,
        handleReset: mockHandleReset,
      });
      
      render(<PrescriptionSendingForm />);
      
      const removeButton = screen.getByText('Remove');
      fireEvent.click(removeButton);
      
      expect(mockHandleReset).toHaveBeenCalled();
    });
  });

  describe("Form Submission", () => {
    const fillValidForm = async () => {
      const user = userEvent.setup();
      
      // Select pupil
      const select = screen.getByRole('combobox');
      await user.click(select);
      const pupil1Option = await screen.findByText('p1');
      await user.click(pupil1Option);

      // Fill other required fields
      fireEvent.change(screen.getByLabelText(/Disease Name/i), { target: { value: "Flu" } });
      fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: "2099-01-01" } });
      fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: "2099-01-02" } });
      fireEvent.change(screen.getByLabelText(/Description Notes/i), { target: { value: "Take care" } });
      fireEvent.change(screen.getByLabelText(/Medication Name/i), { target: { value: "Med1" } });
      fireEvent.change(screen.getByLabelText(/Unit and Usage/i), { target: { value: "1 pill" } });
      fireEvent.click(screen.getByLabelText(/After breakfast: 9h00-9h30/i));
      fireEvent.click(screen.getByRole("checkbox"));
    };

    it("submits form and shows success message on valid input", async () => {
      mockSendMedication.mockResolvedValueOnce({});
      render(<PrescriptionSendingForm />);
      
      await fillValidForm();
      fireEvent.click(screen.getByText(/Send Prescription/i));
      
      await waitFor(() => {
        expect(mockSendMedication).toHaveBeenCalledWith({
          pupilId: "p1",
          diseaseName: "Flu",
          startDate: "2099-01-01",
          endDate: "2099-01-02",
          prescriptionImage: null,
          note: "Take care",
          medicationItems: [{
            medicationName: "Med1",
            unitAndUsage: "1 pill",
            medicationSchedule: "After breakfast: 9h00-9h30",
          }],
        });
        expect(showSuccessToast).toHaveBeenCalled();
      });
    });

    it("shows error message if API fails", async () => {
      mockSendMedication.mockRejectedValueOnce(new Error("API error"));
      render(<PrescriptionSendingForm />);
      
      await fillValidForm();
      fireEvent.click(screen.getByText(/Send Prescription/i));
      
      await waitFor(() => {
        expect(mockSendMedication).toHaveBeenCalled();
        expect(showErrorToast).toHaveBeenCalled();
      });
    });

    it("uploads image first if file selected but not uploaded", async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      mockHandleUpload.mockResolvedValueOnce('https://example.com/image.jpg');
      mockSendMedication.mockResolvedValueOnce({});
      
      jest.mocked(require("@hooks/magic-hooks/useUploadImage").default).mockReturnValue({
        selectedFile: mockFile,
        preview: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ',
        uploading: false,
        uploadProgress: 0,
        imageUrl: null,
        error: null,
        fileInputRef: mockFileInputRef,
        handleFileSelect: mockHandleFileSelect,
        handleDrop: mockHandleDrop,
        handleDragOver: mockHandleDragOver,
        handleUpload: mockHandleUpload,
        handleReset: mockHandleReset,
      });
      
      render(<PrescriptionSendingForm />);
      
      await fillValidForm();
      fireEvent.click(screen.getByText(/Send Prescription/i));
      
      await waitFor(() => {
        expect(mockHandleUpload).toHaveBeenCalled();
        expect(mockSendMedication).toHaveBeenCalledWith(
          expect.objectContaining({
            prescriptionImage: 'https://example.com/image.jpg'
          })
        );
      });
    });

    it("handles image upload failure during submission", async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      mockHandleUpload.mockRejectedValueOnce(new Error("Upload failed"));
      
      jest.mocked(require("@hooks/magic-hooks/useUploadImage").default).mockReturnValue({
        selectedFile: mockFile,
        preview: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ',
        uploading: false,
        uploadProgress: 0,
        imageUrl: null,
        error: null,
        fileInputRef: mockFileInputRef,
        handleFileSelect: mockHandleFileSelect,
        handleDrop: mockHandleDrop,
        handleDragOver: mockHandleDragOver,
        handleUpload: mockHandleUpload,
        handleReset: mockHandleReset,
      });
      
      render(<PrescriptionSendingForm />);
      
      await fillValidForm();
      fireEvent.click(screen.getByText(/Send Prescription/i));
      
      await waitFor(() => {
        expect(mockHandleUpload).toHaveBeenCalled();
        expect(showErrorToast).toHaveBeenCalledWith("Failed to upload image. Please try again.");
        expect(mockSendMedication).not.toHaveBeenCalled();
      });
    });

    it("shows loading state during submission", async () => {
      mockSendMedication.mockImplementation(() => new Promise(() => {})); // Never resolves
      render(<PrescriptionSendingForm />);
      
      await fillValidForm();
      fireEvent.click(screen.getByText(/Send Prescription/i));
      
      await waitFor(() => {
        expect(screen.getByText(/Sending prescription.../)).toBeInTheDocument();
      });
    });

    it("shows uploading image text when file needs upload", async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      mockHandleUpload.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      jest.mocked(require("@hooks/magic-hooks/useUploadImage").default).mockReturnValue({
        selectedFile: mockFile,
        preview: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ',
        uploading: false,
        uploadProgress: 0,
        imageUrl: null,
        error: null,
        fileInputRef: mockFileInputRef,
        handleFileSelect: mockHandleFileSelect,
        handleDrop: mockHandleDrop,
        handleDragOver: mockHandleDragOver,
        handleUpload: mockHandleUpload,
        handleReset: mockHandleReset,
      });
      
      render(<PrescriptionSendingForm />);
      
      await fillValidForm();
      fireEvent.click(screen.getByText(/Send Prescription/i));
      
      await waitFor(() => {
        expect(screen.getByText(/Uploading image.../)).toBeInTheDocument();
      });
    });

    it("resets form after successful submission", async () => {
      mockSendMedication.mockResolvedValueOnce({});
      render(<PrescriptionSendingForm />);
      
      await fillValidForm();
      fireEvent.click(screen.getByText(/Send Prescription/i));
      
      await waitFor(() => {
        expect(mockSendMedication).toHaveBeenCalled();
        expect(mockHandleReset).toHaveBeenCalled();
      });
      
      // Check that form fields are reset
      await waitFor(() => {
        expect(screen.getByLabelText(/Disease Name/i)).toHaveValue("");
        expect(screen.getByLabelText(/Description Notes/i)).toHaveValue("");
        expect(screen.getByRole("checkbox")).not.toBeChecked();
      });
    });
  });

  describe("Confirmation Alert", () => {
    it("shows warning when confirmation is not checked", () => {
      render(<PrescriptionSendingForm />);
      expect(screen.getByText(/Please confirm that you have read and agreed to the terms/)).toBeInTheDocument();
    });

    it("hides warning when confirmation is checked", () => {
      render(<PrescriptionSendingForm />);
      fireEvent.click(screen.getByRole("checkbox"));
      expect(screen.queryByText(/Please confirm that you have read and agreed to the terms/)).not.toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("handles loading pupils state", () => {
      jest.mocked(require("@hooks/parent/usePupils").default).mockReturnValue({
        pupils: [],
        isLoading: true,
      });
      
      render(<PrescriptionSendingForm />);
      expect(screen.getByText(/Loading pupil\.\./)).toBeInTheDocument();
    });

    it("disables submit button when not confirmed", () => {
      render(<PrescriptionSendingForm />);
      const submitButton = screen.getByText(/Send Prescription/i);
      expect(submitButton).toBeDisabled();
    });

    it("enables submit button when confirmed", () => {
      render(<PrescriptionSendingForm />);
      const submitButton = screen.getByText(/Send Prescription/i);
      fireEvent.click(screen.getByRole("checkbox"));
      expect(submitButton).not.toBeDisabled();
    });
  });
});
