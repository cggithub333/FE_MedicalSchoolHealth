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
import ScheduleInjectedList from '../ScheduleInjectedList';

// Mock hooks and utils
jest.mock('../../../../../../hooks/schoolnurse/vaccination/vaccination/useGetAllConsentFormByStatus', () => ({
    useGetAllConsentFormByStatus: jest.fn()
}));
jest.mock('../../../../../../hooks/schoolnurse/vaccination/vaccination/useSaveResultOfVaccinationCampaign', () => ({
    useSaveResultOfVaccinationCampaign: () => ({
        saveResultOfVaccinationCampaign: jest.fn(),
        isSaving: false,
    })
}));
jest.mock('../../../../../../utils/toast-utils', () => ({
    showSuccessToast: jest.fn(),
    showErrorToast: jest.fn()
}));

const mockOnBack = jest.fn();
const mockShift = {
    grade: 1,
    time: '08:00 - 11:00',
    campaignId: 1,
    students: [
        { pupilId: 'P01', firstName: 'A', lastName: 'B', Grade: 1, completed: false, consentFormId: 'C01', status: 'APPROVED', notes: '' },
        { pupilId: 'P02', firstName: 'C', lastName: 'D', Grade: 1, completed: true, consentFormId: 'C02', status: 'INJECTED', notes: 'Done' },
    ],
};
const mockCampaign = {
    campaignId: 1,
    titleCampaign: 'Test Campaign',
    vaccineName: 'VaccineX',
};

function setup({ injected = [], noShow = [], approved = [], isLoading = false }) {
    require('../../../../../../hooks/schoolnurse/vaccination/vaccination/useGetAllConsentFormByStatus').useGetAllConsentFormByStatus
        .mockImplementation((campaignId, status) => {
            if (status === 'INJECTED') return { consentForms: injected, isLoading };
            if (status === 'NO_SHOW') return { consentForms: noShow, isLoading };
            return { consentForms: approved, isLoading };
        });
    render(<ScheduleInjectedList shift={mockShift} campaign={mockCampaign} onBack={mockOnBack} />);
}

describe('ScheduleInjectedList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('UI rendering: shows campaign info, grade, students, and buttons', () => {
        setup({ injected: [mockShift.students[1]], noShow: [], approved: [mockShift.students[0], mockShift.students[1]] });
        expect(screen.getByText(/Test Campaign/i)).toBeInTheDocument();
        expect(screen.getByText(/Grade 1 Only/i)).toBeInTheDocument();
        expect(screen.getByText(/VaccineX/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Export/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Back to Schedule/i })).toBeInTheDocument();
        expect(screen.getByText(/A B/i)).toBeInTheDocument();
        expect(screen.getByText(/C D/i)).toBeInTheDocument();
    });

    test('State update: clicking Details shows ScheduleDetails', async () => {
        setup({ injected: [mockShift.students[1]], noShow: [], approved: [mockShift.students[0], mockShift.students[1]] });
        fireEvent.click(screen.getAllByRole('button', { name: /Details/i })[0]);
        await waitFor(() => {
            expect(screen.getByText(/Vaccination Details/i)).toBeInTheDocument();
        });
    });

    test('Submit thành công: saving status updates UI and shows success', async () => {
        const { saveResultOfVaccinationCampaign } = require('../../../../../../hooks/schoolnurse/vaccination/vaccination/useSaveResultOfVaccinationCampaign').useSaveResultOfVaccinationCampaign();
        saveResultOfVaccinationCampaign.mockResolvedValueOnce(true);
        setup({ injected: [], noShow: [], approved: [mockShift.students[0]] });
        // Switch to Not Yet tab
        fireEvent.click(screen.getAllByRole('tab')[2]);
        // Check the first student
        fireEvent.click(screen.getAllByRole('checkbox')[0]);
        // Confirm dialog
        fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
        await waitFor(() => {
            expect(require('../../../../../../utils/toast-utils').showSuccessToast).toHaveBeenCalled();
            expect(screen.getByText(/Status saved as INJECTED/i)).toBeInTheDocument();
        });
    });

    test('Submit không hợp lệ: missing consentFormId shows error and does not call API', async () => {
        const { saveResultOfVaccinationCampaign } = require('../../../../../../hooks/schoolnurse/vaccination/vaccination/useSaveResultOfVaccinationCampaign').useSaveResultOfVaccinationCampaign();
        setup({ injected: [], noShow: [], approved: [{ ...mockShift.students[0], consentFormId: null }] });
        fireEvent.click(screen.getAllByRole('tab')[2]);
        fireEvent.click(screen.getAllByRole('checkbox')[0]);
        fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
        await waitFor(() => {
            expect(require('../../../../../../utils/toast-utils').showErrorToast).toHaveBeenCalledWith('Consent Form ID missing!');
            expect(saveResultOfVaccinationCampaign).not.toHaveBeenCalled();
            expect(screen.getByText(/Consent Form ID missing!/i)).toBeInTheDocument();
        });
    });

    test('Submit lỗi API: shows error when API fails', async () => {
        const { saveResultOfVaccinationCampaign } = require('../../../../../../hooks/schoolnurse/vaccination/vaccination/useSaveResultOfVaccinationCampaign').useSaveResultOfVaccinationCampaign();
        saveResultOfVaccinationCampaign.mockRejectedValueOnce(new Error('API error'));
        setup({ injected: [], noShow: [], approved: [mockShift.students[0]] });
        fireEvent.click(screen.getAllByRole('tab')[2]);
        fireEvent.click(screen.getAllByRole('checkbox')[0]);
        fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
        await waitFor(() => {
            expect(require('../../../../../../utils/toast-utils').showErrorToast).toHaveBeenCalledWith('Error saving status.');
            expect(screen.getByText(/Error saving status/i)).toBeInTheDocument();
        });
    });

    test('Loading state: shows loading spinner and message', () => {
        setup({ injected: [], noShow: [], approved: [], isLoading: true });
        expect(screen.getByText(/Loading Grade 1 students/i)).toBeInTheDocument();
    });
});
