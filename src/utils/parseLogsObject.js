
/*
  example: const test = "+ School Nurse's name: Vy Thủy\n\n+ Disease: Common cold with dry throat; Medication: Honey syrup; Unit & Usage: 5ml to soothe dry throat and suppress cough; Schedule: After breakfast: 9h00-9h30; Given: Yes; Given Time: 7:26:15 PM\n\n+ Session Info: Session 1 (09:30 - 10:00)";
  {
    diseaseInfor: {
      disease: 'Common cold with dry throat',
      medication: 'Honey syrup',
      unitUsage: '5ml to soothe dry throat and suppress cough',
      schedule: 'After breakfast: 9h00-9h30',
      given: 'Yes',
      givenTime: '7:26:15 PM'
    },
    nurseName: 'Vy Thủy',
    sessionInfo: 'Session 1 (09:30 - 10:00)'
  }
*/

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