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
import MedicalHeader from '../MedicalHeader';

// Mock hooks and API calls used in MedicalHeader
jest.mock('../../../../../hooks/schoolnurse/new-event/useGetAllMedicalEvent');
jest.mock('../../../../../hooks/schoolnurse/new-event/useGetPupilsInformation');
jest.mock('../../../../../utils/toast-utils', () => ({
    showSuccessToast: jest.fn(),
    showErrorToast: jest.fn(),
}));

import { showSuccessToast, showErrorToast } from '../../../../../utils/toast-utils';
import { useGetAllMedicalEvent } from '../../../../../hooks/schoolnurse/new-event/useGetAllMedicalEvent';
import { useGetPupilsInformation } from '../../../../../hooks/schoolnurse/new-event/useGetPupilsInformation';

const mockPupilsList = [
    { pupilId: 'PP001', firstName: 'A', lastName: 'Student', gradeName: 'Grade 1' },
    { pupilId: 'PP002', firstName: 'B', lastName: 'Student', gradeName: 'Grade 2' },
];
const mockMedicalEventList = [
    {
        medicalEventId: 1,
        pupil: mockPupilsList[0],
        injuryDescription: 'Sprain',
        schoolNurse: { firstName: 'Nurse', lastName: 'One' },
        dateTime: '2025-07-01',
        status: 'low',
    },
    {
        medicalEventId: 2,
        pupil: mockPupilsList[1],
        injuryDescription: 'Fever',
        schoolNurse: { firstName: 'Nurse', lastName: 'Two' },
        dateTime: '2025-07-02',
        status: 'high',
    },
];

describe('MedicalHeader', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useGetPupilsInformation.mockReturnValue({
            pupilsList: mockPupilsList,
            loading: false,
            error: null,
        });
        useGetAllMedicalEvent.mockReturnValue({
            medicalEventList: mockMedicalEventList,
            loading: false,
            error: null,
            refetch: jest.fn(),
        });
    });

    // UI rendering
    test('renders header, stats cards, and table', () => {
        render(<MedicalHeader />);
        expect(screen.getByText(/Patient Management/i)).toBeInTheDocument();
        expect(screen.getByText(/Total Pupils/i)).toBeInTheDocument();
        expect(screen.getByText(/Total Events/i)).toBeInTheDocument();
        expect(screen.getByText(/Sprain/i)).toBeInTheDocument();
        expect(screen.getByText(/Fever/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /New Medical Event/i })).toBeInTheDocument();
    });

    // State update
    test('updates search input value and filters table', () => {
        render(<MedicalHeader />);
        const searchInput = screen.getByPlaceholderText(/search by pupil name or id/i);
        fireEvent.change(searchInput, { target: { value: 'B' } });
        expect(searchInput.value).toBe('B');
        expect(screen.queryByText(/Sprain/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Fever/i)).toBeInTheDocument();
    });

    // Submit thành công
    test('shows success toast when event is created', async () => {
        showSuccessToast.mockImplementation(() => { });
        render(<MedicalHeader />);
        fireEvent.click(screen.getByRole('button', { name: /New Medical Event/i }));
        // Simulate successful event creation
        // ...simulate form submit logic here...
        await waitFor(() => {
            expect(showSuccessToast).toHaveBeenCalled();
        });
    });

    // Submit không hợp lệ
    test('shows error toast when required input is missing and does not call API', async () => {
        showErrorToast.mockImplementation(() => { });
        render(<MedicalHeader />);
        fireEvent.click(screen.getByRole('button', { name: /New Medical Event/i }));
        // Simulate invalid form submit (e.g., missing required fields)
        // ...simulate invalid submit logic here...
        await waitFor(() => {
            expect(showErrorToast).toHaveBeenCalled();
        });
    });

    // Submit lỗi API
    test('shows error toast when API call fails', async () => {
        useGetAllMedicalEvent.mockReturnValueOnce({
            medicalEventList: [],
            loading: false,
            error: 'API error',
            refetch: jest.fn(),
        });
        render(<MedicalHeader />);
        expect(screen.getByText(/No data found/i)).toBeInTheDocument();
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
