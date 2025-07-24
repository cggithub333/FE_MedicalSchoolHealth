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
import EventFormResult from '../EventFormResult';
// Mock hooks and API calls used in EventFormResult
jest.mock('../../../../../hooks/schoolnurse/new-event/useGetMedicalEventByMedicalEventId');

// Mock toast utilities
jest.mock('../../../../../utils/toast-utils', () => ({
    showErrorToast: jest.fn(),
    showSuccessToast: jest.fn(),
}));

import { showErrorToast, showSuccessToast } from '../../../../../utils/toast-utils';
import { useGetMedicalEventByMedicalEventId } from '../../../../../hooks/schoolnurse/new-event/useGetMedicalEventByMedicalEventId';

const mockEvent = {
    injuryDescription: 'Sprain',
    treatmentDescription: 'Rest and ice',
    detailedInformation: 'Student fell during PE class',
    status: 'low',
    dateTime: '2025-07-01',
    pupil: {
        firstName: 'A',
        lastName: 'Student',
        pupilId: 'PP001',
        gradeName: 'Grade 1',
        parents: [{ firstName: 'Parent', lastName: 'One', phoneNumber: '0123456789' }],
    },
    schoolNurse: { firstName: 'Nurse', lastName: 'One', phoneNumber: '0987654321' },
    equipmentUsed: [{ name: 'Bandage', description: 'Elastic bandage', unit: 'piece' }],
    medicationUsed: [{ name: 'Paracetamol', description: 'Pain relief', dosage: '500mg', unit: 'tablet' }],
};

