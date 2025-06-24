import React, { useState } from "react";
import "./StyleScheduleForm.scss";
import ScheduleInjectedList from "../vaccination-schedule-management-details/ScheduleInjectedList";
import useGetNewestVaccinationCampaign from '../../../../../hooks/schoolnurse/vaccination/useNewestCampaignByStatus';
import useGetAllPupilsByGrade from '../../../../../hooks/schoolnurse/vaccination/useGetAllPupilsByGrade';

// Define colors for status
// Available, Full, Almost Full
const statusColors = {
    Available: "available",
    Full: "full",
    "Almost Full": "almostfull",
};

const statusBarColors = {
    Available: "#43a047",
    Full: "#e53935",
    "Almost Full": "#fbc02d",
};

// Define the grades for the vaccination schedule
const GRADES = [1, 2, 3, 4, 5];

// Helper to get and set saved shift data for both morning and afternoon
function getShiftSavedData(grade) {
    const morningKey = `vaccination_students_shift_${grade}-morning`;
    const afternoonKey = `vaccination_students_shift_${grade}-afternoon`;
    let morning = null, afternoon = null;
    try {
        morning = JSON.parse(localStorage.getItem(morningKey) || 'null');
    } catch { }
    try {
        afternoon = JSON.parse(localStorage.getItem(afternoonKey) || 'null');
    } catch { }
    return {
        morning: morning || [],
        afternoon: afternoon || []
    };
}

// VaccinationScheduleForm component
const VaccinationScheduleForm = () => {
    const { newestVaccinationCampaign, isLoading } = useGetNewestVaccinationCampaign();
    const [showInjectionList, setShowInjectionList] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null);
    const [refresh, setRefresh] = useState(0); // force rerender when save
    // Get pupils by grade for all grades
    const pupilsByGrade = GRADES.map((grade) => {
        const { pupils } = useGetAllPupilsByGrade(grade);
        return { grade, pupils };
    });
    if (isLoading) return <div className="vaccine-schedule-root">Loading...</div>;
    if (showInjectionList && selectedShift) {
        return (
            <div>
                <ScheduleInjectedList shift={selectedShift} onBack={() => {
                    setShowInjectionList(false);
                    setSelectedShift(null);
                    setRefresh(r => r + 1); // force rerender to reload saved data
                }} />
            </div>
        );
    }
    return (
        <div className="vaccine-schedule-root">
            {newestVaccinationCampaign && newestVaccinationCampaign.length > 0 && (() => {
                const campaign = newestVaccinationCampaign[0]?.campaign || {};
                const campaignStatus = campaign.status || "";
                return GRADES.map((grade) => {
                    // Filter pupils by grade from the approved pupils data
                    const pupils = pupilsByGrade.find(p => p.grade === grade)?.pupils.filter(pupil => pupil.status === 'Approved') || [];
                    // Get saved data for both shifts
                    const saved = getShiftSavedData(grade);
                    const shifts = [
                        {
                            id: `${grade}-morning`,
                            name: `Grade ${grade} - Morning`,
                            time: "08:00 - 11:00",
                            grade,
                            students: saved.morning
                        }
                    ];
                    // Calculate total/filled for both shifts
                    const total = (saved.morning.length || 0) + (saved.afternoon.length || 0) || pupils.length;
                    const filled = (saved.morning.filter(s => s.completed).length || 0) + (saved.afternoon.filter(s => s.completed).length || 0);
                    return (
                        <div className="vaccine-schedule-card" key={grade}>
                            <div className="vaccine-schedule-header">
                                <div className="vaccine-schedule-header-icon">
                                    <span className="vaccine-icon">+</span>
                                </div>
                                <div className="vaccine-schedule-header-info">
                                    <h2 className="vaccine-campaign-title">
                                        Vaccination - Grade {grade}
                                    </h2>
                                    <div className="vaccine-schedule-desc">
                                        Vaccination schedule for Grade {grade}
                                    </div>
                                </div>
                            </div>
                            <div className="vaccine-schedule-shifts influenza-rows">
                                <div className="shift-row">
                                    <div className="shift-row-date">Day {grade}</div>
                                    <div className="shift-row-cards">
                                        {shifts.map((shift) => {
                                            const shiftFilled = shift.students.filter(s => s.completed).length;
                                            const shiftTotal = shift.students.length || pupils.length;
                                            const status = shiftTotal === 0 ? "Full" : (shiftTotal - shiftFilled <= 2 ? "Almost Full" : "Available");
                                            return (
                                                <div
                                                    className={`shift-card ${statusColors[status]}`}
                                                    key={shift.id}
                                                >
                                                    <div className="shift-title">{shift.name}</div>
                                                    <div className="shift-time">
                                                        <span role="img" aria-label="clock">🕒</span> {shift.time}
                                                    </div>
                                                    <div className="shift-status">
                                                        {status === "Almost Full" ? (
                                                            <span className="almost-full">Almost Full</span>
                                                        ) : (
                                                            status
                                                        )}
                                                    </div>
                                                    <div className="shift-capacity">
                                                        <span>Capacity:</span>
                                                        <span className="shift-capacity-bar">
                                                            <span
                                                                className="shift-capacity-fill"
                                                                style={{
                                                                    width: `${shiftTotal === 0 ? 0 : (shiftFilled / shiftTotal) * 100}%`,
                                                                    background: statusBarColors[status],
                                                                }}
                                                            />
                                                        </span>
                                                        <span className="shift-capacity-count">
                                                            {shiftFilled}/{shiftTotal}
                                                        </span>
                                                    </div>
                                                    <div className="shift-actions">
                                                        <button
                                                            className="view-btn"
                                                            onMouseOver={e => e.currentTarget.classList.add('hovered')}
                                                            onMouseOut={e => e.currentTarget.classList.remove('hovered')}
                                                            onClick={() => {
                                                                setShowInjectionList(true);
                                                                setSelectedShift(shift);
                                                            }}
                                                        >
                                                            View Students
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            {/* Confirm button with state */}
                            <ConfirmButton />
                        </div>
                    );
                });
            })()}
            <button
                className="confirm-campaign-btn"
                onMouseOver={e => e.currentTarget.classList.add('hovered')}
                onMouseOut={e => e.currentTarget.classList.remove('hovered')}
                onClick={() => alert("Campaign marked as finished!")}
            >
                Completed
            </button>
        </div>
    );
};

// ConfirmButton component for per-card confirm/confirmed state
const ConfirmButton = () => {
    const [confirmed, setConfirmed] = useState(false);
    if (confirmed) {
        return (
            <button className="confirm-campaign-btn confirmed" disabled>
                Confirmed
            </button>
        );
    }
    return (
        <button
            className="confirm-campaign-btn"
            onMouseOver={e => e.currentTarget.classList.add('hovered')}
            onMouseOut={e => e.currentTarget.classList.remove('hovered')}
            onClick={() => setConfirmed(true)}
        >
            Confirm
        </button>
    );
};

export default VaccinationScheduleForm;
