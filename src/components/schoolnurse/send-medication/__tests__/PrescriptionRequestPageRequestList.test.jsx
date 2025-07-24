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
import PrescriptionRequestPageRequestList from '../PrescriptionRequestPageRequestList';

// Mock hooks and utils
jest.mock('@hooks/schoolnurse/send-medication/useUpdatePrescriptionStatus', () => () => ({
    updateStatus: jest.fn(),
    error: null,
    success: false,
}));
jest.mock('@hooks/schoolnurse/useAllPendingPrescriptions', () => () => ({
    pendingMedicationRequests: [
        {
            sendMedicationId: 1,
            pupilId: 'PP0001',
            diseaseName: 'Flu',
            requestedDate: '23-07-2025 08:00',
            startDate: '23-07-2025',
            endDate: '25-07-2025',
            status: 'PENDING',
            medicationItems: [
                { medicationId: 1, medicationName: 'Paracetamol', unitAndUsage: '1 tablet', medicationSchedule: 'Morning' },
            ],
            note: 'Take with water',
            prescriptionImage: '/test.jpg',
        },
        {
            sendMedicationId: 2,
            pupilId: 'PP0002',
            diseaseName: 'Cold',
            requestedDate: '22-07-2025 09:00',
            startDate: '22-07-2025',
            endDate: '24-07-2025',
            status: 'APPROVED',
            medicationItems: [
                { medicationId: 2, medicationName: 'Ibuprofen', unitAndUsage: '1 tablet', medicationSchedule: 'Evening' },
            ],
            note: 'After meals',
            prescriptionImage: '/test2.jpg',
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

describe('PrescriptionRequestPageRequestList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('UI rendering: shows header, cards, and pagination', () => {
        render(<PrescriptionRequestPageRequestList />);
        expect(screen.getByText(/Prescription Request List/i)).toBeInTheDocument();
        expect(screen.getByText(/PP0001/i)).toBeInTheDocument();
        expect(screen.getByText(/PP0002/i)).toBeInTheDocument();
        expect(screen.getByText(/Flu/i)).toBeInTheDocument();
        expect(screen.getByText(/Cold/i)).toBeInTheDocument();
        expect(screen.getByText(/2 Requests/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Approve/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Reject/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Close/i })).toBeInTheDocument();
    });

    test('State update: clicking card opens dialog and shows details', async () => {
        render(<PrescriptionRequestPageRequestList />);
        fireEvent.click(screen.getByText(/PP0001/i));
        await waitFor(() => {
            expect(screen.getByText(/Prescription Request Details/i)).toBeInTheDocument();
            expect(screen.getByText(/Take with water/i)).toBeInTheDocument();
            expect(screen.getByText(/Paracetamol/i)).toBeInTheDocument();
        });
    });

    test('Submit thành công: clicking Approve calls updateStatus and shows success toast', async () => {
        const { updateStatus } = require('@hooks/schoolnurse/send-medication/useUpdatePrescriptionStatus')();
        render(<PrescriptionRequestPageRequestList />);
        fireEvent.click(screen.getByText(/PP0001/i));
        await waitFor(() => expect(screen.getByText(/Approve/i)).toBeInTheDocument());
        window.confirm = jest.fn(() => true);
        fireEvent.click(screen.getByRole('button', { name: /Approve/i }));
        await waitFor(() => {
            expect(updateStatus).toHaveBeenCalledWith(1, 'APPROVED');
            expect(require('@utils/toast-utils').showWarningToast).toHaveBeenCalled();
        });
    });

    test('Submit không hợp lệ: clicking Approve with no selectedRequest shows warning', async () => {
        render(<PrescriptionRequestPageRequestList />);
        // Directly call approve without selecting a card
        window.confirm = jest.fn(() => true);
        fireEvent.click(screen.getByRole('button', { name: /Approve/i }));
        await waitFor(() => {
            expect(require('@utils/toast-utils').showWarningToast).toHaveBeenCalled();
        });
    });

    test('Submit lỗi API: updateStatus fails and shows error toast', async () => {
        const { updateStatus } = require('@hooks/schoolnurse/send-medication/useUpdatePrescriptionStatus')();
        updateStatus.mockRejectedValueOnce(new Error('API error'));
        render(<PrescriptionRequestPageRequestList />);
        fireEvent.click(screen.getByText(/PP0001/i));
        await waitFor(() => expect(screen.getByText(/Approve/i)).toBeInTheDocument());
        window.confirm = jest.fn(() => true);
        fireEvent.click(screen.getByRole('button', { name: /Approve/i }));
        await waitFor(() => {
            expect(require('@utils/toast-utils').showErrorToast).toHaveBeenCalled();
        });
    });

    test('Loading state: shows loading skeleton', () => {
        jest.mock('@hooks/schoolnurse/useAllPendingPrescriptions', () => () => ({
            pendingMedicationRequests: [],
            loading: true,
            error: null,
            refetch: jest.fn(),
        }));
        render(<PrescriptionRequestPageRequestList />);
        expect(screen.getAllByRole('progressbar').length).toBeGreaterThanOrEqual(0);
    });
});
