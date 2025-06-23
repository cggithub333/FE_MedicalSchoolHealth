import React, { useState } from "react";
import "./StyleScheduleForm.scss";
import ScheduleInjectedList from "../healthcheck-schedule-management-details/ScheduleInjectedList";
import usePendingCampaign from "../../../../../hooks/manager/usePendingCampaignByStatus";
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
    const { pendingCampaign, isLoading } = usePendingCampaign();
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
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        padding: "18px 18px 0 18px",
                    }}
                >
                    <button
                        style={{
                            background: "#fff",
                            color: "#e53935",
                            border: "2px solid #e53935",
                            borderRadius: "50%",
                            width: 40,
                            height: 40,
                            fontSize: 22,
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 8px rgba(229,57,53,0.10)",
                            transition:
                                "background 0.2s, color 0.2s, border 0.2s",
                            position: "absolute",
                            right: "-5px",
                            top: "5px",
                        }}
                        title="Close"
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = "#e53935";
                            e.currentTarget.style.color = "#fff";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = "#fff";
                            e.currentTarget.style.color = "#e53935";
                        }}
                        onClick={() => {
                            setShowInjectionList(false);
                            setSelectedShift(null);
                        }}
                    >
                        ×
                    </button>
                </div>
                <ScheduleInjectedList shift={selectedShift} />
            </div>
        );
    }

    return (
        <div className="vaccine-schedule-root">
            {pendingCampaign && pendingCampaign.length > 0 && GRADES.map((grade) => {
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
                        status: capacity === 0 ? "Full" : (capacity - Math.floor(capacity * 0.7) <= 2 ? "Almost Full" : "Available")
                    },
                    {
                        id: `${grade}-afternoon`,
                        name: `Grade ${grade} - Afternoon`,
                        time: "13:00 - 16:00",
                        filled: Math.floor(capacity * 0.5),
                        capacity,
                        status: capacity === 0 ? "Full" : (capacity - Math.floor(capacity * 0.5) <= 2 ? "Almost Full" : "Available")
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
                                                    style={{
                                                        background: "#388e3c",
                                                        color: "#fff",
                                                        border: "none",
                                                        borderRadius: 6,
                                                        padding: "7px 16px",
                                                        fontWeight: 600,
                                                        fontSize: 15,
                                                        cursor: "pointer",
                                                        width: "100%",
                                                        boxShadow: "0 1px 4px rgba(56,142,60,0.08)",
                                                        transition: "background 0.2s",
                                                    }}
                                                    onMouseOver={(e) => (e.currentTarget.style.background = "#2e7031")}
                                                    onMouseOut={(e) => (e.currentTarget.style.background = "#388e3c")}
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
                            style={{
                                padding: "10px 28px",
                                background: "linear-gradient(90deg, #43a047 60%, #388e3c 100%)",
                                color: "#fff",
                                border: "none",
                                borderRadius: 8,
                                fontWeight: 700,
                                cursor: "pointer",
                                fontSize: 17,
                                boxShadow: "0 2px 8px rgba(67,160,71,0.08)",
                                transition: "background 1s, box-shadow 0.4s",
                                width: "fit-content",
                                marginLeft: "auto",
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.background = "#388e3c")}
                            onMouseOut={(e) => (e.currentTarget.style.background = "linear-gradient(90deg, #43a047 60%, #388e3c 100%)")}
                            onClick={() => alert("Campaign marked as finished!")}
                        >
                            In Progress
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default HealthCheckScheduleForm;
