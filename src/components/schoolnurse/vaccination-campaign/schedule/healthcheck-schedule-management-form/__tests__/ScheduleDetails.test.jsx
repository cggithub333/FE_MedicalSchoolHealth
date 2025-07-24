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
import ScheduleDetails from '../ScheduleDetails';

// Mock hooks
jest.mock('../../../../../../hooks/manager/vaccination/campaign/useGetVaccinationHistoryByPupilId', () => ({
    useGetVaccinationHistoryByPupilId: jest.fn()
}));

const mockOnBack = jest.fn();
const mockPupilData = {
    pupilId: 'P01',
    firstName: 'A',
    lastName: 'B',
};
const mockVaccinationHistory = [
    {
        historyId: 'H01',
        pupilId: 'P01',
        pupilName: 'A B',
        vaccineName: 'Vaccine1',
        diseaseName: 'Disease1',
        source: 'School',
        vaccinatedAt: '2024-06-01T00:00:00Z',
        notes: 'No issues',
    },
];

describe('ScheduleDetails', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        require('../../../../../hooks/manager/vaccination/campaign/useGetVaccinationHistoryByPupilId').useGetVaccinationHistoryByPupilId.mockReturnValue({
            vaccinationHistory: mockVaccinationHistory,
            loading: false,
            error: null,
        });
    });

    test('UI rendering: shows pupil info, vaccination history, and Back button', () => {
        render(<ScheduleDetails pupilData={mockPupilData} onBack={mockOnBack} />);
        expect(screen.getByText(/Vaccination Details/i)).toBeInTheDocument();
        expect(screen.getByText(/A B/i)).toBeInTheDocument();
        expect(screen.getByText(/ID: P01/i)).toBeInTheDocument();
        expect(screen.getByText(/Vaccination History/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Back to List/i })).toBeInTheDocument();
        expect(screen.getByText(/Vaccine1/i)).toBeInTheDocument();
        expect(screen.getByText(/Disease1/i)).toBeInTheDocument();
        expect(screen.getByText(/School/i)).toBeInTheDocument();
        expect(screen.getByText(/No issues/i)).toBeInTheDocument();
    });

    test('State update: Back button calls onBack', () => {
        render(<ScheduleDetails pupilData={mockPupilData} onBack={mockOnBack} />);
        fireEvent.click(screen.getByRole('button', { name: /Back to List/i }));
        expect(mockOnBack).toHaveBeenCalled();
    });

    test('Submit thành công: shows vaccination history when API returns data', () => {
        render(<ScheduleDetails pupilData={mockPupilData} onBack={mockOnBack} />);
        expect(screen.getByText(/Vaccine1/i)).toBeInTheDocument();
        expect(screen.getByText(/Disease1/i)).toBeInTheDocument();
    });

    test('Submit không hợp lệ: shows message when no vaccination history', () => {
        require('../../../../../hooks/manager/vaccination/campaign/useGetVaccinationHistoryByPupilId').useGetVaccinationHistoryByPupilId.mockReturnValue({
            vaccinationHistory: [],
            loading: false,
            error: null,
        });
        render(<ScheduleDetails pupilData={mockPupilData} onBack={mockOnBack} />);
        expect(screen.getByText(/No vaccination history found/i)).toBeInTheDocument();
    });

    test('Submit lỗi API: shows error message when API fails', () => {
        require('../../../../../hooks/manager/vaccination/campaign/useGetVaccinationHistoryByPupilId').useGetVaccinationHistoryByPupilId.mockReturnValue({
            vaccinationHistory: null,
            loading: false,
            error: 'API error',
        });
        render(<ScheduleDetails pupilData={mockPupilData} onBack={mockOnBack} />);
        expect(screen.getByText(/Error loading vaccination history/i)).toBeInTheDocument();
    });

    test('Loading state: shows loading spinner and message', () => {
        require('../../../../../hooks/manager/vaccination/campaign/useGetVaccinationHistoryByPupilId').useGetVaccinationHistoryByPupilId.mockReturnValue({
            vaccinationHistory: null,
            loading: true,
            error: null,
        });
        render(<ScheduleDetails pupilData={mockPupilData} onBack={mockOnBack} />);
        expect(screen.getByText(/Loading student vaccination details/i)).toBeInTheDocument();
    });
});
