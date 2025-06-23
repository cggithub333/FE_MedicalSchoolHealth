import React, { useEffect, useState } from "react";
import "./VaccineInjectionList.scss";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

const VaccineInjectionList = () => {
    const [students, setStudents] = useState([]);
    const [shifts, setShifts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/fake_database.json")
            .then((res) => res.json())
            .then((data) => {
                // Remove default completed/time for all students
                const normalized = (data.initialStudents || []).map((s) => ({
                    ...s,
                    completed: false,
                    time: "",
                }));
                setStudents(normalized);
                setShifts(data.shifts || {});
                setLoading(false);
            });
    }, []);

    const handleCheck = (index) => {
        const updated = [...students];
        updated[index].completed = !updated[index].completed;
        if (updated[index].completed) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            updated[index].time = `${hours}:${minutes}`;
        } else {
            updated[index].time = "";
        }
        setStudents(updated);
    };

    const handleNoteChange = (index, newValue) => {
        const updated = [...students];
        updated[index].notes = newValue;
        setStudents(updated);
    };

    // Find the current vaccine and its shift data
    const vaccineName = "Influenza";
    const vaccineShifts = shifts.influenza || null;
    const today = new Date().toISOString().slice(0, 10);

    // For demo, show only the selected shift (e.g., firstDay[0])
    // In a real app, you would pass the selected shift and date as props or via route params
    const selectedShift = vaccineShifts?.firstDay?.[0];
    const selectedDate = "2025-09-01"; // For demo, hardcoded to match the selected shift

    if (loading)
        return <div className="vaccine-injection-root">Loading...</div>;

    const completedCount = students.filter((s) => s.completed).length;
    const total = students.length;
    const remaining = total - completedCount;
    const label = { inputProps: { "aria-label": "Checkbox demo" } };
    return (
        <div className="vaccine-injection-root">
            <div className="vaccine-injection-header-container">
                <div className="vaccine-injection-header">
                    <div>
                        <h2>{vaccineName} Vaccination Event</h2>
                        <div className="vaccine-injection-meta">
                            <span>{selectedDate}</span>
                            {selectedShift && (
                                <span>
                                    • {selectedShift.name} ({selectedShift.time}
                                    )
                                </span>
                            )}
                            <span>• Grade 1</span>
                            <span>• School Health Office</span>
                        </div>
                    </div>
                    <div className="vaccine-injection-header-actions">
                        <button className="export-btn">Export Report</button>
                    </div>
                </div>
                <div className="vaccine-injection-progress">
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${(completedCount / total) * 100}%`,
                            }}
                        />
                    </div>
                    <div className="progress-stats">
                        <span className="completed">
                            {completedCount} Completed
                        </span>
                        <span className="remaining">{remaining} Remaining</span>
                        <span className="total">{total} Total Students</span>
                    </div>
                </div>
            </div>
            <div className="vaccine-injection-alerts">
                <table className="vaccine-injection-table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Student Information</th>
                            <th>Grade</th>
                            <th>Previous Doses</th>
                            <th>Notes</th>
                            <th>Time Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, idx) => (
                            <tr
                                key={student.id}
                                className={
                                    student.completed ? "completed-row" : ""
                                }
                            >
                                <td>
                                    <Checkbox
                                        checked={student.completed}
                                        onChange={() => handleCheck(idx)}
                                        color="success"
                                    />
                                </td>
                                <td>
                                    <div className="student-info">
                                        <div className="student-name">
                                            {student.name}
                                        </div>
                                        <div className="student-id">
                                            ID: {student.id} • Parent:{" "}
                                            {student.parent}
                                        </div>
                                    </div>
                                </td>
                                <td>{student.grade}</td>
                                <td>
                                    <span
                                        className={`dose-badge dose-${student.dose
                                            .replace(/\s/g, "")
                                            .toLowerCase()}`}
                                    >
                                        {student.dose}
                                    </span>
                                </td>
                                <td>
                                    <TextField
                                        label="Notes"
                                        variant="outlined"
                                    />
                                </td>
                                <td className="time-completed">
                                    {student.completed ? student.time : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="vaccine-injection-footer">
                <button className="save-btn">Save Progress</button>
                <button className="complete-btn">Complete Session</button>
            </div>
        </div>
    );
};

export default VaccineInjectionList;
