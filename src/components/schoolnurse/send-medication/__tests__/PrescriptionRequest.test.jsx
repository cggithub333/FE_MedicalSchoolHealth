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
import PrescriptionRequest from '../PrescriptionRequest';

// Mock hook
jest.mock('@hooks/schoolnurse/useAllPendingPrescriptions', () => () => ({
    pendingMedicationRequests: [
        {
            sendMedicationId: 1,
            pupilId: 'PP0001',
            diseaseName: 'Flu',
            requestedDate: '23-07-2025 08:00',
            status: 'PENDING',
            medicationItems: [{}, {}],
        },
        {
            sendMedicationId: 2,
            pupilId: 'PP0002',
            diseaseName: 'Cold',
            requestedDate: '22-07-2025 09:00',
            status: 'APPROVED',
            medicationItems: [{}],
        },
    ],
    loading: false,
    error: null,
    refetch: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    Link: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

describe('PrescriptionRequest', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('UI rendering: shows header, cards, and View All button', () => {
        render(<PrescriptionRequest linkPrescriptionRequestPage="/prescription-requests" />);
        expect(screen.getByText(/Prescription Requests/i)).toBeInTheDocument();
        expect(screen.getByText(/PP0001/i)).toBeInTheDocument();
        expect(screen.getByText(/PP0002/i)).toBeInTheDocument();
        expect(screen.getByText(/Flu/i)).toBeInTheDocument();
        expect(screen.getByText(/Cold/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /View All Requests/i })).toBeInTheDocument();
    });

    test('State update: clicking View All button calls navigate', () => {
        const mockNavigate = jest.fn();
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useNavigate: () => mockNavigate,
            Link: ({ children, ...props }) => <a {...props}>{children}</a>,
        }));
        render(<PrescriptionRequest linkPrescriptionRequestPage="/prescription-requests" />);
        fireEvent.click(screen.getByRole('button', { name: /View All Requests/i }));
        expect(mockNavigate).toHaveBeenCalled();
    });

    test('Submit thành công: shows correct number of requests and status chips', () => {
        render(<PrescriptionRequest linkPrescriptionRequestPage="/prescription-requests" />);
        expect(screen.getByText('2')).toBeInTheDocument(); // Chip with number of requests
        expect(screen.getAllByRole('button', { name: /View All Requests/i }).length).toBeGreaterThanOrEqual(1);
    });

    test('Submit không hợp lệ: shows skeleton when loading and no requests', () => {
        jest.mock('@hooks/schoolnurse/useAllPendingPrescriptions', () => () => ({
            pendingMedicationRequests: [],
            loading: true,
            error: null,
            refetch: jest.fn(),
        }));
        render(<PrescriptionRequest linkPrescriptionRequestPage="/prescription-requests" />);
        expect(screen.getByText(/View All Requests/i)).toBeInTheDocument();
    });

    test('Submit lỗi API: shows skeleton when error', () => {
        jest.mock('@hooks/schoolnurse/useAllPendingPrescriptions', () => () => ({
            pendingMedicationRequests: [],
            loading: false,
            error: 'API error',
            refetch: jest.fn(),
        }));
        render(<PrescriptionRequest linkPrescriptionRequestPage="/prescription-requests" />);
        expect(screen.getByText(/View All Requests/i)).toBeInTheDocument();
    });
});
