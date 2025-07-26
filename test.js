export const parseMedicalInfo = (input) => {
  const result = {
    diseaseInfor: {}
  };

  // Step 1: Split the string into 3 parts by double newline
  const parts = input.split('\n\n');

  // Part 1: Nurse's name
  const nurseMatch = parts[0].match(/\+ School Nurse's name:\s*(.+)/);
  if (nurseMatch) {
    result.nurseName = nurseMatch[1];
  }

  // Part 2: Disease & medication details
  if (parts[1]) {
    const details = parts[1].replace(/^\+ /, '').split(';');
    details.forEach(item => {
      const [key, ...rest] = item.split(':');
      const value = rest.join(':').trim();
      if (key && value) {
        const camelKey = key.trim()
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, '')
          .replace(/(?:^| )([a-z])/g, (_, c) => c.toUpperCase())
          .replace(/ /g, '');
        const finalKey = camelKey.charAt(0).toLowerCase() + camelKey.slice(1);
        result.diseaseInfor[finalKey] = value;
      }
    });
  }

  // Part 3: Session Info
  const sessionMatch = parts[2]?.match(/\+ Session Info:\s*(.+)/);
  if (sessionMatch) {
    result.sessionInfo = sessionMatch[1];
  }

  return result;
}

export function getDDMMYYYYFromISOString(isoString) {
  // Converts an ISO date string to 'dd-mm-yyyy'
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

const medicationLogs = [
  {
    logId: 2,
    givenTime: "27-07-2025 23:11:48",
    note: "+ School Nurse's name: Thủy Vy\n\n+ Disease: Common cold with cough; Medication: Dextromethorphan; Unit & Usage: 1 capsule taken by mouth to suppress dry cough; Schedule: After breakfast: 9h00-9h30; Given: Yes; Given Time: 11:11:32 PM\n\n+ Session: 1 (9:30-10:15)",
    status: "GIVEN"
  },
  {
    logId: 3,
    givenTime: "26-07-2025 23:12:10",
    note: "+ School Nurse's name: Thủy Vy\n\n+ Disease: Common cold with cough; Medication: Strepsils lozenges; Unit & Usage: 1 lozenge dissolved slowly in mouth to soothe throat; Schedule: Before lunch: 10h30-11h00; Given: Yes; Given Time: 11:12:07 PM\n\n+ Session: 2 (10:30-11:15)",
    status: "GIVEN"
  },
  {
    logId: 4,
    givenTime: "26-07-2025 23:12:20",
    note: "+ School Nurse's name: Thủy Vy\n\n+ Disease: Common cold with cough; Medication: Strepsils lozenges; Unit & Usage: 1 lozenge dissolved slowly in mouth to soothe throat; Schedule: Before lunch: 10h30-11h00; Given: Yes; Given Time: 11:12:15 PM\n\n+ Session: 2 (10:30-11:15)",
    status: "GIVEN"
  }
];

// Vào cái ngày hôm nay, tại session đang chọn này, đứa trẻ (pupil) này đã được cho uống cái loại thuốc kia chưa


/*
  <<example>>
  const recorded = {
    givenTime: "27-07-2025 12:22:34",
    session: 1,
    disease: "Common cold with cough",
    medication: "Dextromethorphan",
  }
*/
const isTakenThisPupilThisSessionThisDate = (recorded, medicationLogs) => {
  const schedules = ['After breakfast: 9h00-9h30', 'Before lunch: 10h30-11h00', 'After lunch: 11h30-12h00']; // ~ session (1, 2, 3)
  const currentDate = getDDMMYYYYFromISOString((new Date).toISOString()); // format: dd-mm-yyyy;
  
  for(let medicationLog of medicationLogs) {
    const givenTime = recorded.givenTime.split(/\s+/)[0];
    const noteObj = parseMedicalInfo(medicationLog.note);
    
    console.log(noteObj);
    if (givenTime && givenTime !== currentDate)
      break;

    let diseaseInfor = undefined;
    if (noteObj && noteObj.diseaseInfor) {
      diseaseInfor = noteObj.diseaseInfor;
    }
    let session = schedules.reduce((acc, schedule, idx) => {
      let convertedSchedule = "";
      
      if (diseaseInfor) {
        convertedSchedule = diseaseInfor.schedule;
      }
      if (!convertedSchedule) {
        return acc + 0;
      }
      //else:
      if (convertedSchedule === schedule) {
        return (idx + 1);
      } else {
        return acc + 0;
      }
    }, 0);
    if (session !== recorded.session)
      break;
    if (diseaseInfor) {
      if ((diseaseInfor.disease !== recorded.disease) || (diseaseInfor.medication !== recorded.medication)) 
        break;
    }
    return true; // has already taken medication;
  }
  return false; // has not already taken medication for this date, this session, this pupil;
}

const recorded = {
  givenTime: "27-07-2025 12:22:34",
  session: 1,
  disease: "Common cold with cough",
  medication: "Dextromethorphan",
}

console.log("result: ", isTakenThisPupilThisSessionThisDate(recorded, medicationLogs));