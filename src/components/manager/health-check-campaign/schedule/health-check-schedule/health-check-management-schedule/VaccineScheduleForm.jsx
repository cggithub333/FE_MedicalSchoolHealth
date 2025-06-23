import React, { useEffect, useState } from "react";
import "./StyleVaccineScheduleForm.scss";
import VaccineInjectionList from "../health-check-management-details/VaccineInjectionList";

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

const VaccineScheduleForm = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    const [diseases, setDiseases] = useState([]);
    const [shiftsData, setShiftsData] = useState({});
    const [loading, setLoading] = useState(true);
    const [showInjectionList, setShowInjectionList] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null);

    useEffect(() => {
        fetch("/fake_database.json")
            .then((res) => res.json())
            .then((data) => {
                setCampaigns(data.vaccinationCampaign);
                setVaccines(data.vaccines);
                setDiseases(data.diseases);
                setShiftsData(data.shifts || {});
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="vaccine-schedule-root">Loading...</div>;
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
                            top: "5px"
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
                <VaccineInjectionList shift={selectedShift} />
            </div>
        );
    }

    return (
        <div className="vaccine-schedule-root">
            {campaigns.map((campaign) => {
                const vaccine = vaccines.find(
                    (v) => v.id === campaign.vaccineId
                );
                const disease = diseases.find(
                    (d) => d.id === campaign.disease_id
                );
                if (disease?.name === "Influenza" && shiftsData.influenza) {
                    const firstDay = campaign.startDate;
                    const secondDay = campaign.endDate;
                    const firstDayShifts = shiftsData.influenza.firstDay;
                    const secondDayShifts = shiftsData.influenza.secondDay;
                    return (
                        <div
                            className="vaccine-schedule-card"
                            key={campaign.campaignId}
                        >
                            <div className="vaccine-schedule-header">
                                <div className="vaccine-schedule-header-icon">
                                    <span className="vaccine-icon">+</span>
                                </div>
                                <div className="vaccine-schedule-header-info">
                                    <h2 className="vaccine-campaign-title">
                                        {vaccine?.name ||
                                            campaign.vaccineName ||
                                            "Vaccine Campaign"}{" "}
                                    </h2>
                                    <div className="vaccine-schedule-desc">
                                        {campaign.notes}
                                    </div>
                                </div>
                            </div>
                            <div className="vaccine-schedule-shifts influenza-rows">
                                <div className="shift-row">
                                    <div className="shift-row-date">
                                        {firstDay} (Day 1)
                                    </div>
                                    <div className="shift-row-cards">
                                        {firstDayShifts.map((shift) => {
                                            let status = shift.status;
                                            if (shift.filled >= shift.capacity)
                                                status = "Full";
                                            else if (
                                                shift.filled >=
                                                shift.capacity - 2
                                            )
                                                status = "Almost Full";
                                            else status = "Available";
                                            return (
                                                <div
                                                    className={`shift-card ${statusColors[status]}`}
                                                    key={shift.id}
                                                >
                                                    <div className="shift-title">
                                                        {shift.name}
                                                    </div>
                                                    <div className="shift-time">
                                                        <span
                                                            role="img"
                                                            aria-label="clock"
                                                        >
                                                            🕒
                                                        </span>{" "}
                                                        {shift.time}
                                                    </div>
                                                    <div className="shift-status">
                                                        {status ===
                                                            "Almost Full" ? (
                                                            <span className="almost-full">
                                                                Almost Full
                                                            </span>
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
                                                                    width: `${(shift.filled /
                                                                        shift.capacity) *
                                                                        100
                                                                        }%`,
                                                                    background:
                                                                        statusBarColors[
                                                                        status
                                                                        ],
                                                                }}
                                                            />
                                                        </span>
                                                        <span className="shift-capacity-count">
                                                            {shift.filled}/
                                                            {shift.capacity}
                                                        </span>
                                                    </div>
                                                    <div className="shift-actions">
                                                        <button
                                                            className="view-btn"
                                                            style={{
                                                                background:
                                                                    "#388e3c",
                                                                color: "#fff",
                                                                border: "none",
                                                                borderRadius: 6,
                                                                padding:
                                                                    "7px 16px",
                                                                fontWeight: 600,
                                                                fontSize: 15,
                                                                cursor: "pointer",
                                                                width: "100%",
                                                                boxShadow:
                                                                    "0 1px 4px rgba(56,142,60,0.08)",
                                                                transition:
                                                                    "background 0.2s",
                                                            }}
                                                            onMouseOver={(e) =>
                                                            (e.currentTarget.style.background =
                                                                "#2e7031")
                                                            }
                                                            onMouseOut={(e) =>
                                                            (e.currentTarget.style.background =
                                                                "#388e3c")
                                                            }
                                                            onClick={() => {
                                                                setShowInjectionList(
                                                                    true
                                                                );
                                                                setSelectedShift(
                                                                    shift
                                                                );
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
                                <div className="shift-row">
                                    <div className="shift-row-date">
                                        {secondDay} (Day 2)
                                    </div>
                                    <div className="shift-row-cards">
                                        {secondDayShifts.map((shift) => {
                                            let status = shift.status;
                                            if (shift.filled >= shift.capacity)
                                                status = "Full";
                                            else if (
                                                shift.filled >=
                                                shift.capacity - 2
                                            )
                                                status = "Almost Full";
                                            else status = "Available";
                                            return (
                                                <div
                                                    className={`shift-card ${statusColors[status]}`}
                                                    key={shift.id}
                                                >
                                                    <div className="shift-title">
                                                        {shift.name}
                                                    </div>
                                                    <div className="shift-time">
                                                        <span
                                                            role="img"
                                                            aria-label="clock"
                                                        >
                                                            🕒
                                                        </span>{" "}
                                                        {shift.time}
                                                    </div>
                                                    <div className="shift-status">
                                                        {status ===
                                                            "Almost Full" ? (
                                                            <span className="almost-full">
                                                                Almost Full
                                                            </span>
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
                                                                    width: `${(shift.filled /
                                                                        shift.capacity) *
                                                                        100
                                                                        }%`,
                                                                    background:
                                                                        statusBarColors[
                                                                        status
                                                                        ],
                                                                }}
                                                            />
                                                        </span>
                                                        <span className="shift-capacity-count">
                                                            {shift.filled}/
                                                            {shift.capacity}
                                                        </span>
                                                    </div>
                                                    <div className="shift-actions">
                                                        <button
                                                            className="view-btn"
                                                            style={{
                                                                background:
                                                                    "#388e3c",
                                                                color: "#fff",
                                                                border: "none",
                                                                borderRadius: 6,
                                                                padding:
                                                                    "7px 16px",
                                                                fontWeight: 600,
                                                                fontSize: 15,
                                                                cursor: "pointer",
                                                                width: "100%",
                                                                boxShadow:
                                                                    "0 1px 4px rgba(56,142,60,0.08)",
                                                                transition:
                                                                    "background 0.2s",
                                                            }}
                                                            onMouseOver={(e) =>
                                                            (e.currentTarget.style.background =
                                                                "#2e7031")
                                                            }
                                                            onMouseOut={(e) =>
                                                            (e.currentTarget.style.background =
                                                                "#388e3c")
                                                            }
                                                            onClick={() => {
                                                                setShowInjectionList(
                                                                    true
                                                                );
                                                                setSelectedShift(
                                                                    shift
                                                                );
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
                            {/* Add confirmation button at the bottom of the card, aligned right and styled for a modern look */}

                            <button
                                className="confirm-campaign-btn"
                                style={{
                                    padding: "10px 28px",
                                    background:
                                        "linear-gradient(90deg, #43a047 60%, #388e3c 100%)",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 8,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    fontSize: 17,
                                    boxShadow: "0 2px 8px rgba(67,160,71,0.08)",
                                    transition:
                                        "background 1s, box-shadow 0.4s",
                                    width: "fit-content",
                                    marginLeft: "auto",
                                }}
                                onMouseOver={(e) =>
                                (e.currentTarget.style.background =
                                    "#388e3c")
                                }
                                onMouseOut={(e) =>
                                (e.currentTarget.style.background =
                                    "linear-gradient(90deg, #43a047 60%, #388e3c 100%)")
                                }
                                onClick={() =>
                                    alert("Campaign marked as finished!")
                                }
                            >
                                finished
                            </button>
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default VaccineScheduleForm;
