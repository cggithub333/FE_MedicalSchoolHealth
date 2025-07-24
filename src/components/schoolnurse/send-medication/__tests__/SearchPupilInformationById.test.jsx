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
import SearchPupilInformationById from '../SearchPupilInformationById';

// Mock hook
jest.mock('@hooks/schoolnurse/useSearchPupilInforByPupilId', () => () => ({
    pupilInfo: {
        firstName: 'An',
        lastName: 'Nguyen',
        gender: 'M',
        birthDate: '2015-05-10',
        gradeName: '1A',
        parents: [
            {
                userId: 'U01',
                firstName: 'Minh',
                lastName: 'Nguyen',
                email: 'parent@example.com',
                phoneNumber: '1234567890',
            },
        ],
    },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
}));

describe('SearchPupilInformationById', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('UI rendering: shows header, input, and pupil info', () => {
        render(<SearchPupilInformationById />);
        expect(screen.getByText(/Pupil Searching/i)).toBeInTheDocument();
        expect(screen.getByText(/Search Pupil Information by ID/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter Pupil ID/i)).toBeInTheDocument();
        expect(screen.getByText(/Pupil Information/i)).toBeInTheDocument();
        expect(screen.getByText(/Parent Information/i)).toBeInTheDocument();
        expect(screen.getByText(/Full Name: An Nguyen/i)).toBeInTheDocument();
        expect(screen.getByText(/Full Name: Minh Nguyen/i)).toBeInTheDocument();
    });

    test('State update: input value changes when user types', () => {
        render(<SearchPupilInformationById />);
        const input = screen.getByPlaceholderText(/Enter Pupil ID/i);
        fireEvent.change(input, { target: { value: 'PP0001' } });
        expect(input.value).toBe('PP0001');
    });

    test('Submit thành công: refetch called and info displayed', async () => {
        const { refetch } = require('@hooks/schoolnurse/useSearchPupilInforByPupilId')();
        render(<SearchPupilInformationById />);
        const input = screen.getByPlaceholderText(/Enter Pupil ID/i);
        fireEvent.change(input, { target: { value: 'PP0001' } });
        await waitFor(() => {
            expect(refetch).toHaveBeenCalledWith('PP0001');
            expect(screen.getByText(/Full Name: An Nguyen/i)).toBeInTheDocument();
        });
    });

    test('Submit không hợp lệ: shows no pupil found when input is empty', async () => {
        jest.mock('@hooks/schoolnurse/useSearchPupilInforByPupilId', () => () => ({
            pupilInfo: null,
            isLoading: false,
            error: null,
            refetch: jest.fn(),
        }));
        render(<SearchPupilInformationById />);
        const input = screen.getByPlaceholderText(/Enter Pupil ID/i);
        fireEvent.change(input, { target: { value: '' } });
        await waitFor(() => {
            expect(screen.getByText(/No pupil found/i)).toBeInTheDocument();
        });
    });

    test('Submit lỗi API: shows error message when API fails', async () => {
        jest.mock('@hooks/schoolnurse/useSearchPupilInforByPupilId', () => () => ({
            pupilInfo: null,
            isLoading: false,
            error: { message: 'API error' },
            refetch: jest.fn(),
        }));
        render(<SearchPupilInformationById />);
        const input = screen.getByPlaceholderText(/Enter Pupil ID/i);
        fireEvent.change(input, { target: { value: 'PP0001' } });
        await waitFor(() => {
            expect(screen.getByText(/Error: API error/i)).toBeInTheDocument();
        });
    });

    test('Loading state: shows searching spinner', () => {
        jest.mock('@hooks/schoolnurse/useSearchPupilInforByPupilId', () => () => ({
            pupilInfo: null,
            isLoading: true,
            error: null,
            refetch: jest.fn(),
        }));
        render(<SearchPupilInformationById />);
        expect(screen.getByText(/Searching.../i)).toBeInTheDocument();
    });
});
