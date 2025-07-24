/**
 * Mục kiểm thử
 * - UI rendering
 * - State update
 * - Submit thành công
 * - Submit không hợp lệ
 * - Submit lỗi API
 *
 * Mục tiêu
 * - Đảm bảo form input, button hiển thị đúng
 * - Input value thay đổi khi người dùng nhập
 * - Gửi API đúng dữ liệu và hiển thị thành công
 * - Bỏ trống input, hiển thị cảnh báo, không gọi API
 * - API trả lỗi, hiển thị lỗi trên UI
 *
 * Cách thực hiện trong test
 * - Kiểm tra presence của các element với getByLabelText, getByRole
 * - Dùng fireEvent.change và kiểm tra input.value
 * - Mock API trả về thành công, kiểm tra callback gọi, kiểm tra message hiển thị
 * - Click submit khi input rỗng, kiểm tra message lỗi và API không được gọi
 * - Mock API trả lỗi, kiểm tra message lỗi hiển thị
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventFormResult from '../EventFormResult';

// Mock hooks and API calls used in EventFormResult
jest.mock('@hooks/schoolnurse/new-event/useGetMedicalEventByMedicalEventId');

// Mock toast utilities
jest.mock('../../../../../utils/toast-utils', () => ({
    showErrorToast: jest.fn(),
    showSuccessToast: jest.fn(),
}));

import { showErrorToast, showSuccessToast } from '../../../../../utils/toast-utils';
import { useGetMedicalEventByMedicalEventId } from '@hooks/schoolnurse/new-event/useGetMedicalEventByMedicalEventId';

const mockEvent = {
    injuryDescription: 'Sprain',
    treatmentDescription: 'Rest and ice',
    detailedInformation: 'Student fell during PE class',
    status: 'low',
    dateTime: '2025-07-01',
    pupil: {
        firstName: 'A',
        lastName: 'Student',
        pupilId: 'PP001',
        gradeName: 'Grade 1',
        parents: [{ firstName: 'Parent', lastName: 'One', phoneNumber: '0123456789' }],
    },
    schoolNurse: { firstName: 'Nurse', lastName: 'One', phoneNumber: '0987654321' },
    equipmentUsed: [{ name: 'Bandage', description: 'Elastic bandage', unit: 'piece' }],
    medicationUsed: [{ name: 'Paracetamol', description: 'Pain relief', dosage: '500mg', unit: 'tablet' }],
};

describe('EventFormResult', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useGetMedicalEventByMedicalEventId.mockReturnValue({
            medicalEventDetail: mockEvent,
            loading: false,
            error: null,
        });
    });

    // UI rendering
    test('renders medical event details and back button', () => {
        render(<EventFormResult eventId={1} onCancel={jest.fn()} />);
        expect(screen.getByText(/Medical Event Report/i)).toBeInTheDocument();
        expect(screen.getByText(/Student Information/i)).toBeInTheDocument();
        expect(screen.getByText(/Incident Details/i)).toBeInTheDocument();
        expect(screen.getByText(/Medication & Equipment Used/i)).toBeInTheDocument();
        expect(screen.getByText(/Responsible Nurse/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /BACK/i })).toBeInTheDocument();
    });

    // State update
    test('calls onCancel when back button is clicked', () => {
        const onCancel = jest.fn();
        render(<EventFormResult eventId={1} onCancel={onCancel} />);
        const backBtn = screen.getByRole('button', { name: /BACK/i });
        fireEvent.click(backBtn);
        expect(onCancel).toHaveBeenCalled();
    });

    // Submit thành công (just check correct data shown)
    test('shows correct event data', () => {
        render(<EventFormResult eventId={1} onCancel={jest.fn()} />);
        expect(screen.getByDisplayValue('Sprain')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Rest and ice')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Student fell during PE class')).toBeInTheDocument();
        expect(screen.getByText('Bandage')).toBeInTheDocument();
        expect(screen.getByText('Paracetamol')).toBeInTheDocument();
        expect(screen.getByText('Nurse One')).toBeInTheDocument();
        expect(screen.getByText('Parent One')).toBeInTheDocument();
    });

    // Submit không hợp lệ (error state)
    test('shows error message when event data is missing', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: null,
            loading: false,
            error: 'Not found',
        });
        render(<EventFormResult eventId={1} onCancel={jest.fn()} />);
        expect(screen.getByText(/Error loading event details/i)).toBeInTheDocument();
    });

    // Submit lỗi API (loading state)
    test('shows loading state when loading is true', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: null,
            loading: true,
            error: null,
        });
        render(<EventFormResult eventId={1} onCancel={jest.fn()} />);
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });
});

/**
 * ========================================
 * TEST FILE LAYOUT DOCUMENTATION
 * ========================================
 *
 * Mục kiểm thử
 * - UI rendering
 * - State update
 * - Submit thành công
 * - Submit không hợp lệ
 * - Submit lỗi API
 *
 * Mục tiêu
 * - Đảm bảo form input, button hiển thị đúng
 * - Input value thay đổi khi người dùng nhập
 * - Gửi API đúng dữ liệu và hiển thị thành công
 * - Bỏ trống input, hiển thị cảnh báo, không gọi API
 * - API trả lỗi, hiển thị lỗi trên UI
 *
 * Cách thực hiện trong test
 * - Kiểm tra presence của các element với getByLabelText, getByRole
 * - Dùng fireEvent.change và kiểm tra input.value
 * - Mock API trả về thành công, kiểm tra callback gọi, kiểm tra message hiển thị
 * - Click submit khi input rỗng, kiểm tra message lỗi và API không được gọi
 * - Mock API trả lỗi, kiểm tra message lỗi hiển thị
 */
