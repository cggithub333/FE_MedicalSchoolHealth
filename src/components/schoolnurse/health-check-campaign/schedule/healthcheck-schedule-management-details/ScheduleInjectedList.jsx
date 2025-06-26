import React, { useEffect, useState } from "react";
import "./StyleScheduleInjectedList.scss";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import usePupilsByGrade from "../../../../../hooks/schoolnurse/healthcheck/usePupilsByGrade";
import ScheduleDetails from "../healthcheck-schedule-management-form/ScheduleDetails";

const ScheduleInjectedList = ({ shift, onBack }) => {
    const grade = Number(shift?.grade ?? shift?.Grade ?? 1);
    const { pupils = [], isLoading } = usePupilsByGrade(grade);
    const [students, setStudents] = useState([]);
    const [selectedPupilId, setSelectedPupilId] = useState(null);

    useEffect(() => {
        const sharedKey = `healthcheck_students_grade_${grade}`;
        let saved = localStorage.getItem(sharedKey);
        if (saved) {
            try {
                setStudents(JSON.parse(saved));
                return;
            } catch (e) { }
        }
        if (pupils && pupils.length > 0) {
            setStudents(
                pupils.map((pupil) => ({
                    ...pupil,
                    completed: false,
                    time: "",
                    notes: "",
                }))
            );
        } else {
            setStudents([]);
        }
    }, [pupils, grade]);

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

    const handleSave = () => {
        const sharedKey = `healthcheck_students_grade_${grade}`;
        localStorage.setItem(sharedKey, JSON.stringify(students));
        alert("Saved successfully!");
    };

    if (isLoading) return <div className="vaccine-injection-root">Loading...</div>;

    const sharedKey = `healthcheck_students_grade_${grade}`;
    let completedCount = 0;
    let total = pupils.length;
    let saved = localStorage.getItem(sharedKey);
    if (saved) {
        try {
            const arr = JSON.parse(saved);
            completedCount = arr.filter(s => s.completed).length;
        } catch (e) {
            completedCount = students.filter((s) => s.completed).length;
        }
    } else {
        completedCount = students.filter((s) => s.completed).length;
    }
    const remaining = total - completedCount;

    // Show ScheduleDetails if a pupil is selected
    if (selectedPupilId) {
        return <ScheduleDetails pupilId={selectedPupilId} onBack={() => setSelectedPupilId(null)} />;
    }

    return (
        <div className="vaccine-injection-root">
            <div className="vaccine-injection-header-container">
                <div className="vaccine-injection-header">
                    <div>
                        <h2>Health Check - Grade {grade}</h2>
                        <div className="vaccine-injection-meta">
                            <span>{shift?.time}</span>
                            <span>• Grade {grade}</span>
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
                                width: `${(completedCount / (total || 1)) * 100}%`,
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
                            <th className="status-th">Status</th>
                            <th className="info-th">Student Information</th>
                            <th className="grade-th">Grade</th>
                            <th className="time-th">Time Completed</th>
                            <th className="notes-th">Notes</th>
                            <th className="details-th">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, idx) => (
                            <tr
                                key={student.pupilId}
                                className={`data-row${student.completed ? " completed-row" : ""}`}
                            >
                                <td style={{ textAlign: 'center' }}>
                                    <Checkbox
                                        checked={student.completed}
                                        onChange={() => handleCheck(idx)}
                                        color="success"
                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                    />
                                </td>
                                <td>
                                    <div className="student-info">
                                        <img src={student.avatar} alt="avatar" className="student-avatar" />
                                        <div>
                                            <div className="student-name">
                                                {student.lastName} {student.firstName}
                                            </div>
                                            <div className="student-id">
                                                ID: {student.pupilId}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="grade-td">{student.Grade}</td>
                                <td className={`time-completed${student.completed ? " completed" : ""}`}>
                                    {student.completed ? student.time : "—"}
                                </td>
                                <td className="notes-td">
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        value={student.notes}
                                        onChange={e => handleNoteChange(idx, e.target.value)}
                                        placeholder="Add notes..."
                                        className="notes-textfield"
                                    />
                                </td>
                                <td className="details-td">
                                    <button
                                        className="details-btn"
                                        onClick={() => setSelectedPupilId(student.pupilId)}
                                    >
                                        <CheckIcon className="details-icon" />
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="vaccine-injection-footer">
                <button className="save-btn" onClick={onBack}>Back</button>
                <button className="save-btn" onClick={handleSave}>Save</button>
            </div>
        </div>
    );
};

export default ScheduleInjectedList;
