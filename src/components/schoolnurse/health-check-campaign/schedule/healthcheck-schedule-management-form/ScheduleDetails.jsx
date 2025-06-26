// ScheduleDetails.jsx
import React, { useState } from "react";
import useDiseaseByPupilId from "../../../../../hooks/schoolnurse/healthcheck/useDiseaseHealthCheck";
import "./StyleScheduleDetails.scss";

const ScheduleDetails = ({ pupilId, onBack }) => {
    const { diseaseData, isLoading } = useDiseaseByPupilId(pupilId);
    const [notes, setNotes] = useState({});
    const [checked, setChecked] = useState({});

    // Defensive: handle both array and object response
    let sensitive_disease = [];
    let pupil_id = "";
    let campaign_id = "";
    if (Array.isArray(diseaseData)) {
        const found = diseaseData.find(p => p.pupil_id === pupilId);
        sensitive_disease = found?.sensitive_disease || [];
        pupil_id = found?.pupil_id || "";
        campaign_id = found?.campaign_id || "";
    } else {
        sensitive_disease = diseaseData?.sensitive_disease || [];
        pupil_id = diseaseData?.pupil_id;
        campaign_id = diseaseData?.campaign_id;
    }

    // Load notes and checked from localStorage on mount
    React.useEffect(() => {
        if (!pupil_id) return;
        const saved = localStorage.getItem(`healthcheck_notes_${pupil_id}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setNotes(parsed.notes || {});
                setChecked(parsed.checked || {});
            } catch { }
        }
    }, [pupil_id]);

    // Save notes and checked to localStorage whenever they change
    React.useEffect(() => {
        if (!pupil_id) return;
        localStorage.setItem(
            `healthcheck_notes_${pupil_id}`,
            JSON.stringify({ notes, checked })
        );
    }, [notes, checked, pupil_id]);

    const handleCheck = (diseaseId) => {
        setChecked(prev => ({ ...prev, [diseaseId]: !prev[diseaseId] }));
    };

    const handleNoteChange = (diseaseId, value) => {
        setNotes(prev => ({ ...prev, [diseaseId]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(
            `Đã lưu kết quả kiểm tra cho học sinh ${pupil_id} (Chiến dịch: ${campaign_id})!\n` +
            sensitive_disease.map(d => `- ${d.name}: ${checked[d.disease_id] ? '✔️' : '❌'}\nGhi chú: ${notes[d.disease_id] || ''}`).join('\n')
        );
    };

    if (isLoading) return <div>Đang tải dữ liệu...</div>;
    if (!sensitive_disease.length) return <div>Không tìm thấy học sinh hoặc dữ liệu.</div>;

    return (
        <form
            onSubmit={handleSubmit}
            className="schedule-details-form"
        >
            <button
                type="button"
                onClick={onBack}
                className="schedule-details-back-btn"
            >
                Quay lại
            </button>
            <h2 className="schedule-details-title">
                Khám sức khỏe học sinh {pupil_id} - Chiến dịch {campaign_id}
            </h2>
            <table className="schedule-details-table">
                <thead>
                    <tr>
                        <th>✅</th>
                        <th>Tên bệnh</th>
                        <th>Ghi chú</th>
                    </tr>
                </thead>
                <tbody>
                    {sensitive_disease.map(disease => (
                        <tr key={disease.disease_id}>
                            <td style={{ textAlign: "center" }}>
                                <input
                                    type="checkbox"
                                    checked={!!checked[disease.disease_id]}
                                    onChange={() => handleCheck(disease.disease_id)}
                                />
                            </td>
                            <td>{disease.name}</td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Nhập ghi chú..."
                                    value={notes[disease.disease_id] || ""}
                                    onChange={e => handleNoteChange(disease.disease_id, e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ textAlign: "right" }}>
                <button
                    type="submit"
                    className="schedule-details-submit"
                >
                    Lưu kết quả
                </button>
            </div>
        </form>
    );
};

export default ScheduleDetails;
