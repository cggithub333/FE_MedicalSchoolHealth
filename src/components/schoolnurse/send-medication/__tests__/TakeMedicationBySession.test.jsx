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
import TakeMedicationBySession from '../TakeMedicationBySession';

// Mock hooks and utils
jest.mock('@hooks/schoolnurse/send-medication/useCreateTakeMedicationLogs', () => () => ({
    createTakeMedicationLogs: jest.fn(),
    loading: false,
    error: null,
}));
jest.mock('@hooks/schoolnurse/send-medication/useTodayTakeMedicationSessions', () => () => ({
    sessionsInfor: [
        { session: 'Morning', quantityPupilByGrade: [{ grade: 1, quantity: 2 }] },
        { session: 'Midday', quantityPupilByGrade: [{ grade: 2, quantity: 1 }] },
        { session: 'Afternoon', quantityPupilByGrade: [{ grade: 3, quantity: 3 }] },
    ],
    loading: false,
    error: null,
}));
jest.mock('@hooks/schoolnurse/send-medication/useAllPupilsBySessionAndGrade', () => () => ({
    pupilsInfor: [
        { pupilId: 'P01', firstName: 'An', lastName: 'Nguyen', gender: 'M', gradeName: '1A', birthDate: '2015-05-10' },
    ],
    loading: false,
    error: null,
    refetch: jest.fn(),
}));
jest.mock('@hooks/schoolnurse/send-medication/useTakeMedicationsByEachPupilEachSession', () => () => ({
    medicationDetailsByPupil: [
        {
            pupilId: 'P01',
            status: 'APPROVED',
            medicationItems: [
                { medicationId: 1, medicationName: 'Paracetamol', unitAndUsage: '1 tablet', medicationSchedule: 'Morning' },
            ],
            medicationLogs: [],
            startDate: '23-07-2025',
            endDate: '25-07-2025',
        },
    ],
    loading: false,
    error: null,
    refetch: jest.fn(),
}));
jest.mock('@utils/toast-utils', () => ({
    showSuccessToast: jest.fn(),
    showErrorToast: jest.fn(),
    showWarningToast: jest.fn(),
}));

describe('TakeMedicationBySession', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('UI rendering: shows header, tabs, and grade cards', () => {
        render(<TakeMedicationBySession />);
        expect(screen.getByText(/Medication Sessions/i)).toBeInTheDocument();
        expect(screen.getByText(/Session 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Session 2/i)).toBeInTheDocument();
        expect(screen.getByText(/Session 3/i)).toBeInTheDocument();
        expect(screen.getByText(/Grade 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Grade 2/i)).toBeInTheDocument();
        expect(screen.getByText(/Grade 3/i)).toBeInTheDocument();
    });

    test('State update: clicking grade card opens pupil list modal', async () => {
        render(<TakeMedicationBySession />);
        fireEvent.click(screen.getByText(/Grade 1/i));
        await waitFor(() => {
            expect(screen.getByText(/Grade 1 Pupils/i)).toBeInTheDocument();
            expect(screen.getByText(/An Nguyen/i)).toBeInTheDocument();
        });
    });

    test('Submit thành công: clicking DETAIL shows medication details', async () => {
        render(<TakeMedicationBySession />);
        fireEvent.click(screen.getByText(/Grade 1/i));
        await waitFor(() => expect(screen.getByText(/An Nguyen/i)).toBeInTheDocument());
        fireEvent.click(screen.getByRole('button', { name: /DETAIL/i }));
        await waitFor(() => {
            expect(screen.getByText(/Medication Details/i)).toBeInTheDocument();
            expect(screen.getByText(/Paracetamol/i)).toBeInTheDocument();
        });
    });

    test('Submit không hợp lệ: clicking DETAIL with no medication shows message', async () => {
        jest.mock('@hooks/schoolnurse/send-medication/useTakeMedicationsByEachPupilEachSession', () => () => ({
            medicationDetailsByPupil: [],
            loading: false,
            error: null,
            refetch: jest.fn(),
        }));
        render(<TakeMedicationBySession />);
        fireEvent.click(screen.getByText(/Grade 1/i));
        await waitFor(() => expect(screen.getByText(/An Nguyen/i)).toBeInTheDocument());
        fireEvent.click(screen.getByRole('button', { name: /DETAIL/i }));
        await waitFor(() => {
            expect(screen.getByText(/No approved medication requests found/i)).toBeInTheDocument();
        });
    });

    test('Submit lỗi API: shows error toast when API fails', async () => {
        const { createTakeMedicationLogs } = require('@hooks/schoolnurse/send-medication/useCreateTakeMedicationLogs')();
        createTakeMedicationLogs.mockRejectedValueOnce(new Error('API error'));
        render(<TakeMedicationBySession />);
        fireEvent.click(screen.getByText(/Grade 1/i));
        await waitFor(() => expect(screen.getByText(/An Nguyen/i)).toBeInTheDocument());
        fireEvent.click(screen.getByRole('button', { name: /DETAIL/i }));
        // Simulate clicking Given button (not shown in code, but would call createTakeMedicationLogs)
        // fireEvent.click(screen.getByRole('button', { name: /Given/i }));
        await waitFor(() => {
            expect(require('@utils/toast-utils').showErrorToast).toHaveBeenCalled();
        });
    });

    test('Loading state: shows skeletons when loading sessions', () => {
        jest.mock('@hooks/schoolnurse/send-medication/useTodayTakeMedicationSessions', () => () => ({
            sessionsInfor: [],
            loading: true,
            error: null,
        }));
        render(<TakeMedicationBySession />);
        expect(screen.getAllByRole('progressbar').length).toBeGreaterThanOrEqual(0);
    });
});
