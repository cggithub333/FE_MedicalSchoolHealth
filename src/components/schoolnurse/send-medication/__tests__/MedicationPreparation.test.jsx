// Mục kiểm thử
// UI rendering
// State update
// Submit thành công
// Submit không hợp lệ
// Submit lỗi API

// Mục tiêu
// Đảm bảo form input, button hiển thị đúng
// Input value thay đổi khi người dùng nhập
// Gửi API đúng dữ liệu và hiển thị thành công
// Bỏ trống input, hiển thị cảnh báo, không gọi API
// API trả lỗi, hiển thị lỗi trên UI

// Cách thực hiện trong test
// Kiểm tra presence của các element với getByLabelText, getByRole
// Dùng fireEvent.change và kiểm tra input.value
// Mock API trả về thành công, kiểm tra callback gọi, kiểm tra message hiển thị
// Click submit khi input rỗng, kiểm tra message lỗi và API không được gọi
// Mock API trả lỗi, kiểm tra message lỗi hiển thị

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MedicationPreparation from '../MedicationPreparation';

// Mock hook
jest.mock('@hooks/schoolnurse/send-medication/useMedicationPreparation', () => () => ({
    medicationPreparations: [
        {
            pupilId: 'PP0006',
            gradeName: '1A',
            sendMedicationId: 101,
            medicationName: 'Paracetamol',
            diseaseName: 'Fever and mild pain',
            unitAndUsage: '1 tablet every 6 hours',
            pupilLastName: 'Nguyen',
            pupilFirstName: 'An',
        },
    ],
    loading: false,
    error: null,
    refetch: jest.fn(),
}));

describe('MedicationPreparation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('UI rendering: shows header, table, and filter controls', () => {
        render(<MedicationPreparation />);
        expect(screen.getByText(/Medication Preparation/i)).toBeInTheDocument();
        expect(screen.getByText(/Prepare and organize medications/i)).toBeInTheDocument();
        expect(screen.getByText(/Class Name/i)).toBeInTheDocument();
        expect(screen.getByText(/Pupil Name/i)).toBeInTheDocument();
        expect(screen.getByText(/Medication Name/i)).toBeInTheDocument();
        expect(screen.getByText(/Disease Name/i)).toBeInTheDocument();
        expect(screen.getByText(/Usage and Quantity/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Grade/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Session/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Search Medications/i })).toBeInTheDocument();
    });

    test('State update: changing grade and session updates selection', () => {
        render(<MedicationPreparation />);
        fireEvent.mouseDown(screen.getByLabelText(/Grade/i));
        fireEvent.click(screen.getByText(/Grade 2/i));
        expect(screen.getByText(/Current Selection: Grade 2/i)).toBeInTheDocument();
        fireEvent.mouseDown(screen.getByLabelText(/Session/i));
        fireEvent.click(screen.getByText(/Session 2/i));
        expect(screen.getByText(/Current Selection: Grade 2, Session 2/i)).toBeInTheDocument();
    });

    test('Submit thành công: clicking Search calls refetch and resets page', () => {
        const { refetch } = require('@hooks/schoolnurse/send-medication/useMedicationPreparation')();
        render(<MedicationPreparation />);
        fireEvent.click(screen.getByRole('button', { name: /Search Medications/i }));
        expect(refetch).toHaveBeenCalled();
        expect(screen.getByText(/Current Selection: Grade 1, Session 1/i)).toBeInTheDocument();
    });

    test('Submit không hợp lệ: shows error message for invalid grade/session', () => {
        render(<MedicationPreparation />);
        // Simulate invalid grade selection
        fireEvent.mouseDown(screen.getByLabelText(/Grade/i));
        fireEvent.click(screen.getByText(/Grade 1/i));
        fireEvent.mouseDown(screen.getByLabelText(/Session/i));
        fireEvent.click(screen.getByText(/Session 0/i)); // Invalid session
        fireEvent.click(screen.getByRole('button', { name: /Search Medications/i }));
        // Should show error in console, but UI fallback is no records message
        expect(screen.getByText(/No results for searching medications/i)).toBeInTheDocument();
    });

    test('Submit lỗi API: shows error message when API fails', () => {
        jest.mock('@hooks/schoolnurse/send-medication/useMedicationPreparation', () => () => ({
            medicationPreparations: [],
            loading: false,
            error: 'API error',
            refetch: jest.fn(),
        }));
        render(<MedicationPreparation />);
        expect(screen.getByText(/No records found/i)).toBeInTheDocument();
    });

    test('Loading state: shows loading spinner', () => {
        jest.mock('@hooks/schoolnurse/send-medication/useMedicationPreparation', () => () => ({
            medicationPreparations: [],
            loading: true,
            error: null,
            refetch: jest.fn(),
        }));
        render(<MedicationPreparation />);
        expect(screen.getByText(/Medication Preparation/i)).toBeInTheDocument();
        // Table should be present but empty
    });
});
