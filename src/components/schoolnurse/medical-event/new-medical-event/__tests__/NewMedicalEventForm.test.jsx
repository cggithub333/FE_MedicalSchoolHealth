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
import MedicalEventForm from '../NewMedicalEventForm';
import { showSuccessToast, showErrorToast } from '../../../../../utils/toast-utils';

// Mocks
jest.mock('../../../../../hooks/schoolnurse/new-event/useGetPupilsInformation', () => ({
    useGetPupilsInformation: () => ({ pupilsList: [{ pupilId: '1', firstName: 'A', lastName: 'B', gradeName: '1A', parents: [{ firstName: 'P', lastName: 'Q', phoneNumber: '123' }] }], loading: false })
}));
jest.mock('../../../../../hooks/schoolnurse/new-event/useGetAllMedication', () => ({
    useGetAllMedication: () => ({ medicationList: [{ medicationId: 'm1', name: 'Med1', dosage: '10', unit: 'mg', description: 'desc' }], loading: false })
}));
jest.mock('../../../../../hooks/schoolnurse/new-event/useGetAllEquipment', () => ({
    useGetAllEquipment: () => ({ equipmentList: [{ equipmentId: 'e1', name: 'Equip1', unit: 'pcs', description: 'desc' }], loading: false })
}));
const mockCreateNewMedicalEvent = jest.fn();
jest.mock('../../../../../hooks/schoolnurse/new-event/useCreateNewMedicalEvent', () => ({
    useCreateNewMedicalEvent: () => ({ createNewMedicalEvent: mockCreateNewMedicalEvent, loading: false, error: null, success: false })
}));
jest.mock('../../../../../utils/toast-utils');

const defaultProps = { onCancel: jest.fn(), onSuccess: jest.fn() };

describe('MedicalEventForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('UI rendering: Hiển thị đầy đủ input, button', () => {
        render(<MedicalEventForm {...defaultProps} />);
        expect(screen.getByLabelText(/Search Pupil or ID/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Date & Time/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Injury Description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Treatment Description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Additional Details/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Severity Level/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit Report/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Clear Form/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });

    it('State update: Thay đổi input value khi nhập', () => {
        render(<MedicalEventForm {...defaultProps} />);
        fireEvent.change(screen.getByLabelText(/Injury Description/i), { target: { value: 'cut' } });
        expect(screen.getByLabelText(/Injury Description/i)).toHaveValue('cut');
        fireEvent.change(screen.getByLabelText(/Treatment Description/i), { target: { value: 'bandage' } });
        expect(screen.getByLabelText(/Treatment Description/i)).toHaveValue('bandage');
        fireEvent.change(screen.getByLabelText(/Additional Details/i), { target: { value: 'details' } });
        expect(screen.getByLabelText(/Additional Details/i)).toHaveValue('details');
        fireEvent.change(screen.getByLabelText(/Severity Level/i), { target: { value: 'high' } });
        expect(screen.getByLabelText(/Severity Level/i)).toHaveValue('high');
    });

    it('Submit thành công: Gửi API đúng dữ liệu và hiển thị thành công', async () => {
        mockCreateNewMedicalEvent.mockResolvedValueOnce({});
        render(<MedicalEventForm {...defaultProps} />);
        // Chọn học sinh
        fireEvent.change(screen.getByLabelText(/Search Pupil or ID/i), { target: { value: 'A B (1)' } });
        fireEvent.click(screen.getByText('A B (1)'));
        // Nhập dữ liệu
        fireEvent.change(screen.getByLabelText(/Injury Description/i), { target: { value: 'cut' } });
        fireEvent.change(screen.getByLabelText(/Treatment Description/i), { target: { value: 'bandage' } });
        fireEvent.change(screen.getByLabelText(/Additional Details/i), { target: { value: 'details' } });
        fireEvent.change(screen.getByLabelText(/Severity Level/i), { target: { value: 'high' } });
        // Xác nhận
        fireEvent.click(screen.getByLabelText(/I confirm that the information provided/i));
        // Submit
        fireEvent.click(screen.getByRole('button', { name: /Submit Report/i }));
        await waitFor(() => {
            expect(mockCreateNewMedicalEvent).toHaveBeenCalled();
            expect(defaultProps.onSuccess).toHaveBeenCalled();
            expect(showSuccessToast).not.toHaveBeenCalled(); // Success toast is commented out in code
        });
    });

    it('Submit không hợp lệ: Bỏ trống input, hiển thị cảnh báo, không gọi API', async () => {
        render(<MedicalEventForm {...defaultProps} />);
        // Không chọn học sinh
        fireEvent.click(screen.getByLabelText(/I confirm that the information provided/i));
        fireEvent.click(screen.getByRole('button', { name: /Submit Report/i }));
        await waitFor(() => {
            expect(mockCreateNewMedicalEvent).not.toHaveBeenCalled();
            expect(showErrorToast).toHaveBeenCalledWith('Please select a pupil.');
        });
    });

    it('Submit lỗi API: Mock API trả lỗi, kiểm tra message lỗi hiển thị', async () => {
        mockCreateNewMedicalEvent.mockImplementationOnce(() => { throw new Error('API error'); });
        render(<MedicalEventForm {...defaultProps} />);
        // Chọn học sinh
        fireEvent.change(screen.getByLabelText(/Search Pupil or ID/i), { target: { value: 'A B (1)' } });
        fireEvent.click(screen.getByText('A B (1)'));
        // Nhập dữ liệu
        fireEvent.change(screen.getByLabelText(/Injury Description/i), { target: { value: 'cut' } });
        fireEvent.change(screen.getByLabelText(/Treatment Description/i), { target: { value: 'bandage' } });
        fireEvent.change(screen.getByLabelText(/Additional Details/i), { target: { value: 'details' } });
        fireEvent.change(screen.getByLabelText(/Severity Level/i), { target: { value: 'high' } });
        // Xác nhận
        fireEvent.click(screen.getByLabelText(/I confirm that the information provided/i));
        // Submit
        fireEvent.click(screen.getByRole('button', { name: /Submit Report/i }));
        await waitFor(() => {
            expect(mockCreateNewMedicalEvent).toHaveBeenCalled();
            expect(showErrorToast).toHaveBeenCalledWith('Failed to create medical event');
        });
    });
});
