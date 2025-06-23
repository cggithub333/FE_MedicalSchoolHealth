import React, { useState } from "react";
import "./StyleScheduleForm.scss";
import ScheduleInjectedList from "../healthcheck-schedule-management-details/ScheduleInjectedList";
import useNewestCampaignByStatus from "../../../../../hooks/manager/useNewestCampaignByStatus";
import usePupilsByGrade from "../../../../../hooks/schoolnurse/usePupilsByGrade";

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

    if (isLoading) return <div className="vaccine-schedule-root">Loading...</div>;
    if (showInjectionList && selectedShift) {
        return (
            <div>
                <div className="close-btn-container">
                    <button
                        className="close-btn"
                        title="Close"
                        onMouseOver={e => {
                            e.currentTarget.classList.add('hovered');
                        }}
                        onMouseOut={e => {
                            e.currentTarget.classList.remove('hovered');
                        }}
                        onClick={() => {
                            setShowInjectionList(false);
                            setSelectedShift(null);
                        }}
                    >
                        ×
                    </button>
                </div>
                <ScheduleInjectedList shift={selectedShift} onBack={() => {
                    setShowInjectionList(false);
                    setSelectedShift(null);
                }} />
            </div>
        );
    }

    return (
        <div className="vaccine-schedule-root">
            {newestCampaign && newestCampaign.length > 0 && (() => {
                const campaignStatus = newestCampaign[0]?.status || "";
                return GRADES.map((grade) => {
                    const pupils = pupilsByGrade.find(p => p.grade === grade)?.pupils || [];
                    const capacity = pupils.length;
                    // For demo, let's create two shifts per grade
                    const shifts = [
                        {
                            id: `${grade}-morning`,
                            name: `Grade ${grade} - Morning`,
                            time: "08:00 - 11:00",
                            filled: Math.floor(capacity * 0.7),
                            capacity,
                            status: capacity === 0 ? "Full" : (capacity - Math.floor(capacity * 0.7) <= 2 ? "Almost Full" : "Available"),
                            grade
                        },
                        {
                            id: `${grade}-afternoon`,
                            name: `Grade ${grade} - Afternoon`,
                            time: "13:00 - 16:00",
                            filled: Math.floor(capacity * 0.5),
                            capacity,
                            status: capacity === 0 ? "Full" : (capacity - Math.floor(capacity * 0.5) <= 2 ? "Almost Full" : "Available"),
                            grade
                        }
                    ];
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
                                {campaignStatus}
                            </button>
                        </div>
                    );
                });
            })()}
        </div>
    );
};

export default HealthCheckScheduleForm;
