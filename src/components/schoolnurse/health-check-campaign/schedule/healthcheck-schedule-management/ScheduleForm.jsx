import React, { useState } from "react";
import "./StyleScheduleForm.scss";
import ScheduleInjectedList from "../healthcheck-schedule-management-details/ScheduleInjectedList";
import useNewestCampaignByStatus from '../../../../../hooks/schoolnurse/healthcheck/useNewestCampaignByStatus';
import usePupilsByGrade from "../../../../../hooks/schoolnurse/healthcheck/usePupilsByGrade";

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

const GRADES = [1, 2, 3, 4, 5];

const HealthCheckScheduleForm = () => {
    const { newestCampaign, isLoading } = useNewestCampaignByStatus();
    const [showInjectionList, setShowInjectionList] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null);
    // Get pupils by grade for all grades
    const pupilsByGrade = GRADES.map((grade) => {
        const { pupils } = usePupilsByGrade(grade);
        return { grade, pupils };
    });

    // Filter campaigns by status
    const filteredNewestCampaigns = Array.isArray(newestCampaign)
        ? newestCampaign.filter(c => c.status === 'In Progress' || c.status === 'Published')
        : [];

    // Helper to get and set saved shift data for both morning and afternoon
    function getShiftSavedData(grade, pupils) {
        const sharedKey = `healthcheck_students_grade_${grade}`;
        let students = null;
        try {
            students = JSON.parse(localStorage.getItem(sharedKey) || 'null');
        } catch { }
        // Always use pupils.length for capacity
        // Calculate filled from saved students (completed only)
        const filled = students ? students.filter(s => s.completed).length : 0;
        return {
            morning: students || [],
            afternoon: students || [],
            capacity: pupils.length,
            filled
        };
    }

    if (isLoading) return <div className="vaccine-schedule-root">Loading...</div>;
    if (filteredNewestCampaigns.length === 0) {
        return <div className="vaccine-schedule-root">Don't have any campaign now</div>;
    }
    if (showInjectionList && selectedShift) {
        return (
            <div>

                <ScheduleInjectedList shift={selectedShift} onBack={() => {
                    setShowInjectionList(false);
                    setSelectedShift(null);
                }} />
            </div>
        );
    }

    return (
        <div className="vaccine-schedule-root">
            {filteredNewestCampaigns.length > 0 && (() => {
                const campaignStatus = filteredNewestCampaigns[0]?.status || "";
                return GRADES.map((grade) => {
                    const pupils = pupilsByGrade.find(p => p.grade === grade)?.pupils || [];
                    const capacity = pupils.length;
                    // For demo, let's create two shifts per grade
                    const saved = getShiftSavedData(grade, pupils);
                    const shifts = [
                        {
                            id: `${grade}-morning`,
                            name: `Grade ${grade} - Morning`,
                            time: "08:00 - 11:00",
                            grade,
                            students: saved.morning,
                            capacity: saved.capacity,
                            filled: saved.filled
                        }
                    ];
                    // Calculate total/filled for both shifts
                    const total = saved.capacity;
                    // Use filled from saved (completed pupils)
                    const filled = saved.filled;

                    // Update capacity and filled for each shift
                    shifts.forEach(shift => {
                        shift.capacity = total;
                        shift.filled = filled;
                        shift.status = shift.capacity === 0 ? "Full" : (shift.capacity - shift.filled <= 2 ? "Almost Full" : "Available");
                    });

                    return (
                        <div className="vaccine-schedule-card" key={grade}>
                            <div className="vaccine-schedule-header">
                                <div className="vaccine-schedule-header-icon">
                                    <span className="vaccine-icon">+</span>
                                </div>
                                <div className="vaccine-schedule-header-info">
                                    <h2 className="vaccine-campaign-title">
                                        Health Check - Grade {grade}
                                    </h2>
                                    <div className="vaccine-schedule-desc">
                                        Health check schedule for Grade {grade}
                                    </div>
                                </div>
                            </div>
                            <div className="vaccine-schedule-shifts influenza-rows">
                                <div className="shift-row">
                                    <div className="shift-row-date">Grade {grade} (Day 1)</div>
                                    <div className="shift-row-cards">
                                        {shifts.map((shift) => (
                                            <div
                                                className={`shift-card ${statusColors[shift.status]}`}
                                                key={shift.id}
                                            >
                                                <div className="shift-title">{shift.name}</div>
                                                <div className="shift-time">
                                                    <span role="img" aria-label="clock">🕒</span> {shift.time}
                                                </div>
                                                <div className="shift-status">
                                                    {shift.status === "Almost Full" ? (
                                                        <span className="almost-full">Almost Full</span>
                                                    ) : (
                                                        shift.status
                                                    )}
                                                </div>
                                                <div className="shift-capacity">
                                                    <span>Capacity:</span>
                                                    <span className="shift-capacity-bar">
                                                        <span
                                                            className="shift-capacity-fill"
                                                            style={{
                                                                width: `${(shift.filled / shift.capacity) * 100}%`,
                                                                background: statusBarColors[shift.status],
                                                            }}
                                                        />
                                                    </span>
                                                    <span className="shift-capacity-count">
                                                        {shift.filled}/{shift.capacity}
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
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button
                                className="confirm-campaign-btn"
                                onMouseOver={e => e.currentTarget.classList.add('hovered')}
                                onMouseOut={e => e.currentTarget.classList.remove('hovered')}
                                onClick={() => alert("Campaign marked as finished!")}
                            >
                                Confirm
                            </button>
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

export default HealthCheckScheduleForm;