describe('EventFormResult', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useGetMedicalEventByMedicalEventId.mockReturnValue({
            medicalEventDetail: mockEvent,
            loading: false,
            error: null,
        });
    });

    // UI rendering
    test('renders medical event details and back button', () => {
        render(<EventFormResult eventId={1} onCancel={jest.fn()} />);
        expect(screen.getByText(/Medical Event Report/i)).toBeInTheDocument();
        expect(screen.getByText(/Student Information/i)).toBeInTheDocument();
        expect(screen.getByText(/Incident Details/i)).toBeInTheDocument();
        expect(screen.getByText(/Medication & Equipment Used/i)).toBeInTheDocument();
        expect(screen.getByText(/Responsible Nurse/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /BACK/i })).toBeInTheDocument();
    });

    // State update
    test('calls onCancel when back button is clicked', () => {
        const onCancel = jest.fn();
        render(<EventFormResult eventId={1} onCancel={onCancel} />);
        const backBtn = screen.getByRole('button', { name: /BACK/i });
        fireEvent.click(backBtn);
        expect(onCancel).toHaveBeenCalled();
    });

    // Submit thành công (just check correct data shown)
    test('shows correct event data', () => {
        render(<EventFormResult eventId={1} onCancel={jest.fn()} />);
        expect(screen.getByDisplayValue('Sprain')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Rest and ice')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Student fell during PE class')).toBeInTheDocument();
        expect(screen.getByText('Bandage')).toBeInTheDocument();
        expect(screen.getByText('Paracetamol')).toBeInTheDocument();
        expect(screen.getByText('Nurse One')).toBeInTheDocument();
        // Use a flexible matcher to find the parent's name even if split by elements
        expect(screen.getByText((content, node) => {
            const hasText = (node) => node.textContent && node.textContent.includes('Parent') && node.textContent.includes('One');
            const nodeHasText = hasText(node);
            const childrenDontHaveText = Array.from(node?.children || []).every(
                (child) => !hasText(child)
            );
            return nodeHasText && childrenDontHaveText;
        })).toBeInTheDocument();
    });

    // Submit không hợp lệ (error state)
    test('shows error message when event data is missing', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: null,
            loading: false,
            error: 'Not found',
        });
        render(<EventFormResult eventId={1} onCancel={jest.fn()} />);
        expect(screen.getByText(/Error loading event details/i)).toBeInTheDocument();
    });

    // Submit lỗi API (loading state)
    test('shows loading state when loading is true', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: null,
            loading: true,
            error: null,
        });
        render(<EventFormResult eventId={1} onCancel={jest.fn()} />);
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    // Edge case: missing equipmentUsed
    test('renders gracefully when equipmentUsed is missing', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: { ...mockEvent, equipmentUsed: undefined },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={2} onCancel={jest.fn()} />);
        expect(screen.getByText(/Medication & Equipment Used/i)).toBeInTheDocument();
        // Should not throw or crash
    });

    // Edge case: equipmentUsed is empty array
    test('renders gracefully when equipmentUsed is empty', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: { ...mockEvent, equipmentUsed: [] },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={3} onCancel={jest.fn()} />);
        expect(screen.getByText(/Medication & Equipment Used/i)).toBeInTheDocument();
    });

    // Edge case: medicationUsed is missing
    test('renders gracefully when medicationUsed is missing', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: { ...mockEvent, medicationUsed: undefined },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={4} onCancel={jest.fn()} />);
        expect(screen.getByText(/Medication & Equipment Used/i)).toBeInTheDocument();
    });

    // Edge case: medicationUsed is empty array
    test('renders gracefully when medicationUsed is empty', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: { ...mockEvent, medicationUsed: [] },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={5} onCancel={jest.fn()} />);
        expect(screen.getByText(/Medication & Equipment Used/i)).toBeInTheDocument();
    });

    // Edge case: schoolNurse is missing
    test('renders gracefully when schoolNurse is missing', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: { ...mockEvent, schoolNurse: undefined },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={6} onCancel={jest.fn()} />);
        expect(screen.getByText(/Responsible Nurse/i)).toBeInTheDocument();
    });

    // Edge case: pupil is missing
    test('renders gracefully when pupil is missing', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: { ...mockEvent, pupil: undefined },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={7} onCancel={jest.fn()} />);
        expect(screen.getByText(/Student Information/i)).toBeInTheDocument();
    });

    // Edge case: pupil.parents is missing
    test('renders gracefully when pupil.parents is missing', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: { ...mockEvent, pupil: { ...mockEvent.pupil, parents: undefined } },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={8} onCancel={jest.fn()} />);
        expect(screen.getByText(/Student Information/i)).toBeInTheDocument();
    });

    // Edge case: pupil.parents is empty array
    test('renders gracefully when pupil.parents is empty', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: { ...mockEvent, pupil: { ...mockEvent.pupil, parents: [] } },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={9} onCancel={jest.fn()} />);
        expect(screen.getByText(/Student Information/i)).toBeInTheDocument();
    });

    // Edge case: minimal event data (all optional fields missing)
    test('renders gracefully with minimal event data', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: {},
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={10} onCancel={jest.fn()} />);
        // Should render the main sections without crashing
        expect(screen.getByText(/Medical Event Report/i)).toBeInTheDocument();
    });

    // Edge case: status is undefined
    test('renders gracefully when status is undefined', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: { ...mockEvent, status: undefined },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={11} onCancel={jest.fn()} />);
        // Should render the health status chip with default color
        expect(screen.getByText(/Health status/i)).toBeInTheDocument();
    });

    // Edge case: parent is missing
    test('renders gracefully when parents array is empty (no parent)', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: { ...mockEvent, pupil: { ...mockEvent.pupil, parents: [] } },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={12} onCancel={jest.fn()} />);
        // Should render parent section without crashing
        expect(screen.getByText(/Parent|Guardian Contact/i)).toBeInTheDocument();
    });

    // Edge case: all string fields are empty
    test('renders gracefully when all string fields are empty', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: {
                injuryDescription: '',
                treatmentDescription: '',
                detailedInformation: '',
                status: '',
                dateTime: '',
                pupil: { firstName: '', lastName: '', pupilId: '', gradeName: '', parents: [{ firstName: '', lastName: '', phoneNumber: '' }] },
                schoolNurse: { firstName: '', lastName: '', phoneNumber: '' },
                equipmentUsed: [],
                medicationUsed: [],
            },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={13} onCancel={jest.fn()} />);
        expect(screen.getByText(/Medical Event Report/i)).toBeInTheDocument();
    });

    // Edge case: status is 'medium' and 'high' (for getStatusColor and getSeverityIcon)
    test('renders with status medium', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: { ...mockEvent, status: 'medium' },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={14} onCancel={jest.fn()} />);
        expect(screen.getByText(/Health status/i)).toBeInTheDocument();
    });
    test('renders with status high', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: { ...mockEvent, status: 'high' },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={15} onCancel={jest.fn()} />);
        expect(screen.getByText(/Health status/i)).toBeInTheDocument();
    });

    // Edge case: error is present but medicalEventDetail is not null
    test('shows error message when error is present but medicalEventDetail is not null', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: mockEvent,
            loading: false,
            error: 'Some error',
        });
        render(<EventFormResult eventId={16} onCancel={jest.fn()} />);
        expect(screen.getByText(/Error loading event details/i)).toBeInTheDocument();
    });

    // Edge case: both loading and error are true
    test('shows loading state when both loading and error are true', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: null,
            loading: true,
            error: 'Some error',
        });
        render(<EventFormResult eventId={17} onCancel={jest.fn()} />);
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    // Edge case: all fields undefined
    test('renders gracefully when all fields are undefined', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: undefined,
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={18} onCancel={jest.fn()} />);
        expect(screen.getByText(/Error loading event details/i)).toBeInTheDocument();
    });

    // Edge case: dateTime is missing
    test('renders gracefully when dateTime is missing', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: { ...mockEvent, dateTime: undefined },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={19} onCancel={jest.fn()} />);
        expect(screen.getByText(/Medical Event Report/i)).toBeInTheDocument();
    });

    // Edge case: injuryDescription and treatmentDescription missing
    test('renders gracefully when injuryDescription and treatmentDescription are missing', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: { ...mockEvent, injuryDescription: undefined, treatmentDescription: undefined },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={20} onCancel={jest.fn()} />);
        expect(screen.getByText(/Incident Details/i)).toBeInTheDocument();
    });

    // Edge case: detailedInformation missing
    test('renders gracefully when detailedInformation is missing', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: { ...mockEvent, detailedInformation: undefined },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={21} onCancel={jest.fn()} />);
        expect(screen.getByText(/Incident Details/i)).toBeInTheDocument();
    });

    // Edge case: pupil exists but missing firstName, lastName, gradeName
    test('renders gracefully when pupil fields are missing', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: {
                ...mockEvent,
                pupil: { pupilId: 'PP001', parents: [{ phoneNumber: '0123456789' }] },
            },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={22} onCancel={jest.fn()} />);
        expect(screen.getByText(/Student Information/i)).toBeInTheDocument();
    });

    // Edge case: schoolNurse exists but missing firstName, lastName
    test('renders gracefully when schoolNurse fields are missing', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: {
                ...mockEvent,
                schoolNurse: { phoneNumber: '0987654321' },
            },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={23} onCancel={jest.fn()} />);
        expect(screen.getByText(/Responsible Nurse/i)).toBeInTheDocument();
    });

    // Edge case: status is unknown value
    test('renders gracefully with unknown status value', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: { ...mockEvent, status: 'unknown' },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={24} onCancel={jest.fn()} />);
        expect(screen.getByText(/Health status/i)).toBeInTheDocument();
    });

    // Edge case: medicationUsed item missing fields
    test('renders gracefully when medicationUsed item is missing fields', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: {
                ...mockEvent,
                medicationUsed: [{ dosage: '500mg' }],
            },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={25} onCancel={jest.fn()} />);
        expect(screen.getByText(/Medication & Equipment Used/i)).toBeInTheDocument();
    });

    // Edge case: equipmentUsed item missing fields
    test('renders gracefully when equipmentUsed item is missing fields', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: {
                ...mockEvent,
                equipmentUsed: [{ description: 'Elastic bandage' }],
            },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={26} onCancel={jest.fn()} />);
        expect(screen.getByText(/Medication & Equipment Used/i)).toBeInTheDocument();
    });

    // Edge case: parent missing fields
    test('renders gracefully when parent is missing fields', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: {
                ...mockEvent,
                pupil: { ...mockEvent.pupil, parents: [{}] },
            },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={27} onCancel={jest.fn()} />);
        expect(screen.getByText(/Parent|Guardian Contact/i)).toBeInTheDocument();
    });

    // Ultra-defensive: parent with all fields undefined
    test('renders gracefully when parent is all undefined', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: {
                ...mockEvent,
                pupil: { ...mockEvent.pupil, parents: [{ firstName: undefined, lastName: undefined, phoneNumber: undefined }] },
            },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={28} onCancel={jest.fn()} />);
        expect(screen.getByText(/Parent|Guardian Contact/i)).toBeInTheDocument();
    });

    // Ultra-defensive: medicationUsed item all fields undefined
    test('renders gracefully when medicationUsed item is all undefined', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: {
                ...mockEvent,
                medicationUsed: [{ name: undefined, description: undefined, dosage: undefined, unit: undefined }],
            },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={29} onCancel={jest.fn()} />);
        expect(screen.getByText(/Medication & Equipment Used/i)).toBeInTheDocument();
    });

    // Ultra-defensive: equipmentUsed item all fields undefined
    test('renders gracefully when equipmentUsed item is all undefined', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: {
                ...mockEvent,
                equipmentUsed: [{ name: undefined, description: undefined, unit: undefined }],
            },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={30} onCancel={jest.fn()} />);
        expect(screen.getByText(/Medication & Equipment Used/i)).toBeInTheDocument();
    });

    // Ultra-defensive: status is null
    test('renders gracefully when status is null', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: { ...mockEvent, status: null },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={31} onCancel={jest.fn()} />);
        expect(screen.getByText(/Health status/i)).toBeInTheDocument();
    });

    // Ultra-defensive: both pupil and schoolNurse missing
    test('renders gracefully when both pupil and schoolNurse are missing', () => {
        useGetMedicalEventByMedicalEventId.mockReturnValueOnce({
            medicalEventDetail: { ...mockEvent, pupil: undefined, schoolNurse: undefined },
            loading: false,
            error: null,
        });
        render(<EventFormResult eventId={32} onCancel={jest.fn()} />);
        expect(screen.getByText(/Student Information/i)).toBeInTheDocument();
        expect(screen.getByText(/Responsible Nurse/i)).toBeInTheDocument();
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
