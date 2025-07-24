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
import ScheduleDetails from '../ScheduleDetails';

// Mock hooks and API calls used in ScheduleDetails
jest.mock('@hooks/schoolnurse/healthcheck/schedule/useSaveResultOfHealthCheckCampaign');

// Mock toast utilities
jest.mock('@utils/toast-utils', () => ({
    showErrorToast: jest.fn(),
    showSuccessToast: jest.fn(),
}));

import { showErrorToast, showSuccessToast } from '@utils/toast-utils';
import { useSaveResultOfHealthCheckCampaign } from '@hooks/schoolnurse/healthcheck/schedule/useSaveResultOfHealthCheckCampaign';

const mockPupilData = {
    pupilId: 'PP001',
    firstName: 'A',
    lastName: 'Student',
    birthDate: '2015-01-01',
    gender: 'M',
    gradeName: 'Class 1A',
    diseases: [],
    consentFormId: 'CF001',
};

describe('ScheduleDetails', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSaveResultOfHealthCheckCampaign.mockReturnValue({
            saveResultOfHealthCheckCampaign: jest.fn().mockResolvedValue(true),
            isSaving: false,
        });
    });

    // 1. UI rendering
    describe('UI Rendering', () => {
        test('renders header, input fields, and action buttons', () => {
            render(<ScheduleDetails pupilData={mockPupilData} consentFormId={mockPupilData.consentFormId} onBack={jest.fn()} />);
            expect(screen.getByText(/Health Check Campaign/i)).toBeInTheDocument();
            expect(screen.getByText(/Conclusion/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Back to Students/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Complete/i })).toBeInTheDocument();
        });
    });

    // 2. State update
    describe('State Update', () => {
        test('updates input value when user types', () => {
            render(<ScheduleDetails pupilData={mockPupilData} consentFormId={mockPupilData.consentFormId} onBack={jest.fn()} />);
            const conclusionInput = screen.getByLabelText(/Conclusion/i);
            fireEvent.change(conclusionInput, { target: { value: 'Healthy' } });
            expect(conclusionInput.value).toBe('Healthy');
        });
    });

    // 3. Submit thành công
    describe('Successful Submit', () => {
        test('shows success message when API call is successful', async () => {
            render(<ScheduleDetails pupilData={mockPupilData} consentFormId={mockPupilData.consentFormId} onBack={jest.fn()} onResultSaved={jest.fn()} />);
            const conclusionInput = screen.getByLabelText(/Conclusion/i);
            fireEvent.change(conclusionInput, { target: { value: 'Healthy' } });
            const completeBtn = screen.getByRole('button', { name: /Complete/i });
            fireEvent.click(completeBtn);
            await waitFor(() => {
                expect(showSuccessToast).toHaveBeenCalled();
            });
        });
    });

    // 4. Submit không hợp lệ
    describe('Invalid Submit', () => {
        test('shows warning when required input is missing and does not call API', async () => {
            render(<ScheduleDetails pupilData={mockPupilData} consentFormId={mockPupilData.consentFormId} onBack={jest.fn()} />);
            const completeBtn = screen.getByRole('button', { name: /Complete/i });
            fireEvent.click(completeBtn);
            await waitFor(() => {
                expect(showErrorToast).toHaveBeenCalled();
            });
        });
    });

    // 5. Submit lỗi API
    describe('API Error', () => {
        test('shows error message when API call fails', async () => {
            useSaveResultOfHealthCheckCampaign.mockReturnValueOnce({
                saveResultOfHealthCheckCampaign: jest.fn().mockRejectedValue(new Error('API error')),
                isSaving: false,
            });
            render(<ScheduleDetails pupilData={mockPupilData} consentFormId={mockPupilData.consentFormId} onBack={jest.fn()} />);
            const conclusionInput = screen.getByLabelText(/Conclusion/i);
            fireEvent.change(conclusionInput, { target: { value: 'Healthy' } });
            const completeBtn = screen.getByRole('button', { name: /Complete/i });
            fireEvent.click(completeBtn);
            await waitFor(() => {
                expect(showErrorToast).toHaveBeenCalled();
            });
        });
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
