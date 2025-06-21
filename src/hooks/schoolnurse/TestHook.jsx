import { useState } from 'react';
import usePupilsByGrade from './usePupilsByGrade'; // adjust path if needed

const PupilsByGradeList = () => {
    const [grade, setGrade] = useState(1);
    const { pupils, isLoading } = usePupilsByGrade(grade);

    return (
        <div>
            <h1>Pupils By Grade</h1>

            <label>
                Select Grade:{" "}
                <select value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
                    <option value={1}>Grade 1</option>
                    <option value={2}>Grade 2</option>
                    <option value={3}>Grade 3</option>
                    {/* add more if needed */}
                </select>
            </label>

            {isLoading && <p>Loading...</p>}

            <ul>
                {pupils.map((pupil) => (
                    <li key={pupil.pupilId}>
                        {pupil.firstName} {pupil.lastName} — Grade {pupil.Grade}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PupilsByGradeList;
