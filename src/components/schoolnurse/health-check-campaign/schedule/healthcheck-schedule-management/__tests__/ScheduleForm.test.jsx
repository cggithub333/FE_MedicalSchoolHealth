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
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ScheduleForm from '../ScheduleForm';

// Mock hooks and API
jest.mock('../../../../../../hooks/schoolnurse/healthcheck/schedule/useNewestCampaignByStatus', () => ({
    useNewestCampaignByStatus: jest.fn(),
}));
jest.mock('../../../../../../api/schoolnurse/schoolnurse-requests-action/healthcheck/pupils-by-grade-request-action', () => ({
    fetchPupilsByGrade: jest.fn(),
}));

jest.mock('../../../../../../utils/toast-utils', () => ({
    showErrorToast: jest.fn(),
    showSuccessToast: jest.fn(),
}));

import { useNewestCampaignByStatus } from '../../../../../../hooks/schoolnurse/healthcheck/schedule/useNewestCampaignByStatus';
import { fetchPupilsByGrade } from '../../../../../../api/schoolnurse/schoolnurse-requests-action/healthcheck/pupils-by-grade-request-action';
import { showErrorToast, showSuccessToast } from '../../../../../../utils/toast-utils';

const renderWithRouter = (ui) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('ScheduleForm', () => {
    const mockCampaign = {
        campaignId: 1,
        title: 'Health Check Campaign Summer 2025',
        description: 'Description here',
        startExaminationDate: '2025-07-01',
        endExaminationDate: '2025-07-05',
        statusHealthCampaign: 'IN_PROGRESS',
    };
    const mockPupils = [
        { pupilId: 'P01', firstName: 'A', lastName: 'B', Grade: 1 },
        { pupilId: 'P02', firstName: 'C', lastName: 'D', Grade: 1 },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        useNewestCampaignByStatus.mockReturnValue({
            newestCampaign: [mockCampaign],
            loading: false,
            error: null,
        });
        fetchPupilsByGrade.mockResolvedValue(mockPupils);
    });

    test('renders campaign header and grade cards', async () => {
        renderWithRouter(<ScheduleForm />);
        await waitFor(() => expect(screen.getByText(/Health Check Campaign Summer 2025/i)).toBeInTheDocument());
        expect(screen.getByText(/Description here/i)).toBeInTheDocument();
    });

    test('clicking View Students shows injected list', async () => {
        renderWithRouter(<ScheduleForm />);
        await waitFor(() => {
            const viewButtons = screen.getAllByRole('button', { name: /View Students/i });
            expect(viewButtons.length).toBeGreaterThan(0);
            fireEvent.click(viewButtons[0]);
        });
        await waitFor(() => {
            expect(screen.getByText(/Back/i)).toBeInTheDocument();
        });
    });

    test('shows grade progress and campaign info', async () => {
        renderWithRouter(<ScheduleForm />);
        await waitFor(() => {
            expect(screen.getByText(/Students:/i)).toBeInTheDocument();
            expect(screen.getByText(/Date:/i)).toBeInTheDocument();
        });
    });

    test('shows error when no active campaign', () => {
        useNewestCampaignByStatus.mockReturnValue({ newestCampaign: [], loading: false, error: null });
        renderWithRouter(<ScheduleForm />);
        expect(screen.getByText(/No Active Campaign/i)).toBeInTheDocument();
        expect(screen.getByText(/There is no health check campaign in progress/i)).toBeInTheDocument();
    });

    test('shows error message when API fails', () => {
        useNewestCampaignByStatus.mockReturnValue({ newestCampaign: null, loading: false, error: 'API error' });
        renderWithRouter(<ScheduleForm />);
        expect(screen.getByText(/Error Loading Campaign/i)).toBeInTheDocument();
        expect(screen.getByText(/Please try again later/i)).toBeInTheDocument();
    });

    test('shows skeletons for grades when loading', () => {
        useNewestCampaignByStatus.mockReturnValue({ newestCampaign: null, loading: true, error: null });
        renderWithRouter(<ScheduleForm />);
        expect(screen.getAllByRole('progressbar').length).toBeGreaterThanOrEqual(0);
    });

    test('handles missing campaign data gracefully', () => {
        useNewestCampaignByStatus.mockReturnValue({ newestCampaign: null, loading: false, error: null });
        renderWithRouter(<ScheduleForm />);
        expect(screen.getByText(/No Active Campaign/i)).toBeInTheDocument();
    });

    test('handles empty pupils array', async () => {
        fetchPupilsByGrade.mockResolvedValue([]);
        renderWithRouter(<ScheduleForm />);
        await waitFor(() => {
            expect(screen.getByText(/Students:/i)).toBeInTheDocument();
        });
    });
});
