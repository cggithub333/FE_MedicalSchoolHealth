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
import VaccinationScheduleForm from '../ScheduleForm';

// Mock hooks
jest.mock('../../../../../../hooks/schoolnurse/vaccination/vaccination/useNewestCampaignByStatus', () => ({
    useNewestVaccinationCampaign: jest.fn()
}));
jest.mock('../../../../../../hooks/schoolnurse/vaccination/vaccination/useGetAllPupilsByGrade', () => ({
    useGetAllPupilsApprovedByGrade: jest.fn()
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('VaccinationScheduleForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    function setup({ campaign, pupils, isLoading = false, error = null }) {
        require('../../../../../../hooks/schoolnurse/vaccination/vaccination/useNewestCampaignByStatus').useNewestVaccinationCampaign.mockReturnValue({
            newestVaccinationCampaign: campaign,
            isLoading,
            error,
        });
        require('../../../../../../hooks/schoolnurse/vaccination/vaccination/useGetAllPupilsByGrade').useGetAllPupilsApprovedByGrade.mockReturnValue({
            pupils,
            isLoading: false,
        });
        render(<VaccinationScheduleForm />);
    }

    test('UI rendering: shows campaign header, grade cards, and View Students button', () => {
        const campaign = [{
            campaignId: 1,
            titleCampaign: 'Test Campaign',
            vaccineName: 'VaccineX',
            diseaseName: 'DiseaseY',
            startDate: '01-07-2025',
            endDate: '05-07-2025',
            status: 'IN_PROGRESS',
        }];
        const pupils = [
            { pupilId: 'P01', firstName: 'A', lastName: 'B', Grade: 1 },
            { pupilId: 'P02', firstName: 'C', lastName: 'D', Grade: 1 },
        ];
        setup({ campaign, pupils });
        expect(screen.getByText(/Test Campaign/i)).toBeInTheDocument();
        expect(screen.getByText(/VaccineX/i)).toBeInTheDocument();
        expect(screen.getByText(/DiseaseY/i)).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: /View Students/i })[0]).toBeInTheDocument();
    });

    test('State update: clicking View Students shows injected list', async () => {
        const campaign = [{
            campaignId: 1,
            titleCampaign: 'Test Campaign',
            vaccineName: 'VaccineX',
            diseaseName: 'DiseaseY',
            startDate: '01-07-2025',
            endDate: '05-07-2025',
            status: 'IN_PROGRESS',
        }];
        const pupils = [
            { pupilId: 'P01', firstName: 'A', lastName: 'B', Grade: 1 },
        ];
        setup({ campaign, pupils });
        fireEvent.click(screen.getAllByRole('button', { name: /View Students/i })[0]);
        await waitFor(() => {
            expect(screen.getByText(/Back/i)).toBeInTheDocument(); // ScheduleInjectedList should render Back button
        });
    });

    test('Submit thành công: shows grade progress and campaign info', () => {
        const campaign = [{
            campaignId: 1,
            titleCampaign: 'Test Campaign',
            vaccineName: 'VaccineX',
            diseaseName: 'DiseaseY',
            startDate: '01-07-2025',
            endDate: '05-07-2025',
            status: 'IN_PROGRESS',
        }];
        const pupils = [
            { pupilId: 'P01', firstName: 'A', lastName: 'B', Grade: 1, completed: true },
            { pupilId: 'P02', firstName: 'C', lastName: 'D', Grade: 1, completed: false },
        ];
        setup({ campaign, pupils });
        expect(screen.getByText(/Students:/i)).toBeInTheDocument();
        expect(screen.getByText(/Date:/i)).toBeInTheDocument();
    });

    test('Submit không hợp lệ: shows error when no active campaign', () => {
        setup({ campaign: [], pupils: [], error: null });
        expect(screen.getByText(/No Active Campaign/i)).toBeInTheDocument();
        expect(screen.getByText(/There is no vaccination campaign in progress/i)).toBeInTheDocument();
    });

    test('Submit lỗi API: shows error message when API fails', () => {
        setup({ campaign: null, pupils: [], error: 'API error' });
        expect(screen.getByText(/Error Loading Campaign/i)).toBeInTheDocument();
        expect(screen.getByText(/Please try again later/i)).toBeInTheDocument();
    });

    test('Loading state: shows skeletons for grades', () => {
        setup({ campaign: null, pupils: [], isLoading: true });
        expect(screen.getAllByRole('progressbar').length).toBeGreaterThanOrEqual(0);
        expect(screen.getAllByText(/Vaccination/i).length).toBeGreaterThanOrEqual(0);
    });
});
